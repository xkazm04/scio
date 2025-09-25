import type { UserRole } from '~/lib/database/types';

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  
  // First check if user is authenticated
  if (!user.value) {
    return navigateTo('/auth/login');
  }
  
  // For now, we'll assume the user is a teacher
  // In a real app, you'd fetch this from your database
  const userRole: UserRole = 'teacher'; // This should come from your user profile
  
  // Check if user has teacher role
  if (userRole !== 'teacher') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Teacher access required'
    });
  }
});