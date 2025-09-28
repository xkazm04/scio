export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const { isUserLoaded } = useAuth();
  
  // Wait for auth state to be properly loaded
  if (!isUserLoaded.value) {
    // Still loading, don't redirect yet
    return;
  }
  
  // If user is not authenticated, redirect to login
  if (!user.value) {
    return navigateTo('/auth/login');
  }
});