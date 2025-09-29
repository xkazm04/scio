export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const { isUserLoaded } = useAuth();
  
  // Wait for auth state to be properly loaded
  if (!isUserLoaded.value) {
    console.log('🔒 Auth middleware: User still loading...');
    // Still loading, don't redirect yet
    return;
  }
  
  // If user is not authenticated, redirect to login
  if (!user.value) {
    console.log('🔒 Auth middleware: User not authenticated, redirecting to login');
    return navigateTo('/auth/login');
  }
  
  console.log('✅ Auth middleware: User authenticated, proceeding to:', to.path);
});