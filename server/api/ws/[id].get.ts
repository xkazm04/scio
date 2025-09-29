import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface PeerContext {
  groupId: string
  role: string
}

const activeConnections = new Map<string, Set<any>>()
const peerContexts = new WeakMap<any, PeerContext>()

export default defineWebSocketHandler({
  async open(peer) {
    const request = peer.request as any
    const groupId = request?.url?.split('/').pop()?.split('?')[0]
    const url = new URL(request?.url || '', 'http://localhost')
    const role = url.searchParams.get('role') || 'student'

    if (!groupId) {
      peer.close(1008, 'Missing group ID')
      return
    }

    try {
      // Add connection to group
      if (!activeConnections.has(groupId)) {
        activeConnections.set(groupId, new Set())
      }
      activeConnections.get(groupId)!.add(peer)

      // Store context
      peerContexts.set(peer, { groupId, role })

      console.log(`WebSocket connected: Group ${groupId}, Role: ${role}`)

      // Send initial connection confirmation
      peer.send(JSON.stringify({
        type: 'connected',
        groupId,
        role,
        timestamp: new Date().toISOString()
      }))

    } catch (error) {
      console.error('WebSocket connection error:', error)
      peer.close(1011, 'Internal error')
    }
  },

  async close(peer) {
    const context = peerContexts.get(peer)
    if (context?.groupId && activeConnections.has(context.groupId)) {
      activeConnections.get(context.groupId)!.delete(peer)
      if (activeConnections.get(context.groupId)!.size === 0) {
        activeConnections.delete(context.groupId)
      }
    }
    peerContexts.delete(peer)
    console.log(`WebSocket disconnected: Group ${context?.groupId}`)
  },

  async message(peer, message) {
    try {
      const data = JSON.parse(message.toString())
      const context = peerContexts.get(peer)

      if (!context) return

      // Handle different message types
      switch (data.type) {
        case 'ping':
          peer.send(JSON.stringify({ type: 'pong' }))
          break
          
        case 'goal_progress_update':
          // Broadcast progress update to all connections in the group
          broadcastToGroup(context.groupId, {
            type: 'goal_progress_updated',
            data: data.payload,
            timestamp: new Date().toISOString()
          })
          break
          
        case 'help_request':
          // Broadcast help request to teachers in the group
          broadcastToGroup(context.groupId, {
            type: 'help_request_created',
            data: data.payload,
            timestamp: new Date().toISOString()
          }, 'teacher')
          break
          
        case 'help_resolved':
          // Broadcast help resolution to all connections in the group
          broadcastToGroup(context.groupId, {
            type: 'help_request_resolved',
            data: data.payload,
            timestamp: new Date().toISOString()
          })
          break

        case 'new_message':
          // Broadcast new message to all connections in the group
          broadcastToGroup(context.groupId, {
            type: 'message_created',
            data: data.payload,
            timestamp: new Date().toISOString()
          })
          break
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  }
})

// Helper function to broadcast to all connections in a group
function broadcastToGroup(groupId: string, message: any, roleFilter?: string) {
  const connections = activeConnections.get(groupId)
  if (!connections) return

  const messageStr = JSON.stringify(message)
  connections.forEach(connection => {
    const context = peerContexts.get(connection)
    if (roleFilter && context?.role !== roleFilter) return
    
    try {
      connection.send(messageStr)
    } catch (error) {
      console.error('Failed to send message to connection:', error)
      connections.delete(connection)
    }
  })
}

// Export for external use
export { broadcastToGroup, activeConnections }