

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Get authorization header (required for groups API)
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
    console.log('Fetching groups for authenticated user:', currentUserId);
    
    // Import Supabase client
    const { db } = await import('~/lib/database/connection');
    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {

      // Fetch groups for teacher
      const { data: fetchedGroups, error: groupsError } = await db.groups.findByTeacher(currentUserId);
      if (groupsError) {
        console.error('Groups fetch error:', groupsError);
        throw createError({
          statusCode: 500,
          statusMessage: 'Chyba při načítání skupin: ' + groupsError.message,
        });
      }

      // For each group, fetch goals, goal progress, and unresolved help requests
      const groupsWithDetails = await Promise.all((fetchedGroups || []).map(async (group: any) => {
        // Fetch goals for this group
        const { data: goals, error: goalsError } = await db.goals.findByGroup(group.id);
        // Fetch participants for this group
        const { data: participants, error: participantsError } = await db.participants.findByGroup(group.id);
        // Fetch unresolved help requests for this group
        const { data: helpRequests, error: helpRequestsError } = await db.helpRequests.findUnresolvedByGroup(group.id);

        // For each goal, fetch progress for all participants
        let goalsWithProgress: any[] = [];
        if (goals && participants) {
          goalsWithProgress = await Promise.all(goals.map(async (goal: any) => {
            // For each participant, fetch progress for this goal
            const progressArr = await Promise.all(participants.map(async (participant: any) => {
              const { data: progress } = await db.goalProgress.findByParticipantAndGoal(participant.id, goal.id);
              return progress;
            }));
            return {
              ...goal,
              progress: progressArr.filter(Boolean)
            };
          }));
        }

        // Calculate group progress as average of all goals' completion
        let progress = 0;
        let totalGoals = goalsWithProgress.length;
        let completedGoals = 0;
        if (totalGoals > 0) {
          completedGoals = goalsWithProgress.filter(g => g.progress && g.progress.every((p: any) => p && p.is_completed)).length;
          progress = Math.round((completedGoals / totalGoals) * 100);
        }

        return {
          id: group.id,
          name: group.name,
          description: group.description,
          teacherId: group.teacher_id,
          qrCodeToken: group.qr_code_token,
          isActive: group.is_active,
          createdAt: group.created_at,
          updatedAt: group.updated_at,
          status: 'active',
          progress,
          memberCount: participants ? participants.length : 0,
          teacher: {
            id: group.teacher_id,
            email: 'teacher@example.com',
            fullName: 'Current Teacher',
          },
          goals: goalsWithProgress,
          unresolvedHelpRequests: helpRequests ? helpRequests.length : 0
        };
      }));

      return {
        success: true,
        data: groupsWithDetails,
        meta: {
          total: groupsWithDetails.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(groupsWithDetails.length / 10)
        }
      };

    } catch (dbError: any) {
      console.error('Database error while fetching groups:', dbError);
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Chyba při načítání skupin z databáze: ' + (dbError.message || 'Neznámá chyba'),
      });
    }

  } catch (error: any) {
    console.error('Groups fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Chyba při načítání skupin'
    })
  }
})