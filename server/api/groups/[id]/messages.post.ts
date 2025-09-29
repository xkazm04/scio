import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required'
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

    // Get participant info if student
    let participantId: string | null = null
    if (body.deviceId) {
      const { data: participant } = await supabase
        .from('group_participants')
        .select('id')
        .eq('group_id', groupId)
        .eq('device_id', body.deviceId)
        .single()
      
      participantId = participant?.id || null
    }

    // Save message to database
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        group_id: groupId,
        participant_id: participantId,
        content: body.message,
        is_system_message: false,
        is_goal_relevant: body.isGoalRelevant || false,
        ai_analysis: body.aiAnalysis || null
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error saving message:', messageError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save message'
      })
    }

    // Update participant's last activity
    if (participantId) {
      await supabase
        .from('group_participants')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', participantId)
    }

    return {
      success: true,
      data: {
        id: message.id,
        content: message.content,
        timestamp: message.created_at,
        participantId: message.participant_id,
        isSystemMessage: message.is_system_message,
        isGoalRelevant: message.is_goal_relevant
      }
    }

  } catch (error: any) {
    console.error('Error in message endpoint:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})