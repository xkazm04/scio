import { drizzleDb as db } from '~/lib/database'
import { groups, users, goals, groupParticipants, goalProgress } from '~/lib/database/schema'
import { eq, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const deviceId = query.deviceId as string
  
  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required'
    })
  }

  if (!deviceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device ID is required for student access'
    })
  }

  try {
    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization token required'
      })
    }

    const token = authHeader.split(' ')[1]
    const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET || 'your-jwt-secret'
    
    let userId: string
    try {
      const payload = jwt.verify(token, supabaseJwtSecret) as any
      userId = payload.sub
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication token'
      })
    }

    // Get group information using Drizzle
    const group = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        teacherId: groups.teacherId,
        teacher: {
          id: users.id,
          fullName: users.fullName,
          email: users.email
        }
      })
      .from(groups)
      .leftJoin(users, eq(groups.teacherId, users.id))
      .where(eq(groups.id, groupId))
      .limit(1)

    if (group.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found'
      })
    }

    const groupData = group[0]

    // Find participant by device ID using Drizzle
    const participant = await db
      .select()
      .from(groupParticipants)
      .where(
        and(
          eq(groupParticipants.groupId, groupId),
          eq(groupParticipants.deviceId, deviceId),
          eq(groupParticipants.isActive, true)
        )
      )
      .limit(1)

    if (participant.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found in this group'
      })
    }

    const participantData = participant[0]

    // Get goals with student's progress using Drizzle
    const goalsWithProgress = await db
      .select({
        id: goals.id,
        title: goals.title,
        description: goals.description,
        goalType: goals.goalType,
        targetValue: goals.targetValue,
        orderIndex: goals.orderIndex,
        progress: {
          id: goalProgress.id,
          currentValue: goalProgress.currentValue,
          isCompleted: goalProgress.isCompleted,
          updatedAt: goalProgress.updatedAt
        }
      })
      .from(goals)
      .leftJoin(
        goalProgress,
        and(
          eq(goalProgress.goalId, goals.id),
          eq(goalProgress.participantId, participantData.id)
        )
      )
      .where(eq(goals.groupId, groupId))
      .orderBy(goals.orderIndex)

    // Transform goals data for response
    const transformedGoals = goalsWithProgress.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      goalType: item.goalType,
      targetValue: item.targetValue,
      currentValue: item.progress?.currentValue || 0,
      isCompleted: item.progress?.isCompleted || false,
      progress: item.goalType === 'percentage' && item.targetValue > 0 
        ? Math.round(((item.progress?.currentValue || 0) / item.targetValue) * 100)
        : item.progress?.isCompleted ? 100 : 0
    }))

    return {
      success: true,
      data: {
        group: {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description,
          teacher: groupData.teacher
        },
        participant: {
          id: participantData.id,
          nickname: participantData.nickname,
          deviceId: participantData.deviceId,
          joinedAt: participantData.joinedAt
        },
        goals: transformedGoals,
        messages: [] // You can add message fetching here if needed
      }
    }

  } catch (error: any) {
    console.error('Error in student group endpoint:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})