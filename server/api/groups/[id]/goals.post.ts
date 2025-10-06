import { eq } from 'drizzle-orm'
import { goals, groups } from '~/lib/database/schema'
import { rawDb } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    const groupId = getRouterParam(event, 'id')
    
    if (!groupId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Group ID is required',
      })
    }

    // Verify group exists
    const group = await rawDb
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1)
    
    if (!group.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found',
      })
    }

    // Get request body
    const body = await readBody(event)
    const { title, description, goalType, targetValue, orderIndex } = body

    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Goal title is required',
      })
    }

    // Create goal
    const [createdGoal] = await rawDb
      .insert(goals)
      .values({
        groupId,
        title,
        description: description || null,
        goalType: goalType || 'percentage',
        targetValue: targetValue || 1,
        orderIndex: orderIndex || 0,
      })
      .returning()

    setResponseStatus(event, 201)
    return {
      success: true,
      data: createdGoal,
      message: 'Goal created successfully',
    }
  } catch (error: any) {
    console.error('Error creating goal:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create goal',
    })
  }
})
