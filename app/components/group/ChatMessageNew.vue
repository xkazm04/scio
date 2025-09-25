<template>
  <div class="mb-6 transition-all duration-300 hover:translate-x-1 group">
    <div 
      :class="[
        'rounded-2xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md',
        type === 'user' 
          ? 'bg-blue-50/50 border-blue-100/60 ml-12'
          : 'bg-white border-gray-100/60 mr-12'
      ]"
    >
      <!-- Message Header -->
      <div class="flex items-center space-x-3 mb-3">
        <!-- Simple Avatar -->
        <div 
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold',
            type === 'user' 
              ? 'bg-blue-500'
              : mode === 'ai'
                ? 'bg-purple-500'
                : 'bg-gray-500'
          ]"
        >
          {{ type === 'user' ? 'U' : (mode === 'ai' ? 'AI' : 'A') }}
        </div>
        
        <!-- Sender Info -->
        <div>
          <div class="font-medium text-gray-900 text-sm">
            {{ type === 'user' ? 'You' : (mode === 'ai' ? 'AI Teacher' : 'Assistant') }}
          </div>
          <div class="text-xs text-gray-500">
            {{ formatTime(timestamp) }}
          </div>
        </div>
      </div>

      <!-- Warning if present -->
      <div v-if="warning" class="mb-3 p-2 bg-amber-50 border-l-4 border-amber-400 rounded">
        <p class="text-sm text-amber-700">{{ warning }}</p>
      </div>

      <!-- Message Content -->
      <div 
        class="text-gray-800 text-sm leading-relaxed"
        v-html="formatMessage(content)"
      ></div>

      <!-- Simple Actions -->
      <div v-if="type !== 'user'" class="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="text-xs text-gray-500 hover:text-blue-600 transition-colors">
          Copy
        </button>
        <span class="text-gray-300">•</span>
        <button class="text-xs text-gray-500 hover:text-green-600 transition-colors">
          Helpful
        </button>
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

defineProps<Props>()

// Helper function to format timestamp
const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('cs-CZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
/* Custom styling for message content */
.group:hover .opacity-0 {
  opacity: 1;
}
</style>
