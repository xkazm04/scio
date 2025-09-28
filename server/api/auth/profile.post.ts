export default defineEventHandler(async (event) => {
  try {
    console.log('Profile creation API called - POST /api/auth/profile');
    
    const body = await readBody(event);
    console.log('Received profile data:', body);
    
    // Get authorization header (required for profile creation)
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No authorization token provided',
      });
    }
    
    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    if (!token || token.length < 10) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token format',
      });
    }
    
    // Initialize Supabase client to verify token and get user data
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from the session/token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth verification error:', authError);
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid or expired token',
      });
    }
    
    console.log('Authenticated user from token:', { id: user.id, email: user.email });
    
    if (!body.fullName || !body.role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chybí povinná pole: fullName a role',
      });
    }

    console.log('Profile registration attempt for user:', user.id, user.email);
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }
    
    // Create user profile data using real OAuth user data
    const userProfileData = {
      id: user.id, // Use the Supabase auth user ID
      email: user.email!, // Use the real OAuth email
      full_name: body.fullName,
      role: body.role,
      avatar_url: body.avatarUrl || user.user_metadata?.avatar_url || null,
    };
    
    try {
      // Try to create user using Supabase client
      const { data: createdUser, error } = await db.users.create(userProfileData);
      
      if (error) {
        // Handle duplicate user (user already exists)
        if (error.code === '23505') { // PostgreSQL unique violation
          console.log('User already exists, attempting to update...');
          
          const { data: updatedUser, error: updateError } = await db.users.update(user.id, {
            full_name: userProfileData.full_name,
            role: userProfileData.role,
            avatar_url: userProfileData.avatar_url,
          });
          
          if (updateError) {
            throw updateError;
          }
          
          console.log('User successfully updated in database:', updatedUser?.id);
          return {
            success: true,
            user: updatedUser,
            message: 'Profil úspěšně aktualizován v databázi',
          };
        } else {
          throw error;
        }
      }
      
      console.log('User successfully created in database:', createdUser?.id);
      
      return {
        success: true,
        user: createdUser,
        message: 'Profil úspěšně vytvořen v databázi',
      };
      
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Chyba při ukládání do databáze: ' + (dbError.message || 'Neznámá chyba'),
      });
    }

  } catch (error: any) {
    console.error('Profile creation error:', error);
    
    if (error?.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při vytváření profilu',
    });
  }
});