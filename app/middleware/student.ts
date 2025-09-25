import type { UserRole } from '~/lib/database/types';

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  
  // First check if user is authenticated
  if (!user.value) {
    return navigateTo('/auth/login');
  }
  
  // For now, we'll assume the user is a student
  // In a real app, you'd fetch this from your database
  const userRole: UserRole = 'student'; // This should come from your user profile
  
  // Check if user has student role
  if (userRole !== 'student') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Student access required'
    });
  }
});