import { eq, and } from 'drizzle-orm';
import { groups, groupParticipants, goals, goalProgress } from '~/lib/database/schema';
import { db } from '~/lib/database/connection';
import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';
import { 
  validateBody,
  joinGroupSchema,
} from '~/lib/validation/schemas';
import { createId } from '@paralleldrive/cuid2';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = validateBody(joinGroupSchema, body);
    const { qrToken, deviceId, nickname } = validatedData;
    
    // Find group by QR token
    const group = await db
      .select()
      .from(groups)
      .where(and(
        eq(groups.qrCodeToken, qrToken),
        eq(groups.isActive, true)
      ))
      .limit(1);
    
    if (!group.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invalid QR code or group is not active',
      });
    }
    
    const [groupData] = group;
    
    // Check if participant already joined with this device
    const existingParticipant = await db
      .select()
      .from(groupParticipants)
      .where(and(
        eq(groupParticipants.groupId, groupData.id),
        eq(groupParticipants.deviceId, deviceId)
      ))
      .limit(1);
    
    if (existingParticipant.length) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Device already joined this group',
      });
    }
    
    // Create participant
    const newParticipant = {
      id: createId(),
      groupId: groupData.id,
      deviceId,
      nickname,
    };
    
    const [createdParticipant] = await db
      .insert(groupParticipants)
      .values(newParticipant)
      .returning();
    
    if (!createdParticipant) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to join group',
      });
    }
    
    // Initialize goal progress for all existing goals
    const groupGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.groupId, groupData.id));
    
    if (groupGoals.length > 0) {
      const progressEntries = groupGoals.map(goal => ({
        id: createId(),
        participantId: createdParticipant.id,
        goalId: goal.id,
        currentValue: 0,
      }));
      
      await db.insert(goalProgress).values(progressEntries);
    }
    
    // Return participant with group info
    const response = {
      participant: createdParticipant,
      group: {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
      },
      goals: groupGoals,
    };
    
    setResponseStatus(event, 201);
    return createApiResponse(
      response,
      'Successfully joined group'
    );
  } catch (error) {
    return handleApiError(error);
  }
});