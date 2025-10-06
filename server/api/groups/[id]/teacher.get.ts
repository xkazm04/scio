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

    // Get authorization header (required for teacher data)
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
    
    const currentUserId = authUser.id;

    // Import Drizzle database
    const { rawDb: db } = await import('~/lib/database');
    const { groups, goals, groupParticipants, helpRequests, goalProgress, messages } = await import('~/lib/database/schema');
    const { eq, and, desc } = await import('drizzle-orm');
    
    try {
      // Get group info and verify teacher ownership
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

      // Verify that current user is the teacher of this group
      if (group.teacherId !== currentUserId) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied: You are not the teacher of this group',
        });
      }

      // Get all goals for this group
      const groupGoals = await db.query.goals.findMany({
        where: eq(goals.groupId, groupId),
        orderBy: (goals, { asc }) => [asc(goals.orderIndex)]
      });

      // Get all participants in this group
      const participants = await db.query.groupParticipants.findMany({
        where: eq(groupParticipants.groupId, groupId),
        orderBy: (groupParticipants, { desc }) => [desc(groupParticipants.joinedAt)]
      });
      
      console.log('🔍 Participants query result:', {
        groupId,
        participantsFound: participants?.length || 0,
        participants: participants?.map(p => ({ id: p.id, nickname: p.nickname, deviceId: p.deviceId }))
      });

      // Get all help requests for this group
      const helpRequestsData = await db.query.helpRequests.findMany({
        where: and(
          eq(helpRequests.groupId, groupId),
          eq(helpRequests.status, 'pending')
        ),
        orderBy: desc(helpRequests.createdAt)
      });

      // For each participant, get their progress on all goals
      let participantsWithProgress: any[] = [];
      if (participants && participants.length > 0 && groupGoals && groupGoals.length > 0) {
        participantsWithProgress = await Promise.all(
          participants.map(async (participant: any) => {
            const progressData = await Promise.all(
              groupGoals.map(async (goal: any) => {
                const progress = await db.query.goalProgress.findFirst({
                  where: and(
                    eq(goalProgress.participantId, participant.id),
                    eq(goalProgress.goalId, goal.id)
                  )
                });
                return {
                  goalId: goal.id,
                  goalTitle: goal.title,
                  goalType: goal.goalType,
                  targetValue: goal.targetValue,
                  currentValue: progress?.currentValue || 0,
                  isCompleted: progress?.isCompleted || false,
                  updatedAt: progress?.updatedAt || null,
                };
              })
            );

            // Calculate overall progress for this participant
            const completedGoals = progressData.filter(p => p.isCompleted).length;
            const overallProgress = groupGoals.length > 0 ? Math.round((completedGoals / groupGoals.length) * 100) : 0;

            // Get message count for this participant
            const participantMessages = await db.query.messages.findMany({
              where: and(
                eq(messages.groupId, groupId),
                eq(messages.participantId, participant.id)
              )
            });
            
            const participantHelpRequests = helpRequestsData?.filter(r => r.participantId === participant.id) || [];

            return {
              id: participant.id,
              nickname: participant.nickname,
              deviceId: participant.deviceId, // camelCase
              joinedAt: participant.joinedAt, // camelCase
              lastActivity: participant.lastActivity, // camelCase
              isActive: participant.isActive, // camelCase
              progress: progressData,
              overallProgress,
              completedGoals,
              totalGoals: groupGoals.length,
              messageCount: participantMessages.length,
              helpRequestCount: participantHelpRequests.length,
            };
          })
        );
      }

      // Format goals with overall completion stats
      const goalsWithStats = (groupGoals || []).map((goal: any) => {
        const participantProgressForGoal = participantsWithProgress
          .map(p => p.progress.find((prog: any) => prog.goalId === goal.id))
          .filter(Boolean);
        
        const completedCount = participantProgressForGoal.filter(p => p.isCompleted).length;
        const totalParticipants = participantsWithProgress.length;
        const completionRate = totalParticipants > 0 ? Math.round((completedCount / totalParticipants) * 100) : 0;

        return {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          goalType: goal.goalType, // camelCase
          targetValue: goal.targetValue, // camelCase
          orderIndex: goal.orderIndex, // camelCase
          createdAt: goal.createdAt, // camelCase
          completedBy: completedCount,
          totalParticipants,
          completionRate,
        };
      });

      // Format help requests
      const formattedHelpRequests = (helpRequestsData || []).map((request: any) => ({
        id: request.id,
        participantId: request.participantId, // camelCase
        reason: request.reason,
        status: request.status,
        createdAt: request.createdAt, // camelCase
        // Find participant info
        participant: participantsWithProgress.find(p => p.id === request.participantId),
      }));

      // Calculate group statistics
      const groupStats = {
        totalParticipants: participantsWithProgress.length,
        totalGoals: groupGoals?.length || 0,
        averageProgress: participantsWithProgress.length > 0 
          ? Math.round(participantsWithProgress.reduce((sum, p) => sum + p.overallProgress, 0) / participantsWithProgress.length)
          : 0,
        activeParticipants: participantsWithProgress.filter(p => p.isActive).length,
        pendingHelpRequests: formattedHelpRequests.length,
      };

      // Format response for teacher view (using camelCase)
      const teacherData = {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          teacherId: group.teacherId, // camelCase
          qrCodeToken: group.qrCodeToken, // camelCase
          isActive: group.isActive, // camelCase
          createdAt: group.createdAt, // camelCase
          updatedAt: group.updatedAt, // camelCase
        },
        goals: goalsWithStats,
        participants: participantsWithProgress,
        helpRequests: formattedHelpRequests,
        stats: groupStats,
      };

      return createApiResponse(teacherData, 'Teacher group data retrieved successfully');

    } catch (dbError: any) {
      console.error('Database error while fetching teacher group data:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + (dbError.message || 'Unknown error'),
      });
    }

  } catch (error) {
    return handleApiError(error);
  }
});