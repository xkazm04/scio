import { 
  createApiResponse, 
  handleApiError, 
} from '~/lib/api/utils';
import { supabase } from '~/lib/database/connection';

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
    
    // Import database connection
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {
      // Get group info and verify teacher ownership
      const { data: group, error: groupError } = await db.groups.findById(groupId);
      
      if (groupError || !group) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Group not found',
        });
      }

      // Verify that current user is the teacher of this group
      if (group.teacher_id !== currentUserId) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied: You are not the teacher of this group',
        });
      }

      // Get all goals for this group
      const { data: goals, error: goalsError } = await db.goals.findByGroup(groupId);

      // Get all participants in this group
      const { data: participants, error: participantsError } = await db.participants.findByGroup(groupId);

      // Get all help requests for this group
      const { data: helpRequests, error: helpRequestsError } = await db.helpRequests.findUnresolvedByGroup(groupId);

      // For each participant, get their progress on all goals
      let participantsWithProgress: any[] = [];
      if (participants && participants.length > 0 && goals && goals.length > 0) {
        participantsWithProgress = await Promise.all(
          participants.map(async (participant: any) => {
            const progressData = await Promise.all(
              goals.map(async (goal: any) => {
                const { data: progress } = await db.goalProgress.findByParticipantAndGoal(participant.id, goal.id);
                return {
                  goalId: goal.id,
                  goalTitle: goal.title,
                  goalType: goal.goal_type,
                  targetValue: goal.target_value,
                  currentValue: progress?.current_value || 0,
                  isCompleted: progress?.is_completed || false,
                  updatedAt: progress?.updated_at || null,
                };
              })
            );

            // Calculate overall progress for this participant
            const completedGoals = progressData.filter(p => p.isCompleted).length;
            const overallProgress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

            // Get message count for this participant
            const { data: messages, error: messagesError } = await supabase!
              .from('messages')
              .select('id')
              .eq('participant_id', participant.id)
              .eq('group_id', groupId);

            // Get help request count for this participant
            const { data: participantHelpRequests, error: helpError } = await supabase!
              .from('help_requests')
              .select('id')
              .eq('participant_id', participant.id)
              .eq('status', 'pending');

            return {
              id: participant.id,
              nickname: participant.nickname,
              deviceId: participant.device_id,
              joinedAt: participant.joined_at,
              lastActivity: participant.last_activity,
              isActive: participant.is_active,
              progress: progressData,
              overallProgress,
              completedGoals,
              totalGoals: goals.length,
              messageCount: messages?.length || 0,
              helpRequestCount: participantHelpRequests?.length || 0,
            };
          })
        );
      }

      // Format goals with overall completion stats
      const goalsWithStats = (goals || []).map((goal: any) => {
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
          goalType: goal.goal_type,
          targetValue: goal.target_value,
          orderIndex: goal.order_index,
          createdAt: goal.created_at,
          completedBy: completedCount,
          totalParticipants,
          completionRate,
        };
      });

      // Format help requests
      const formattedHelpRequests = (helpRequests || []).map((request: any) => ({
        id: request.id,
        participantId: request.participant_id,
        reason: request.reason,
        status: request.status,
        createdAt: request.created_at,
        // Find participant info
        participant: participantsWithProgress.find(p => p.id === request.participant_id),
      }));

      // Calculate group statistics
      const groupStats = {
        totalParticipants: participantsWithProgress.length,
        totalGoals: goals?.length || 0,
        averageProgress: participantsWithProgress.length > 0 
          ? Math.round(participantsWithProgress.reduce((sum, p) => sum + p.overallProgress, 0) / participantsWithProgress.length)
          : 0,
        activeParticipants: participantsWithProgress.filter(p => p.isActive).length,
        pendingHelpRequests: formattedHelpRequests.length,
      };

      // Format response for teacher view
      const teacherData = {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          qrCodeToken: group.qr_code_token,
          isActive: group.is_active,
          createdAt: group.created_at,
          updatedAt: group.updated_at,
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