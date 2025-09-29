import { createClient } from '@supabase/supabase-js'

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
  const query = getQuery(event)
  const role = query.role as string
  const lastUpdate = query.lastUpdate as string

  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Group ID is required'
    })
  }

  try {
    const updates: any[] = []
    const since = lastUpdate ? new Date(lastUpdate) : new Date(Date.now() - 60000) // Last minute

    // Get recent goal progress updates
    const { data: progressUpdates } = await supabase
      .from('goal_progress')
      .select(`
        *,
        participant:group_participants(id, nickname),
        goal:goals(id, title)
      `)
      .gte('updated_at', since.toISOString())
      .eq('goal.group_id', groupId)

    if (progressUpdates) {
      progressUpdates.forEach(progress => {
        updates.push({
          type: 'goal_progress_updated',
          data: {
            participantId: progress.participant_id,
            goalId: progress.goal_id,
            currentValue: progress.current_value,
            isCompleted: progress.is_completed,
            progress: progress.goal?.target_value > 0 ? 
              Math.round((progress.current_value / progress.goal.target_value) * 100) : 
              (progress.is_completed ? 100 : 0)
          },
          timestamp: progress.updated_at
        })
      })
    }

    // Get recent help requests (for teachers)
    if (role === 'teacher') {
      const { data: helpRequests } = await supabase
        .from('help_requests')
        .select(`
          *,
          participant:group_participants(id, nickname)
        `)
        .eq('group_id', groupId)
        .gte('created_at', since.toISOString())

      if (helpRequests) {
        helpRequests.forEach(request => {
          updates.push({
            type: request.status === 'resolved' ? 'help_request_resolved' : 'help_request_created',
            data: {
              participantId: request.participant_id,
              requestId: request.id,
              reason: request.reason,
              status: request.status
            },
            timestamp: request.status === 'resolved' ? request.resolved_at : request.created_at
          })
        })
      }
    }

    // Get recent messages
    const { data: messages } = await supabase
      .from('messages')
      .select(`
        *,
        participant:group_participants(id, nickname)
      `)
      .eq('group_id', groupId)
      .gte('created_at', since.toISOString())

    if (messages) {
      messages.forEach(message => {
        updates.push({
          type: 'message_created',
          data: {
            participantId: message.participant_id,
            messageId: message.id,
            content: message.content
          },
          timestamp: message.created_at
        })
      })
    }

    return {
      success: true,
      updates: updates.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
      lastUpdate: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('Error fetching real-time updates:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch updates'
    })
  }
})