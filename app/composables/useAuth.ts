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

  // Computed properties
  const user = computed(() => authState.value.user);
  const session = computed(() => authState.value.session);
  const isLoggedIn = computed(() => authState.value.isLoggedIn);
  const isLoading = computed(() => authState.value.isLoading);
  const userRole = computed(() => authState.value.user?.role || 'student');
  
  // Role checks
  const isStudent = computed(() => userRole.value === 'student');
  const isTeacher = computed(() => userRole.value === 'teacher');
  const isAdmin = computed(() => userRole.value === 'admin');

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: User) => {
    try {
      authState.value.isLoading = true;
      
      // Get the current session
      const { data: session } = await supabase.auth.getSession();
      
      // Here you would fetch the user profile from your database
      // For now, we'll create a basic profile from Supabase data
      const userProfile: DatabaseUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: supabaseUser.user_metadata?.full_name || 
                  supabaseUser.email?.split('@')[0] || 
                  'User',
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: 'teacher', // This should be fetched from your database
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authState.value = {
        user: userProfile,
        session: session.session,
        isLoggedIn: true,
        isLoading: false,
      };
    } catch (error) {
      console.error('Error loading user profile:', error);
      authState.value.isLoading = false;
    }
  };

  // Watch Supabase user changes
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
        'view_assignments',
        'submit_assignments',
        'view_grades',
        'edit_own_profile',
      ],
      teacher: [
        'view_groups',
        'create_groups',
        'edit_groups',
        'view_assignments',
        'create_assignments',
        'edit_assignments',
        'grade_assignments',
        'view_students',
        'manage_students',
        'edit_own_profile',
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
    
    if (!roles.includes(userRole.value)) {
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
  };
};