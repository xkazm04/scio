import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';
import { 
  validateBody,
  joinGroupSchema,
} from '~/lib/validation/schemas';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = validateBody(joinGroupSchema, body);
    const { qrToken, deviceId, nickname } = validatedData;
    
    // Import Drizzle database
    const { db } = await import('~/lib/database');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }
    
    // Find group by QR token
    const { data: groups, error: groupError } = await db.groups.findByQRToken(qrToken);
    
    if (groupError || !groups) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invalid QR code or group not found',
      });
    }
    
    const groupData = groups;
    
    if (!groupData.isActive) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Group is not active',
      });
    }
    
    // Check if participant already joined with this device
    const { data: existingParticipant } = await db.participants.findByGroupAndDevice(groupData.id, deviceId);
    
    if (existingParticipant) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Device already joined this group',
      });
    }
    
    // Create participant (camelCase for Drizzle)
    const newParticipant = {
      groupId: groupData.id,
      deviceId: deviceId,
      nickname,
    };
    
    const { data: createdParticipant, error: createParticipantError } = await db.participants.create(newParticipant);
    
    if (createParticipantError || !createdParticipant) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to join group: ' + (createParticipantError?.message || 'Unknown error'),
      });
    }
    
    // Get all goals for this group
    const { data: groupGoals } = await db.goals.findByGroup(groupData.id);
    
    // Initialize goal progress for all existing goals
    if (groupGoals && groupGoals.length > 0) {
      const progressPromises = groupGoals.map(async (goal: any) => {
        const progressData = {
          participantId: createdParticipant.id,
          goalId: goal.id,
          currentValue: 0,
          isCompleted: false,
        };
        
        return await db.goalProgress.create(progressData);
      });
      
      await Promise.all(progressPromises);
    }
    
    // Return participant with group info
    const response = {
      participant: {
        id: createdParticipant.id,
        groupId: createdParticipant.groupId,
        deviceId: createdParticipant.deviceId,
        nickname: createdParticipant.nickname,
        joinedAt: createdParticipant.joinedAt,
      },
      group: {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        qrCodeToken: groupData.qrCodeToken,
      },
      goals: groupGoals || [],
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