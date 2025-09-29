/**
 * Auth Plugin - Global Singleton
 * 
 * This ensures auth state is initialized ONCE per app instance,
 * not once per component that calls useAuth()
 */

export default defineNuxtPlugin(() => {
  // Initialize auth state immediately on app start
  // This runs ONCE for the entire app lifecycle
  const auth = useAuth();
  
  console.log('🔌 Auth plugin initialized - singleton instance created');
  
  // Return nothing - we just need to initialize it once
  // Components will use useAuth() to access the same instance
})
