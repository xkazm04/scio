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
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    // First, verify the group exists and user is the creator
    const { data: existingGroup, error: fetchError } = await db.groups.findById(groupId);

    if (fetchError || !existingGroup) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found'
      });
    }

    // Check if the current user is the creator of the group
    if (existingGroup.teacher_id !== currentUserId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only the group creator can delete this group'
      });
    }

    console.log('Deleting group:', {
      groupId,
      groupName: existingGroup.name,
      createdBy: existingGroup.teacher_id,
      currentUser: currentUserId
    });

    // Delete the group using Supabase client (cascade will handle related records)
    const { error: deleteError } = await db.groups.delete(groupId);

    if (deleteError) {
      console.error('Failed to delete group:', deleteError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete group: ' + deleteError.message
      });
    }

    console.log('Group successfully deleted from database:', groupId);

    return {
      success: true,
      message: 'Skupina byla úspěšně smazána'
    };

  } catch (error) {
    return handleApiError(error);
  }
});