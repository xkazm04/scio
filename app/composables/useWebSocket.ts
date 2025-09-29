export const useWebSocket = (groupId: string, userRole: string) => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = ref(1000)

  const connect = () => {
    if (typeof window === 'undefined') return

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/ws/${groupId}?role=${userRole}`
      
      socket.value = new WebSocket(wsUrl)

      socket.value.onopen = () => {
        console.log('WebSocket connected')
        isConnected.value = true
        reconnectAttempts.value = 0
        reconnectDelay.value = 1000
      }

      socket.value.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        isConnected.value = false
        
        // Attempt to reconnect if not a clean closure
        if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.value++
            reconnectDelay.value = Math.min(reconnectDelay.value * 2, 10000)
            connect()
          }, reconnectDelay.value)
        }
      }

      socket.value.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close(1000, 'Client disconnect')
      socket.value = null
    }
  }

  const send = (data: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(data))
    }
  }

  const onMessage = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          callback(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected: readonly(isConnected),
    connect,
    disconnect,
    send,
    onMessage
  }
}