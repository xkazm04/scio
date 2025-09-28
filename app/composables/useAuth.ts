import { ref, computed, watch } from 'vue';
import type { User } from '@supabase/supabase-js';
import type { User as DatabaseUser, UserRole, AuthState } from '~/lib/database/types';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  
  // Internal state
  const authState = ref<AuthState>({
    user: null,
    session: null,
    isLoggedIn: false,
    isLoading: true,
  });
  
  // Prevent multiple simultaneous profile loads
  const isLoadingProfile = ref(false);

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

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: User) => {
    // Prevent multiple simultaneous loads
    if (isLoadingProfile.value) {
      return;
    }
    
    try {
      isLoadingProfile.value = true;
      authState.value.isLoading = true;
      
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
        role: 'student', // Default role will be overridden by database data
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Set basic state first to prevent infinite redirects
      authState.value = {
        user: basicProfile,
        session: sessionData.session,
        isLoggedIn: true,
        isLoading: false,
      };

      // Store user ID immediately
      if (process.client) {
        localStorage.setItem('userId', basicProfile.id);
      }

      // Try to fetch profile from API (non-blocking)
      if (sessionData.session?.access_token) {
        try {
          const profileResponse = await $fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          }) as any; // Cast to avoid type issues
          
          if (profileResponse.exists && profileResponse.user) {
            // Update with profile data
            const enhancedProfile: DatabaseUser = {
              id: profileResponse.user.id,
              email: profileResponse.user.email,
              fullName: profileResponse.user.full_name || profileResponse.user.fullName || basicProfile.fullName,
              avatarUrl: profileResponse.user.avatar_url || profileResponse.user.avatarUrl,
              role: profileResponse.user.role as UserRole,
              createdAt: new Date(profileResponse.user.created_at || profileResponse.user.createdAt),
              updatedAt: new Date(profileResponse.user.updated_at || profileResponse.user.updatedAt),
            };

            authState.value.user = enhancedProfile;
            console.log('Profile loaded with role:', enhancedProfile.role);
          }
        } catch (apiError) {
          console.warn('Could not fetch enhanced profile, using basic profile:', apiError);
          // Keep the basic profile we already set - don't fail here
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
        role: 'student', // Default fallback role
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authState.value = {
        user: fallbackProfile,
        session: null,
        isLoggedIn: true,
        isLoading: false,
      };

      if (process.client) {
        localStorage.setItem('userId', fallbackProfile.id);
      }
    } finally {
      isLoadingProfile.value = false;
    }
  };

  // Create user profile via API
  const createUserProfile = async (userProfile: DatabaseUser, accessToken: string) => {
    try {
      const response = await $fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: {
          fullName: userProfile.fullName,
          email: userProfile.email,
          role: userProfile.role,
          avatarUrl: userProfile.avatarUrl,
        },
      }) as any; // Cast to avoid type issues

      if (response.success && response.user) {
        const createdProfile: DatabaseUser = {
          id: response.user.id,
          email: userProfile.email, // Use the original email
          fullName: userProfile.fullName,
          avatarUrl: userProfile.avatarUrl,
          role: userProfile.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        authState.value.user = createdProfile;
        
        // Store user ID in localStorage
        if (process.client) {
          localStorage.setItem('userId', createdProfile.id);
        }
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Get current user ID (useful for API calls)
  const getCurrentUserId = (): string | null => {
    if (authState.value.user?.id) {
      return authState.value.user.id;
    }
    
    // Fallback to localStorage if available
    if (process.client) {
      return localStorage.getItem('userId');
    }
    
    return null;
  };

  // Check if user is properly loaded (prevents infinite redirects)
  const isUserLoaded = computed(() => {
    return !authState.value.isLoading && (authState.value.user !== null || !supabaseUser.value);
  });

  // Watch for user changes and handle no user scenario
  watch(supabaseUser, async (newUser) => {
    if (newUser) {
      await loadUserProfile(newUser);
    } else {
      authState.value = {
        user: null,
        session: null,
        isLoggedIn: false,
        isLoading: false,
      };
      
      // Clear stored user ID when user logs out
      if (process.client) {
        localStorage.removeItem('userId');
      }
    }
  }, { immediate: true });

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

      // Clear stored user ID
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
      // Here you would update the user in your database using Drizzle
      // For now, we'll just update the local state
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
      // Here you would update the user role in your database
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
    
    // Define role permissions
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
        '*', // Admin has all permissions
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