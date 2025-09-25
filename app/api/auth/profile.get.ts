export default defineEventHandler(async (event) => {
  try {
    console.log('Profile check API called - GET /api/auth/profile');
    
    // In a real implementation, you'd get the user from session or JWT
    // For now, we'll return that no profile exists to trigger registration flow
    return {
      exists: false,
      user: null,
    };

  } catch (error: any) {
    console.error('Profile check error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při kontrole profilu',
    });
  }
});