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

    // Get authorization header
    const authHeader = getHeader(event, 'authorization');
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No authorization token provided',
      });
    }
    
    // Extract and validate JWT token
    const token = authHeader.replace('Bearer ', '');
    if (!token || token.length < 10) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token format',
      });
    }
    
    // Verify token and get user
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
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
    const { groups, goals, groupParticipants, helpRequests, goalProgress, messages, users } = await import('~/lib/database/schema');
    const { eq, and, desc } = await import('drizzle-orm');
    
    try {
      // Get user role from database
      const user = await db.query.users.findFirst({
        where: eq(users.id, currentUserId)
      });
      
      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }

      console.log('🔍 Unified endpoint called for:', { groupId, userId: currentUserId, userRole: user.role });

      // Get group info
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

      // UNIFIED LOGIC: Handle both teacher and student views
      if (user.role === 'teacher') {
        // ============ TEACHER VIEW ============
        console.log('👨‍🏫 Loading teacher view');

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
        
        console.log('🔍 Participants found:', participants?.length || 0);

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
                deviceId: participant.deviceId,
                joinedAt: participant.joinedAt,
                lastActivity: participant.lastActivity,
                isActive: participant.isActive,
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
            goalType: goal.goalType,
            targetValue: goal.targetValue,
            orderIndex: goal.orderIndex,
            createdAt: goal.createdAt,
            completedBy: completedCount,
            totalParticipants,
            completionRate,
          };
        });

        // Format help requests
        const formattedHelpRequests = (helpRequestsData || []).map((request: any) => ({
          id: request.id,
          participantId: request.participantId,
          reason: request.reason,
          status: request.status,
          createdAt: request.createdAt,
          participant: participantsWithProgress.find(p => p.id === request.participantId),
        }));

        // Return teacher view data
        const teacherResponse = {
          group: {
            id: group.id,
            name: group.name,
            description: group.description,
            teacherId: group.teacherId,
            qrCodeToken: group.qrCodeToken,
            isActive: group.isActive,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
          },
          goals: goalsWithStats,
          participants: participantsWithProgress,
          helpRequests: formattedHelpRequests,
          viewType: 'teacher'
        };
        
        console.log('📤 Returning teacher data:', {
          groupId: teacherResponse.group.id,
          goalsCount: teacherResponse.goals.length,
          participantsCount: teacherResponse.participants.length,
          helpRequestsCount: teacherResponse.helpRequests.length
        });
        
        return createApiResponse(teacherResponse, 'Teacher group data retrieved successfully');

      } else if (user.role === 'student') {
        // ============ STUDENT VIEW ============
        console.log('👨‍🎓 Loading student view');

        // Get device ID from query
        const deviceId = getQuery(event).deviceId as string;
        
        if (!deviceId) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Device ID is required for student data',
          });
        }

        // Find participant record
        const participant = await db.query.groupParticipants.findFirst({
          where: and(
            eq(groupParticipants.groupId, groupId),
            eq(groupParticipants.deviceId, deviceId)
          )
        });

        if (!participant) {
          // Student hasn't joined yet
          return createApiResponse({
            group: {
              id: group.id,
              name: group.name,
              description: group.description,
            },
            notJoined: true,
            viewType: 'student'
          }, 'Student has not joined this group');
        }

        // Get all goals for this group
        const groupGoals = await db.query.goals.findMany({
          where: eq(goals.groupId, groupId),
          orderBy: (goals, { asc }) => [asc(goals.orderIndex)]
        });

        // Get student's progress
        const studentProgress = await Promise.all(
          (groupGoals || []).map(async (goal: any) => {
            const progress = await db.query.goalProgress.findFirst({
              where: and(
                eq(goalProgress.participantId, participant.id),
                eq(goalProgress.goalId, goal.id)
              )
            });

            return {
              id: goal.id,
              title: goal.title,
              description: goal.description,
              goalType: goal.goalType,
              targetValue: goal.targetValue,
              currentValue: progress?.currentValue || 0,
              isCompleted: progress?.isCompleted || false,
              progress: goal.goalType === 'percentage' && goal.targetValue > 0
                ? Math.round((progress?.currentValue || 0) / goal.targetValue * 100)
                : progress?.isCompleted ? 100 : 0,
            };
          })
        );

        // Get student's messages
        const studentMessages = await db.query.messages.findMany({
          where: and(
            eq(messages.groupId, groupId),
            eq(messages.participantId, participant.id)
          ),
          orderBy: desc(messages.createdAt)
        });

        // Return student view data
        return createApiResponse({
          group: {
            id: group.id,
            name: group.name,
            description: group.description,
          },
          participant: {
            id: participant.id,
            nickname: participant.nickname,
            deviceId: participant.deviceId,
          },
          goals: studentProgress,
          messages: studentMessages,
          notJoined: false,
          viewType: 'student'
        }, 'Student group data retrieved successfully');

      } else {
        throw createError({
          statusCode: 403,
          statusMessage: 'Invalid user role',
        });
      }

    } catch (dbError: any) {
      console.error('Database error:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + (dbError.message || 'Unknown error'),
      });
    }

  } catch (error) {
    return handleApiError(error);
  }
});
