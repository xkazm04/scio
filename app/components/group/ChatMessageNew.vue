<template>
  <div class="mb-6 transition-all duration-300 group">
    <!-- Linear border accent for elegant distinction -->
    <div class="relative">
      <div 
        :class="[
          'relative rounded-2xl p-5 border transition-all duration-300 group-hover:shadow-lg overflow-hidden',
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
          <!-- Message Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <!-- Elegant avatar with linear accent -->
              <div 
                :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold border shadow-sm',
                  type === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/60'
                    : mode === 'ai'
                      ? 'bg-gradient-to-br from-purple-500 to-violet-600 border-purple-400/60'
                      : 'bg-gradient-to-br from-gray-500 to-gray-600 border-gray-400/60'
                ]"
              >
                {{ type === 'user' ? 'V' : (mode === 'ai' ? 'AI' : 'A') }}
              </div>
              
              <!-- Sender Info -->
              <div>
                <div class="font-semibold text-gray-900 text-sm">
                  {{ type === 'user' ? 'Vy' : (mode === 'ai' ? 'AI Učitel' : 'Asistent') }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(timestamp) }}
                </div>
              </div>
            </div>

            <!-- Mode indicator badge -->
            <div v-if="type !== 'user'" 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium border',
                mode === 'ai' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              ]">
              {{ mode === 'ai' ? '🤖 AI' : '📚 Standard' }}
            </div>
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
          <div class="text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none">
            <div v-html="formatMessage(content)"></div>
          </div>

          <!-- Elegant action buttons on hover -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 flex items-center space-x-2">
            <button class="text-xs text-gray-400 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-blue-50">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>Kopírovat</span>
            </button>
            <button v-if="type !== 'user'" class="text-xs text-gray-400 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-emerald-50">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>Užitečné</span>
            </button>
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
