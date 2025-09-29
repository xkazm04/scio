export const useRealTime = (groupId: string, userRole: string) => {
  const updates = ref<any[]>([])
  const isConnected = ref(false)
  const lastUpdate = ref<string | null>(null)
  let pollingInterval: NodeJS.Timeout | null = null

  const startPolling = () => {
    if (typeof window === 'undefined') return

    isConnected.value = true
    pollingInterval = setInterval(async () => {
      try {
        const params = new URLSearchParams({
          role: userRole,
          ...(lastUpdate.value && { lastUpdate: lastUpdate.value })
        })

        const response = await $fetch(`/api/realtime/${groupId}?${params}`) as any
        
        if (response?.success && response?.updates && response.updates.length > 0) {
          updates.value = response.updates
          lastUpdate.value = response.lastUpdate
          
          // Call message handlers
          response.updates.forEach((update: any) => {
            onMessageCallbacks.forEach(callback => callback(update))
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    isConnected.value = false
  }

  const onMessageCallbacks = new Set<(data: any) => void>()

  const onMessage = (callback: (data: any) => void) => {
    onMessageCallbacks.add(callback)
    
    return () => {
      onMessageCallbacks.delete(callback)
    }
  }

  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    isConnected: readonly(isConnected),
    updates: readonly(updates),
    startPolling,
    stopPolling,
    onMessage
  }
}