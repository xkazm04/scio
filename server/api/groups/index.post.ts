import { 
  createApiResponse, 
  handleApiError, 
  generateQRToken,
} from '~/lib/api/utils';
import { 
  validateBody,
  createGroupSchema,
} from '~/lib/validation/schemas';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = validateBody(createGroupSchema, body);
    
    // Get authorization header (required for group creation)
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
    
    console.log('Attempting JWT validation with token:', token.substring(0, 20) + '...');
    
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
    console.log('Creating group for authenticated user:', currentUserId);
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }
    
    // Create group data
    const groupData = {
      name: validatedData.name,
      description: validatedData.description,
      created_by: currentUserId, // This will be mapped to teacher_id in the connection layer
      qr_code_token: generateQRToken(),
      is_active: validatedData.isActive !== undefined ? validatedData.isActive : true,
    };

    console.log('Creating group with data:', groupData);
    console.log('User ID being used:', currentUserId);

    try {
      // Create group using Supabase client
      const { data: createdGroup, error: groupError } = await db.groups.create(groupData);
      
      if (groupError) {
        console.error('Group creation error:', groupError);
        throw createError({
          statusCode: 500,
          statusMessage: 'Chyba při vytváření skupiny: ' + groupError.message,
        });
      }
      
      if (!createdGroup) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Skupina nebyla vytvořena',
        });
      }
      
      console.log('Group successfully created in database:', {
        id: createdGroup.id,
        name: createdGroup.name,
        teacher_id: createdGroup.teacher_id
      });
      
      // Get teacher info for response
      const { data: teacher, error: teacherError } = await db.users.findById(currentUserId);
      
      // Prepare response data matching frontend expectations
      const responseData = {
        id: createdGroup.id,
        name: createdGroup.name,
        description: createdGroup.description,
        teacherId: createdGroup.teacher_id, // Use teacher_id from database
        qrCodeToken: createdGroup.qr_code_token,
        isActive: createdGroup.is_active,
        createdAt: createdGroup.created_at,
        updatedAt: createdGroup.updated_at,
        status: 'active',
        progress: 0,
        memberCount: 0, // Start with 0 members, students will join separately
        teacher: teacher?.data || {
          id: currentUserId,
          email: 'teacher@example.com',
          fullName: 'Current Teacher',
        }
      };
      
      setResponseStatus(event, 201);
      return createApiResponse(
        responseData,
        'Skupina úspěšně vytvořena v databázi'
      );
      
    } catch (dbError: any) {
      console.error('Database error while creating group:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Chyba při vytváření skupiny v databázi: ' + (dbError.message || 'Neznámá chyba'),
      });
    }

  } catch (error) {
    return handleApiError(error);
  }
});