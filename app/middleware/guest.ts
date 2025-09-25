export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  
  // If user is authenticated, redirect to dashboard
  if (user.value) {
    return navigateTo('/dashboard');
  }
});