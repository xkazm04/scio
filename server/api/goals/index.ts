import { eq, desc } from 'drizzle-orm';
import { goals, groups } from '~/lib/database/schema';
import { db } from '~/lib/database/connection';
import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';
import { 
  validateBody,
  createGoalSchema,
} from '~/lib/validation/schemas';
import { createId } from '@paralleldrive/cuid2';

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);
    
    switch (method) {
      case 'GET':
        return await getGoals(event);
      case 'POST':
        return await createGoal(event);
      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method Not Allowed',
        });
    }
  } catch (error) {
    return handleApiError(error);
  }
});

async function getGoals(event: any) {
  const { groupId } = getQuery(event);
  
  if (!groupId || typeof groupId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required',
    });
  }
  
  // Verify group exists
  const group = await db
    .select()
    .from(groups)
    .where(eq(groups.id, groupId))
    .limit(1);
    
  if (!group.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Group not found',
    });
  }
  
  // Get goals for the group
  const groupGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.groupId, groupId))
    .orderBy(goals.orderIndex, desc(goals.createdAt));
  
  return createApiResponse(groupGoals, 'Goals retrieved successfully');
}

async function createGoal(event: any) {
  const body = await readBody(event);
  const validatedData = validateBody(createGoalSchema, body);
  
  // Verify group exists and user has permission
  const group = await db
    .select()
    .from(groups)
    .where(eq(groups.id, validatedData.groupId))
    .limit(1);
    
  if (!group.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Group not found',
    });
  }
  
  // In a real implementation, check if current user is the teacher of this group
  
  const newGoal = {
    id: createId(),
    ...validatedData,
  };
  
  const [createdGoal] = await db
    .insert(goals)
    .values(newGoal)
    .returning();
  
  setResponseStatus(event, 201);
  return createApiResponse(
    createdGoal,
    'Goal created successfully'
  );
}