import { eq, and } from 'drizzle-orm';
import { goalProgress, goals, groupParticipants } from '~/lib/database/schema';
import { db } from '~/lib/database/index';
import { 
  createApiResponse, 
  handleApiError, 
  calculateGoalCompletion,
} from '~/lib/api/utils';
import { 
  validateBody,
  updateProgressSchema,
} from '~/lib/validation/schemas';

export default defineEventHandler(async (event) => {
  try {
    const progressId = getRouterParam(event, 'id');
    const body = await readBody(event);
    const validatedData = validateBody(updateProgressSchema, body);
    
    if (!progressId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Progress ID is required',
      });
    }
    
    // Get existing progress entry with goal info
    const existingProgress = await db
      .select({
        id: goalProgress.id,
        participantId: goalProgress.participantId,
        goalId: goalProgress.goalId,
        currentValue: goalProgress.currentValue,
        goalType: goals.goalType,
        targetValue: goals.targetValue,
      })
      .from(goalProgress)
      .leftJoin(goals, eq(goalProgress.goalId, goals.id))
      .where(eq(goalProgress.id, progressId))
      .limit(1);
    
    if (!existingProgress.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Progress entry not found',
      });
    }
    
    const progressData = existingProgress[0];
    
    // Calculate if goal is completed with new value
    const isCompleted = calculateGoalCompletion(
      validatedData.currentValue,
      progressData.targetValue || 1,
      progressData.goalType || 'boolean'
    );
    
    // Update progress
    const [updatedProgress] = await db
      .update(goalProgress)
      .set({
        currentValue: validatedData.currentValue,
        isCompleted,
        updatedAt: new Date(),
      })
      .where(eq(goalProgress.id, progressId))
      .returning();
    
    return createApiResponse(
      updatedProgress,
      isCompleted 
        ? 'Goal completed! Progress updated successfully' 
        : 'Progress updated successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});