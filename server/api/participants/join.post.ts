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
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
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
    
    if (!groupData.is_active) {
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
    
    // Create participant
    const newParticipant = {
      group_id: groupData.id,
      device_id: deviceId,
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
          participant_id: createdParticipant.id,
          goal_id: goal.id,
          current_value: 0,
          is_completed: false,
        };
        
        return await db.goalProgress.create(progressData);
      });
      
      await Promise.all(progressPromises);
    }
    
    // Return participant with group info
    const response = {
      participant: {
        id: createdParticipant.id,
        groupId: createdParticipant.group_id,
        deviceId: createdParticipant.device_id,
        nickname: createdParticipant.nickname,
        joinedAt: createdParticipant.joined_at,
      },
      group: {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        qrCodeToken: groupData.qr_code_token,
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