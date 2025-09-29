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
  const participantId = getRouterParam(event, 'id')
  
  if (!participantId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Participant ID is required'
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

    // Resolve all pending help requests for this participant
    const { data: resolvedRequests, error } = await supabase
      .from('help_requests')
      .update({ 
        status: 'resolved',
        resolved_by: userId,
        resolved_at: new Date().toISOString()
      })
      .eq('participant_id', participantId)
      .eq('status', 'pending')
      .select()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to resolve help requests'
      })
    }

    return {
      success: true,
      data: {
        resolvedCount: resolvedRequests?.length || 0,
        participantId
      }
    }

  } catch (error: any) {
    console.error('Error resolving help requests:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})