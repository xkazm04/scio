import { ref, computed, watch, readonly } from 'vue';
import type { User } from '@supabase/supabase-js';
import type { User as DatabaseUser, UserRole, AuthState } from '~/lib/database/types';

// ==========================================
// SINGLETON STATE - Module-level (shared across all components)
// ==========================================

// This ensures ONE instance of auth state for the entire app
const authState = ref<AuthState>({
  user: null,
  session: null,
  isLoggedIn: false,
  isLoading: true,
});

const isLoadingProfile = ref(false);
const loadedUserId = ref<string | null>(null);
let isInitialized = false;

// ==========================================
// COMPOSABLE - Returns the same state instance
// ==========================================

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  
  // Load user profile from database (can be called multiple times, but protected)
  const loadUserProfile = async (supabaseUser: User) => {
    // Prevent multiple simultaneous loads
    if (isLoadingProfile.value) {
      console.log('⏸️ Profile load already in progress, skipping...');
      return;
    }
    
    // Prevent loading the same user multiple times
    if (loadedUserId.value === supabaseUser.id && authState.value.user !== null) {
      console.log('✅ User profile already loaded for:', supabaseUser.id);
      return;
    }
    
    try {
      isLoadingProfile.value = true;
      authState.value.isLoading = true;
      
      console.log('🔄 Loading profile for user:', supabaseUser.id);
      
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Create basic profile first to prevent infinite loops
      const basicProfile: DatabaseUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.email?.split('@')[0] || 
                  'User',
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: (supabaseUser.user_metadata?.role as UserRole) || 'teacher', // Use role from signup or default to teacher
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log('📝 Basic profile created with default role:', basicProfile.role);

      // Set basic state first to prevent infinite redirects
      authState.value = {
        user: basicProfile,
        session: sessionData.session,
        isLoggedIn: true,
        isLoading: false,
      };
      
      // Mark this user as loaded
      loadedUserId.value = basicProfile.id;
      
      // Store user ID immediately
      if (process.client) {
        localStorage.setItem('userId', basicProfile.id);
      }

      // Try to fetch profile from API (non-blocking)
      if (sessionData.session?.access_token) {
        try {
          console.log('🔍 Fetching profile from API with token...');
          const profileResponse = await $fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          }) as any;
          
          if (profileResponse.exists && profileResponse.user) {
            console.log('✅ Profile exists in database');
            console.log('🔑 User role from database:', profileResponse.user.role);
            
            // Update with profile data
            const Profile: DatabaseUser = {
              id: profileResponse.user.id,
              email: profileResponse.user.email,
              fullName: profileResponse.user.full_name || profileResponse.user.fullName || basicProfile.fullName,
              avatarUrl: profileResponse.user.avatar_url || profileResponse.user.avatarUrl,
              role: profileResponse.user.role as UserRole,
              createdAt: new Date(profileResponse.user.created_at || profileResponse.user.createdAt),
              updatedAt: new Date(profileResponse.user.updated_at || profileResponse.user.updatedAt),
            };

            authState.value.user = Profile;
            console.log('✨ AuthState updated - current role:', authState.value.user.role);
          } else {
            // User doesn't exist in database, create them
            console.log('👤 User not found in database, creating new profile...');
            try {
              const createResponse = await $fetch('/api/auth/profile', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${sessionData.session.access_token}`,
                },
                body: {
                  fullName: basicProfile.fullName,
                  role: basicProfile.role,
                  email: basicProfile.email,
                  avatarUrl: basicProfile.avatarUrl,
                },
              }) as any;

              if (createResponse.user) {
                console.log('✅ User profile created in database');
                const newProfile: DatabaseUser = {
                  id: createResponse.user.id,
                  email: createResponse.user.email,
                  fullName: createResponse.user.full_name || createResponse.user.fullName,
                  avatarUrl: createResponse.user.avatar_url || createResponse.user.avatarUrl,
                  role: createResponse.user.role as UserRole,
                  createdAt: new Date(createResponse.user.created_at || createResponse.user.createdAt),
                  updatedAt: new Date(createResponse.user.updated_at || createResponse.user.updatedAt),
                };
                authState.value.user = newProfile;
                console.log('✨ AuthState updated with new profile - role:', authState.value.user.role);
              }
            } catch (createError) {
              console.error('❌ Failed to create user profile:', createError);
              console.warn('🔄 Using basic profile fallback');
            }
          }
        } catch (apiError) {
          console.error('❌ API Error fetching profile:', apiError);
          console.warn('🔄 Using basic profile fallback');
        }
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Even on error, try to create a basic profile to prevent infinite loops
      const fallbackProfile: DatabaseUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: supabaseUser.user_metadata?.full_name || 'User',
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: (supabaseUser.user_metadata?.role as UserRole) || 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authState.value = {
        user: fallbackProfile,
        session: null,
        isLoggedIn: true,
        isLoading: false,
      };
      
      loadedUserId.value = fallbackProfile.id;

      if (process.client) {
        localStorage.setItem('userId', fallbackProfile.id);
      }
    } finally {
      isLoadingProfile.value = false;
    }
  };

  // Initialize watch ONCE per app (not per component)
  if (!isInitialized) {
    console.log('🎬 Initializing auth watch (ONE TIME ONLY)');
    isInitialized = true;
    
    // Watch for user changes
    watch(supabaseUser, async (newUser, oldUser) => {
      // Only process if the user actually changed
      if (newUser?.id === oldUser?.id) {
        console.log('👤 Same user detected, skipping profile reload');
        return;
      }
      
      if (newUser) {
        console.log('👤 User changed, loading profile for:', newUser.id);
        await loadUserProfile(newUser);
      } else {
        console.log('👋 User logged out, clearing auth state');
        authState.value = {
          user: null,
          session: null,
          isLoggedIn: false,
          isLoading: false,
        };
        
        loadedUserId.value = null;
        
        if (process.client) {
          localStorage.removeItem('userId');
        }
      }
    });
    
    // Perform initial load once
    if (supabaseUser.value && !loadedUserId.value) {
      console.log('🔄 Initial load for user:', supabaseUser.value.id);
      loadUserProfile(supabaseUser.value);
    } else if (!supabaseUser.value) {
      authState.value.isLoading = false;
    }
  }

  // Computed properties
  const user = computed(() => authState.value.user);
  const session = computed(() => authState.value.session);
  const isLoggedIn = computed(() => authState.value.isLoggedIn);
  const isLoading = computed(() => authState.value.isLoading);
  const userRole = computed(() => authState.value.user?.role);
  
  // Role checks
  const isStudent = computed(() => userRole.value === 'student');
  const isTeacher = computed(() => userRole.value === 'teacher');
  const isAdmin = computed(() => userRole.value === 'admin');

  // Check if user is properly loaded (prevents infinite redirects)
  const isUserLoaded = computed(() => {
    return !authState.value.isLoading && (authState.value.user !== null || !supabaseUser.value);
  });

  // Get current user ID (useful for API calls)
  const getCurrentUserId = (): string | null => {
    if (authState.value.user?.id) {
      return authState.value.user.id;
    }
    
    if (process.client) {
      return localStorage.getItem('userId');
    }
    
    return null;
  };

  // Sign in with Google
  const signInWithGoogle = async (options?: { role?: UserRole }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            ...(options?.role && { role: options.role }),
          },
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { data: null, error };
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { data: null, error };
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If user is created but not confirmed, return success
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          data, 
          error: null, 
          needsConfirmation: true,
          message: 'Please check your email to confirm your account.'
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Email sign-up error:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear local state
      authState.value = {
        user: null,
        session: null,
        isLoggedIn: false,
        isLoading: false,
      };
      
      loadedUserId.value = null;

      if (process.client) {
        localStorage.removeItem('userId');
      }

      // Redirect to home
      await navigateTo('/');
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<DatabaseUser>) => {
    if (!authState.value.user) {
      throw new Error('No user logged in');
    }

    try {
      authState.value.user = {
        ...authState.value.user,
        ...updates,
        updatedAt: new Date(),
      };

      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  // Change user role (admin only)
  const changeUserRole = async (userId: string, newRole: UserRole) => {
    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required');
    }

    try {
      console.log('Changing user role:', { userId, newRole });
      return { error: null };
    } catch (error) {
      console.error('Role change error:', error);
      return { error };
    }
  };

  // Check if user has permission
  const hasPermission = (permission: string): boolean => {
    if (!authState.value.user) return false;
    
    const role = authState.value.user.role;
    
    const permissions: Record<UserRole, string[]> = {
      student: [
        'view_groups',
        'join_groups',
        'leave_groups',
        'view_assignments',
        'submit_assignments',
        'view_grades',
        'edit_own_profile',
      ],
      teacher: [
        'view_groups',
        'create_groups',
        'edit_groups',
        'delete_groups',
        'manage_group_members',
        'view_assignments',
        'create_assignments',
        'edit_assignments',
        'grade_assignments',
        'view_students',
        'manage_students',
        'edit_own_profile',
      ],
      admin: [
        '*',
      ],
    };

    const rolePermissions = permissions[role] || [];
    
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
  };

  // Require authentication (for use in pages)
  const requireAuth = (redirectTo: string = '/auth/login') => {
    if (!isLoggedIn.value && !isLoading.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required',
      });
    }
  };

  // Require specific role
  const requireRole = (requiredRole: UserRole | UserRole[]) => {
    requireAuth();
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const currentRole = userRole.value;
    
    if (!currentRole || !roles.includes(currentRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Insufficient permissions',
      });
    }
  };

  return {
    // State
    user: readonly(user),
    session: readonly(session),
    isLoggedIn: readonly(isLoggedIn),
    isLoading: readonly(isLoading),
    userRole: readonly(userRole),
    isStudent: readonly(isStudent),
    isTeacher: readonly(isTeacher),
    isAdmin: readonly(isAdmin),
    
    // Methods
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    changeUserRole,
    hasPermission,
    requireAuth,
    requireRole,
    loadUserProfile,
    getCurrentUserId,
    isUserLoaded,
  };
};