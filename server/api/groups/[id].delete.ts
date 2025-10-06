import { 
  handleApiError,
} from '~/lib/api/utils';

export default defineEventHandler(async (event) => {
  try {
    // Get group ID from the URL path
    const groupId = getRouterParam(event, 'id')
    
    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Group ID is required'
      })
    }

    // Get authorization header (required for group deletion)
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
    
    console.log('Attempting JWT validation for delete with token:', token.substring(0, 20) + '...');
    
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
    console.log('Deleting group for authenticated user:', currentUserId);
    
    // Import Drizzle database
    const { rawDb: db } = await import('~/lib/database');
    const { groups } = await import('~/lib/database/schema');
    const { eq } = await import('drizzle-orm');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    // First, verify the group exists and user is the creator
    const existingGroup = await db.query.groups.findFirst({
      where: eq(groups.id, groupId)
    });

    if (!existingGroup) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found'
      });
    }

    // Check if the current user is the creator of the group
    if (existingGroup.teacherId !== currentUserId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only the group creator can delete this group'
      });
    }

    console.log('Deleting group:', {
      groupId,
      groupName: existingGroup.name,
      createdBy: existingGroup.teacherId,
      currentUser: currentUserId
    });

    // Delete the group using Drizzle (cascade will handle related records)
    await db.delete(groups).where(eq(groups.id, groupId));

    console.log('Group successfully deleted from database:', groupId);

    return {
      success: true,
      message: 'Skupina byla úspěšně smazána'
    };

  } catch (error) {
    return handleApiError(error);
  }
});