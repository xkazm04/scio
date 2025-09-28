export default defineEventHandler(async (event) => {
  try {
    console.log('Profile check API called - GET /api/auth/profile');
    
    // Get authorization header (optional for this endpoint)
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) {
      // No auth header means this is likely the initial check during registration flow
      console.log('No auth header provided - returning profile does not exist');
      return {
        exists: false,
        user: null,
        requiresRegistration: true
      };
    }

    // If auth header is provided, validate it
    try {
      const token = authHeader.replace('Bearer ', '');
      
      if (!token || token.length < 10) {
        return {
          exists: false,
          user: null,
          error: 'Invalid token format'
        };
      }

      // Get user from Supabase auth to verify token and get real user data
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        
        // Verify the token and get user data
        const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token);
        
        if (authError || !authUser) {
          console.warn('Token validation failed:', authError);
          return {
            exists: false,
            user: null,
            error: 'Invalid or expired token'
          };
        }
        
        console.log('Token validated, checking database for user:', authUser.id);
        
        // Try to connect to database and check for user profile
        const { db } = await import('~/lib/database/connection');
        
        if (db) {
          // Try to find user in database using Supabase client
          const { data: user, error } = await db.users.findById(authUser.id);
          
          if (error) {
            // For database errors, log and treat as needs registration
            console.warn('Database query error (unexpected):', error);
            return {
              exists: false,
              user: null,
              requiresRegistration: true,
              authUser: {
                id: authUser.id,
                email: authUser.email,
                avatar_url: authUser.user_metadata?.avatar_url
              }
            };
          } else if (user) {
            console.log('User profile found in database:', user.id);
            return {
              exists: true,
              user: user,
            };
          } else {
            console.log('User profile not found in database (new user needs registration)');
            return {
              exists: false,
              user: null,
              requiresRegistration: true,
              authUser: {
                id: authUser.id,
                email: authUser.email,
                avatar_url: authUser.user_metadata?.avatar_url
              }
            };
          }
        }
      } catch (dbError) {
        console.warn('Database check failed:', dbError);
        return {
          exists: false,
          user: null,
          requiresRegistration: true
        };
      }
      
      // Fallback to mock user if database fails
      const mockUser = {
        id: 'user-id-from-token',
        email: 'user@example.com',
        fullName: 'Test User',
        role: 'teacher',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        exists: true,
        user: mockUser,
      };

    } catch (tokenError) {
      console.error('Token validation error:', tokenError);
      return {
        exists: false,
        user: null,
        error: 'Invalid token'
      };
    }

  } catch (error: any) {
    console.error('Profile check error:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při kontrole profilu',
    });
  }
});