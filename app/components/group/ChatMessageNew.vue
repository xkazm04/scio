<template>
  <div class="mb-4 transition-all duration-500 group animate-slide-in">
    <div class="relative">
      <div 
        :class="[
          'relative rounded-3xl p-5 pb-8 transition-all duration-500 group-hover:scale-[1.01] overflow-hidden',
          type === 'user' 
            ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/60 ml-12 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50' 
            : mode === 'ai'
              ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200/60 mr-12 shadow-lg hover:shadow-2xl hover:shadow-purple-200/50'
              : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 border-2 border-slate-200/60 mr-12 shadow-lg hover:shadow-2xl hover:shadow-slate-200/50'
        ]"
      >
        <!-- Animated gradient overlay -->
        <div 
          :class="[
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            type === 'user' 
              ? 'bg-gradient-to-br from-blue-100/30 to-transparent' 
              : mode === 'ai'
                ? 'bg-gradient-to-br from-purple-100/30 to-transparent'
                : 'bg-gradient-to-br from-slate-100/30 to-transparent'
          ]"
        ></div>

        <!-- Premium accent bar -->
        <div 
          :class="[
            'absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2',
            type === 'user' 
              ? 'bg-gradient-to-b from-blue-500 via-indigo-600 to-purple-600' 
              : mode === 'ai' 
                ? 'bg-gradient-to-b from-purple-500 via-pink-600 to-rose-600'
                : 'bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700'
          ]"
        ></div>

        <div class="relative ml-3">
          <!-- Enhanced Message Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <!-- Avatar with gradient border -->
              <div 
                :class="[
                  'relative w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                  type === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600' 
                    : mode === 'ai'
                      ? 'bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600'
                      : 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700'
                ]"
              >
                <span class="text-sm">{{ type === 'user' ? '👤' : (mode === 'ai' ? '🤖' : '📚') }}</span>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              
              <div>
                <div class="font-black text-base text-slate-900">
                  {{ type === 'user' ? 'Vy' : (mode === 'ai' ? 'AI Učitel' : 'Asistent') }}
                </div>
                <div class="text-xs font-semibold text-slate-500">
                  {{ formatTime(timestamp) }}
                </div>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex items-center space-x-2">
              <!-- Copy button with tooltip -->
              <div class="relative group/btn">
                <button 
                  @click="copyMessage"
                  class="p-2 text-slate-400 hover:text-blue-600 bg-white/60 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-110 active:scale-95"
                  title="Kopírovat zprávu"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
                <!-- Tooltip -->
                <div class="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Kopírovat zprávu
                  <div class="absolute top-full right-4 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
              
              <!-- More options -->
              <button 
                class="p-2 text-slate-400 hover:text-slate-600 bg-white/60 hover:bg-slate-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-110 active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Warning with premium styling -->
          <Transition name="warning-expand">
            <div v-if="warning" class="mb-5 relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300/60 rounded-2xl p-4 shadow-lg">
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600"></div>
              <div class="flex items-start space-x-3 ml-2">
                <div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-amber-900 mb-1">⚠️ Upozornění</p>
                  <p class="text-sm text-amber-800 leading-relaxed">{{ warning }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Message Content with premium typography -->
          <div class="text-slate-800 text-base leading-loose prose prose-base max-w-none mb-3">
            <div v-html="formatMessage(content)" class="message-content"></div>
          </div>
          
          <!-- Floating timestamp with glassmorphism -->
          <div class="absolute bottom-3 right-4 flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/60">
            <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs font-bold text-slate-600">{{ formatTime(timestamp) }}</span>
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
    // Show subtle success feedback (could add toast notification here)
    console.log('Message copied to clipboard')
  } catch (err) {
    console.error('Failed to copy message:', err)
  }
}
</script>

<style scoped>
@import "tailwindcss" reference;

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-in {
  animation: slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Warning animation */
.warning-expand-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.warning-expand-leave-active {
  transition: all 0.3s ease;
}
.warning-expand-enter-from, .warning-expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0) translateY(-10px);
}
.warning-expand-enter-to, .warning-expand-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: scaleY(1) translateY(0);
}

/* Enhanced prose styling for message content */
.message-content :deep(p) {
  @apply mb-3 last:mb-0;
}

.message-content :deep(strong) {
  @apply font-black text-slate-900;
}

.message-content :deep(em) {
  @apply italic text-slate-700;
}

.message-content :deep(code) {
  @apply px-2 py-1 bg-slate-900 text-slate-100 rounded-lg text-sm font-mono;
}

.message-content :deep(pre) {
  @apply p-4 bg-slate-900 text-slate-100 rounded-2xl overflow-x-auto my-4 shadow-xl;
}

.message-content :deep(ul), .message-content :deep(ol) {
  @apply ml-6 mb-3 space-y-2;
}

.message-content :deep(li) {
  @apply text-slate-800;
}

.message-content :deep(a) {
  @apply text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 transition-colors;
}

.message-content :deep(h1), .message-content :deep(h2), .message-content :deep(h3) {
  @apply font-black text-slate-900 mb-3 mt-5 first:mt-0;
}

.message-content :deep(blockquote) {
  @apply border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50/50 rounded-r-xl italic text-slate-700;
}
</style>