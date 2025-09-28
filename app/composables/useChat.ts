import { ref, computed, nextTick } from 'vue'
import type { Goal } from '~/helpers/goalHelpers'
import { updateGoalProgress } from '~/helpers/goalHelpers'
import { checkMessageRelevance, generateMathResponse, generateOffTopicResponse } from '~/helpers/messageFormatting'

export interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  warning?: string
}

export function useChat(groupId: string, groupData: any, goals: Ref<Goal[]>) {
  const messages = ref<Message[]>([])
  const messageInput = ref('')
  const isProcessing = ref(false)
  const isTyping = ref(false)
  const messagesContainer = ref<HTMLElement>()
  const chatMode = ref<'standard' | 'ai'>('standard')

  const handleModeToggle = () => {
    chatMode.value = chatMode.value === 'standard' ? 'ai' : 'standard'
    
    // Add a system message about the mode change
    const modeChangeMsg: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: chatMode.value === 'ai' 
        ? 'Přepnuto na AI Učitel režim. Nyní máte přístup k pokročilému AI učiteli matematiky!' 
        : 'Přepnuto na standardní režim. Studijní asistent je připraven pomoci.',
      timestamp: new Date()
    }
    
    messages.value.push(modeChangeMsg)
    scrollToBottom()
  }

  const useSuggestion = (suggestion: string) => {
    messageInput.value = suggestion
  }

  const sendMessage = async () => {
    if (!messageInput.value.trim() || isProcessing.value) return

    const userMessage = messageInput.value.trim()
    messageInput.value = ''
    
    // Add user message
    messages.value.push({
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    scrollToBottom()
    
    // Start processing
    isProcessing.value = true
    isTyping.value = true

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Call the appropriate chat API based on mode
      const apiEndpoint = chatMode.value === 'ai' ? '/api/group/ai-teacher' : '/api/group/chat'
      const response = await $fetch(apiEndpoint, {
        method: 'POST',
        body: {
          message: userMessage,
          ...(chatMode.value === 'standard' && { 
            groupId: groupId as string,
            mode: chatMode.value 
          }),
          context: {
            groupData: {
              name: groupData.value.name,
              description: groupData.value.description
            },
            goals: goals.value,
            previousMessages: messages.value.slice(-5) // Last 5 messages for context
          }
        }
      }) as any
      
      isTyping.value = false
      
      // Add assistant response
      messages.value.push({
        id: Date.now().toString(),
        type: 'assistant',
        content: response.content || 'Omlouvám se, nastala chyba při zpracování vaší zprávy.',
        timestamp: new Date(),
        warning: response.warning
      })

      // Update goals if progress was made
      if (response.progressUpdates) {
        response.progressUpdates.forEach((update: any) => {
          const goal = goals.value.find(g => g.id === update.goalId)
          if (goal) {
            if (goal.type === 'boolean') {
              goal.completed = update.completed
            } else {
              goal.progress = update.progress
              goal.current = update.current
            }
          }
        })
      } else {
        // Update goals based on message content if no API response
        goals.value = updateGoalProgress(goals.value, userMessage)
      }

      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      isTyping.value = false
      
      // Fallback to local processing
      const isRelevant = checkMessageRelevance(userMessage)
      const fallbackResponse = isRelevant 
        ? generateMathResponse()
        : generateOffTopicResponse()
      
      messages.value.push({
        id: Date.now().toString(),
        type: 'assistant',
        content: fallbackResponse.content,
        timestamp: new Date(),
        warning: 'warning' in fallbackResponse ? (fallbackResponse.warning as string) : undefined
      })
      
      // Update goals based on message content
      goals.value = updateGoalProgress(goals.value, userMessage)
      scrollToBottom()
    } finally {
      isProcessing.value = false
    }
  }

  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return {
    messages,
    messageInput,
    isProcessing,
    isTyping,
    messagesContainer,
    chatMode,
    handleModeToggle,
    useSuggestion,
    sendMessage,
    scrollToBottom,
    handleKeyDown
  }
}
