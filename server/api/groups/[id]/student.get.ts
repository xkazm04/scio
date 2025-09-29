import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';

export default defineEventHandler(async (event) => {
  try {
    // Get group ID from URL parameters
    const groupId = getRouterParam(event, 'id');
    
    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Group ID is required',
      });
    }

    // Get authorization header (required for student data)
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
    
    // Get device ID from query or local storage simulation
    const deviceId = getQuery(event).deviceId as string;
    
    if (!deviceId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Device ID is required for student data',
      });
    }
    
    // Import database connection
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {
      // Get group info
      const { data: group, error: groupError } = await db.groups.findById(groupId);
      
      if (groupError || !group) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Group not found',
        });
      }

      // Find participant by device ID
      const { data: participant, error: participantError } = await db.participants.findByGroupAndDevice(groupId, deviceId);
      
      if (participantError || !participant) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Student not found in this group',
        });
      }

      // Get all goals for this group
      const { data: goals, error: goalsError } = await db.goals.findByGroup(groupId);

      // Get student's progress for all goals
      let studentProgress: any[] = [];
      if (goals && goals.length > 0) {
        studentProgress = await Promise.all(
          goals.map(async (goal: any) => {
            const { data: progress } = await db.goalProgress.findByParticipantAndGoal(participant.id, goal.id);
            return {
              goalId: goal.id,
              currentValue: progress?.current_value || 0,
              isCompleted: progress?.is_completed || false,
              updatedAt: progress?.updated_at || null,
            };
          })
        );
      }

      // Get messages for this group (student sees all messages)
      const { data: messages } = await supabaseClient
        .from('messages')
        .select(`
          id,
          content,
          is_system_message,
          is_goal_relevant,
          created_at,
          participant:group_participants(nickname)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      // Format response for student view
      const studentData = {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          memberCount: 0, // Will be calculated if needed
        },
        participant: {
          id: participant.id,
          nickname: participant.nickname,
          deviceId: participant.device_id,
          joinedAt: participant.joined_at,
        },
        goals: (goals || []).map((goal: any) => {
          const progress = studentProgress.find(p => p.goalId === goal.id);
          return {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            goalType: goal.goal_type,
            targetValue: goal.target_value,
            orderIndex: goal.order_index,
            currentValue: progress?.currentValue || 0,
            isCompleted: progress?.isCompleted || false,
            progress: goal.goal_type === 'percentage' && goal.target_value > 0 
              ? Math.round(((progress?.currentValue || 0) / goal.target_value) * 100)
              : progress?.isCompleted ? 100 : 0,
          };
        }),
        messages: (messages || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          isSystemMessage: msg.is_system_message,
          isGoalRelevant: msg.is_goal_relevant,
          timestamp: msg.created_at,
          author: msg.participant?.nickname || 'System',
          type: msg.is_system_message ? 'system' : 'user',
        })),
      };

      return createApiResponse(studentData, 'Student group data retrieved successfully');

    } catch (dbError: any) {
      console.error('Database error while fetching student group data:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + (dbError.message || 'Unknown error'),
      });
    }

  } catch (error) {
    return handleApiError(error);
  }
});