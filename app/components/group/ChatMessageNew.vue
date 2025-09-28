<template>
  <div class="mb-3 transition-all duration-300 group">
    <!-- Linear border accent for elegant distinction -->
    <div class="relative">
      <div 
        :class="[
          'relative rounded-xl p-3 pb-6 border transition-all duration-300 group-hover:shadow-lg overflow-hidden',
          type === 'user' 
            ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-blue-200/60 ml-8' 
            : 'bg-gradient-to-br from-white/95 to-gray-50/80 border-gray-200/60 mr-8'
        ]"
      >
        <!-- Subtle linear pattern overlay -->
        <div 
          :class="[
            'absolute inset-0 opacity-30',
            type === 'user' 
              ? 'bg-gradient-to-br from-blue-100/20 to-transparent' 
              : 'bg-gradient-to-br from-gray-100/20 to-transparent'
          ]"
          style="background-image: linear-gradient(135deg, transparent 45%, rgba(99, 102, 241, 0.02) 50%, transparent 55%); background-size: 30px 30px;"
        ></div>

        <!-- Left accent line -->
        <div 
          :class="[
            'absolute left-0 top-4 bottom-4 w-1 rounded-r transition-all duration-300',
            type === 'user' 
              ? 'bg-gradient-to-b from-blue-500 to-indigo-600' 
              : mode === 'ai' 
                ? 'bg-gradient-to-b from-purple-500 to-violet-600'
                : 'bg-gradient-to-b from-gray-500 to-gray-600'
          ]"
        ></div>

        <div class="relative ml-3">
          <!-- Slim Message Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="font-semibold text-gray-900 text-sm">
              {{ type === 'user' ? 'Vy' : (mode === 'ai' ? 'AI Učitel' : 'Asistent') }}
            </div>
            
            <!-- Copy button -->
            <button 
              @click="copyMessage"
              class="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1 rounded-md hover:bg-blue-50"
              title="Kopírovat zprávu"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>

          <!-- Warning with elegant styling -->
          <div v-if="warning" class="mb-4 relative overflow-hidden bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/60 rounded-lg p-3">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>
            <div class="flex items-start space-x-3 ml-2">
              <svg class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <p class="text-sm text-amber-800 font-medium">{{ warning }}</p>
            </div>
          </div>

          <!-- Message Content -->
          <div class="text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none mb-2">
            <div v-html="formatMessage(content)"></div>
          </div>
          
          <!-- Fixed timestamp in bottom right -->
          <div class="absolute bottom-2 right-3 text-xs text-gray-400 font-mono">
            {{ formatTime(timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMessage } from '~/helpers/messageFormatting'

interface Props {
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  warning?: string
  mode: 'standard' | 'ai'
}

const props = defineProps<Props>()

// Helper function to format timestamp
const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('cs-CZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Copy message content to clipboard
const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    // Could add toast notification here if needed
  } catch (err) {
    console.error('Failed to copy message:', err)
  }
}
</script>

<style scoped>
/* Custom styling for message content */
.group:hover .opacity-0 {
  opacity: 1;
}
</style>
