<template>
  <div class="mb-6 transition-all duration-300 hover:translate-x-1">
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
      
      <div class="relative flex items-start space-x-4">
        <!-- Enhanced Avatar -->
        <div class="flex-shrink-0 relative">
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group-hover:scale-110 transition-all duration-300',
            type === 'user' 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
              : type === 'assistant'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-yellow-500 to-orange-600'
          ]">
            <!-- Shimmer effect on avatar -->
            <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
            
            <svg v-if="type === 'user'" class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <svg v-else-if="type === 'assistant'" class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          
          <!-- Status indicator -->
          <div :class="[
            'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg',
            type === 'user' 
              ? 'bg-emerald-500' 
              : type === 'assistant'
              ? 'bg-blue-500 animate-pulse'
              : 'bg-orange-500'
          ]"></div>
        </div>
        
        <div class="flex-1 min-w-0">
          <!-- Enhanced Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">            <span :class="[
              'text-sm font-bold uppercase tracking-wider flex items-center space-x-1',
              type === 'user' 
                ? 'text-blue-700' 
                : type === 'assistant'
                ? 'text-blue-700'
                : 'text-orange-700'
            ]">
              <span>{{ type === 'user' ? 'Vy' : type === 'system' ? 'Systém' : (mode === 'ai' ? 'AI Učitel' : 'Asistent') }}</span>
              <div v-if="type === 'assistant'" :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                mode === 'ai' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-blue-100 text-blue-700'
              ]">
                {{ mode === 'ai' ? '🤖 AI' : '📚' }}
              </div>
            </span>
            </div>
            <span class="text-xs text-gray-500 font-mono bg-gray-100/60 px-2 py-1 rounded-full">
              {{ formatTime(timestamp) }}
            </span>
          </div>
          
          <!-- Enhanced Content -->
          <div class="text-gray-800 leading-relaxed">
            <!-- Content with better typography -->
            <div 
              class="prose prose-sm max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded"
              v-html="formatMessage(content)"
            ></div>
          </div>
          
          <!-- Enhanced Warning -->
          <div v-if="warning" class="mt-4 relative overflow-hidden bg-gradient-to-r from-yellow-50/90 to-orange-50/80 border border-yellow-200/60 rounded-2xl p-4 shadow-lg">
            <!-- Warning pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
            </div>
            
            <div class="relative flex items-start space-x-3">
              <div class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-xs font-semibold text-yellow-800 mb-1 uppercase tracking-wide">⚠️ Upozornění</div>
                <div class="text-sm text-yellow-800 font-medium">{{ warning }}</div>
              </div>
            </div>
          </div>
          
          <!-- Message actions (hover) -->
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 flex items-center space-x-2">
            <button class="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>Kopírovat</span>
            </button>
            <button v-if="type === 'assistant'" class="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center space-x-1">
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
import { formatMessage, formatTime } from '~/helpers/messageFormatting'

interface Props {
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  warning?: string
  mode?: 'standard' | 'ai'
}

defineProps<Props>()
</script>

<style scoped>
/* Enhanced animations */
.group:hover .animate-pulse {
  animation-duration: 1s;
}
</style>