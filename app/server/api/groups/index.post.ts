import { eq } from 'drizzle-orm';
import { groups, users } from '~/lib/database/schema';
import { db } from '~/lib/database/index';
import { 
  createApiResponse, 
  handleApiError, 
  generateQRToken,
} from '~/lib/api/utils';
import { 
  validateBody,
  createGroupSchema,
} from '~/lib/validation/schemas';
import { createId } from '@paralleldrive/cuid2';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = validateBody(createGroupSchema, body);
    
    // Check if user is authenticated and is a teacher
    // In a real implementation, you'd get this from the Supabase session
    const currentUserId = 'user-id-from-session'; // Replace with actual user ID
    
    const newGroup = {
      id: createId(),
      ...validatedData,
      teacherId: currentUserId,
      qrCodeToken: generateQRToken(),
      isActive: true,
    };
    
    const [createdGroup] = await db
      .insert(groups)
      .values(newGroup)
      .returning();
    
    if (!createdGroup) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create group',
      });
    }
    
    // Get the group with teacher details
    const groupWithTeacher = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        teacherId: groups.teacherId,
        qrCodeToken: groups.qrCodeToken,
        isActive: groups.isActive,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        teacher: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(groups)
      .leftJoin(users, eq(groups.teacherId, users.id))
      .where(eq(groups.id, createdGroup.id))
      .limit(1);
    
    setResponseStatus(event, 201);
    return createApiResponse(
      groupWithTeacher[0],
      'Group created successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});