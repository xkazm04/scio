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
    
    // Import Drizzle database
    const { rawDb: db } = await import('~/lib/database');
    const { users } = await import('~/lib/database/schema');
    const { eq } = await import('drizzle-orm');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }
    
    // Create user profile data using real OAuth user data (camelCase for Drizzle)
    const userProfileData = {
      id: user.id, // Use the Supabase auth user ID
      email: user.email!, // Use the real OAuth email
      fullName: body.fullName,
      role: body.role,
      avatarUrl: body.avatarUrl || user.user_metadata?.avatar_url || null,
    };
    
    try {
      // Check if user already exists first
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      
      if (existingUser.length > 0) {
        // User exists, update their profile
        const [updatedUser] = await db
          .update(users)
          .set({
            fullName: userProfileData.fullName,
            role: userProfileData.role,
            avatarUrl: userProfileData.avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))
          .returning();
        
        console.log('User successfully updated in database:', updatedUser?.id);
        return {
          success: true,
          user: updatedUser,
          message: 'Profil úspěšně aktualizován v databázi',
        };
      }
      
      // User doesn't exist, create new user
      const [createdUser] = await db
        .insert(users)
        .values(userProfileData)
        .returning();
      
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