

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
    
    // Import Drizzle database
    const { rawDb: db } = await import('~/lib/database');
    const { groups, goals, groupParticipants, helpRequests, goalProgress, users } = await import('~/lib/database/schema');
    const { eq, and, desc } = await import('drizzle-orm');
    

    
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection not available',
      });
    }

    try {
      // Get user info to determine role
      const user = await db.query.users.findFirst({
        where: eq(users.id, currentUserId)
      });
      
      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }
      
      let fetchedGroups: any[] = [];
      
      if (user.role === 'teacher') {
        // Teachers see groups they created
        fetchedGroups = await db.query.groups.findMany({
          where: and(
            eq(groups.teacherId, currentUserId),
            eq(groups.isActive, true)
          ),
          with: {
            teacher: {
              columns: {
                id: true,
                email: true,
                fullName: true,
              }
            }
          },
          orderBy: desc(groups.updatedAt)
        });
      } else {
        // For students, we need to get the device ID from the request
        // Since students are identified by device ID, not user ID
        const deviceId = getQuery(event).deviceId as string;
        
        if (!deviceId) {
          // If no device ID provided, return empty array
          // In the frontend, we'll need to pass the device ID as a query parameter
          fetchedGroups = [];
        } else {
          // Students see groups they are participants in
          const participantGroups = await db.query.groupParticipants.findMany({
            where: eq(groupParticipants.deviceId, deviceId),
            with: {
              group: {
                with: {
                  teacher: {
                    columns: {
                      id: true,
                      email: true,
                      fullName: true,
                    }
                  }
                }
              }
            },
            orderBy: desc(groupParticipants.joinedAt)
          });
          
          fetchedGroups = participantGroups.map(p => p.group).filter(Boolean);
        }
      }

      // For each group, fetch goals, participants, and unresolved help requests
      const groupsWithDetails = await Promise.all((fetchedGroups || []).map(async (group: any) => {
        // Fetch goals for this group
        const groupGoals = await db.query.goals.findMany({
          where: eq(goals.groupId, group.id),
          orderBy: (goals, { asc }) => [asc(goals.orderIndex)]
        });
        
        // Fetch participants for this group
        const participants = await db.query.groupParticipants.findMany({
          where: eq(groupParticipants.groupId, group.id),
          orderBy: desc(groupParticipants.joinedAt)
        });
        
        // Fetch unresolved help requests for this group
        const unresolvedHelpRequests = await db.query.helpRequests.findMany({
          where: and(
            eq(helpRequests.groupId, group.id),
            eq(helpRequests.status, 'pending')
          ),
          orderBy: desc(helpRequests.createdAt)
        });

        // For each goal, fetch progress for all participants
        let goalsWithProgress: any[] = [];
        if (groupGoals && participants) {
          goalsWithProgress = await Promise.all(groupGoals.map(async (goal: any) => {
            // For each participant, fetch progress for this goal
            const progressArr = await Promise.all(participants.map(async (participant: any) => {
              const progress = await db.query.goalProgress.findFirst({
                where: and(
                  eq(goalProgress.participantId, participant.id),
                  eq(goalProgress.goalId, goal.id)
                )
              });
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
          completedGoals = goalsWithProgress.filter(g => g.progress && g.progress.every((p: any) => p && p.isCompleted)).length;
          progress = Math.round((completedGoals / totalGoals) * 100);
        }

        return {
          id: group.id,
          name: group.name,
          description: group.description,
          teacherId: group.teacherId,
          qrCodeToken: group.qrCodeToken,
          isActive: group.isActive,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          status: 'active',
          progress,
          memberCount: participants ? participants.length : 0,
          teacher: {
            id: group.teacherId,
            email: group.teacher?.email || 'teacher@example.com',
            fullName: group.teacher?.fullName || 'Current Teacher',
          },
          goals: goalsWithProgress,
          unresolvedHelpRequests: unresolvedHelpRequests ? unresolvedHelpRequests.length : 0
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