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
    
    // Import Drizzle database
    const { rawDb: db } = await import('~/lib/database');
    const { groups, groupParticipants, goals, goalProgress, messages: messagesSchema } = await import('~/lib/database/schema');
    const { eq, and } = await import('drizzle-orm');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {
      // Get group info with teacher
      const group = await db.query.groups.findFirst({
        where: eq(groups.id, groupId),
        with: {
          teacher: {
            columns: {
              id: true,
              email: true,
              fullName: true,
            }
          }
        }
      });
      
      if (!group) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Group not found',
        });
      }

      // Check if the current user is the teacher of this group
      if (group.teacherId === authUser.id) {
        // Teachers should use the /teacher endpoint, not /student
        throw createError({
          statusCode: 403,
          statusMessage: 'Teachers should use the teacher endpoint to view group data',
        });
      }

      // Find participant by device ID and group ID
      const participant = await db.query.groupParticipants.findFirst({
        where: and(
          eq(groupParticipants.groupId, groupId),
          eq(groupParticipants.deviceId, deviceId)
        )
      });
      
      if (!participant) {
        console.error('❌ Participant not found:', { groupId, deviceId });
        
        // Instead of throwing an error, return empty data
        // This allows the page to load even if student hasn't joined yet
        return {
          success: true,
          data: {
            group: {
              id: group.id,
              name: group.name,
              description: group.description,
              teacher: group.teacher
            },
            participant: null,
            goals: [],
            messages: [],
            notJoined: true
          },
          message: 'You have not joined this group yet. Please join first.'
        };
      }

      // Get all goals for this group
      const groupGoals = await db.query.goals.findMany({
        where: eq(goals.groupId, groupId),
        orderBy: (goals, { asc }) => [asc(goals.orderIndex)]
      });

      // Get student's progress for all goals
      let studentProgress: any[] = [];
      if (groupGoals && groupGoals.length > 0) {
        studentProgress = await Promise.all(
          groupGoals.map(async (goal: any) => {
            const progress = await db.query.goalProgress.findFirst({
              where: and(
                eq(goalProgress.participantId, participant.id),
                eq(goalProgress.goalId, goal.id)
              )
            });
            return {
              goalId: goal.id,
              currentValue: progress?.currentValue || 0,
              isCompleted: progress?.isCompleted || false,
              updatedAt: progress?.updatedAt || null,
            };
          })
        );
      }

      // Get messages for this group (student sees all messages)
      const messagesData = await db.query.messages.findMany({
        where: eq(messagesSchema.groupId, groupId),
        with: {
          participant: {
            columns: {
              nickname: true,
            }
          }
        },
        orderBy: (messages, { asc }) => [asc(messages.createdAt)]
      });

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
          deviceId: participant.deviceId,
          joinedAt: participant.joinedAt,
        },
        goals: (groupGoals || []).map((goal: any) => {
          const progress = studentProgress.find(p => p.goalId === goal.id);
          return {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            goalType: goal.goalType,
            targetValue: goal.targetValue,
            orderIndex: goal.orderIndex,
            currentValue: progress?.currentValue || 0,
            isCompleted: progress?.isCompleted || false,
            progress: goal.goalType === 'percentage' && goal.targetValue > 0 
              ? Math.round(((progress?.currentValue || 0) / goal.targetValue) * 100)
              : progress?.isCompleted ? 100 : 0,
          };
        }),
        messages: (messagesData || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          isSystemMessage: msg.isSystemMessage,
          isGoalRelevant: msg.isGoalRelevant,
          timestamp: msg.createdAt,
          author: msg.participant?.nickname || 'System',
          type: msg.isSystemMessage ? 'system' : 'user',
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