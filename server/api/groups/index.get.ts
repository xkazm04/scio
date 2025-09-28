

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Get authorization header (required for groups API)
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No authorization token provided',
      });
    }
    
    // Extract and validate JWT token to get real user ID
    const token = authHeader.replace('Bearer ', '');
    if (!token || token.length < 10) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token format',
      });
    }
    
    // Get user from Supabase auth to verify token and get real user data
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the token and get user data
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !authUser) {
      console.error('Token validation failed:', authError);
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid or expired token',
      });
    }
    
    const currentUserId = authUser.id;
    console.log('Fetching groups for authenticated user:', currentUserId);
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {
      // Fetch groups from database using Supabase client
      const { data: fetchedGroups, error: groupsError } = await db.groups.findByTeacher(currentUserId);

      if (groupsError) {
        console.error('Groups fetch error:', groupsError);
        throw createError({
          statusCode: 500,
          statusMessage: 'Chyba při načítání skupin: ' + groupsError.message,
        });
      }

      console.log(`Found ${fetchedGroups?.length || 0} groups in database`);

      // Add display properties that the frontend expects
      const groupsWithDisplayProps = (fetchedGroups || []).map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        teacherId: group.teacher_id, // Use teacher_id from database
        qrCodeToken: group.qr_code_token,
        isActive: group.is_active,
        createdAt: group.created_at,
        updatedAt: group.updated_at,
        status: 'active',
        progress: 0, // TODO: Calculate from goals and progress
        memberCount: 0, // TODO: Count from participants
        teacher: {
          id: group.teacher_id,
          email: 'teacher@example.com',
          fullName: 'Current Teacher',
        }
      }));

      return {
        success: true,
        data: groupsWithDisplayProps,
        meta: {
          total: groupsWithDisplayProps.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(groupsWithDisplayProps.length / 10)
        }
      };

    } catch (dbError: any) {
      console.error('Database error while fetching groups:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Chyba při načítání skupin z databáze: ' + (dbError.message || 'Neznámá chyba'),
      });
    }

  } catch (error: any) {
    console.error('Groups fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při načítání skupin'
    })
  }
})