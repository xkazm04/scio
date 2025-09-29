<template>
  <div class="p-6 border-t border-white/20 backdrop-blur-3xl bg-gradient-to-r from-slate-50/40 via-white/30 to-blue-50/40 relative overflow-hidden">
    <!-- Animated background gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>
    
    <div class="relative">
      <div class="flex items-end space-x-4">
        <!-- Main input container with floating effect -->
        <div class="flex-1 relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          
          <div class="relative">
            <textarea
              :value="inputValue"
              @input="handleInput"
              @keydown="handleKeyDown"
              @focus="handleFocus"
              @blur="handleBlur"
              :disabled="isProcessing"
              :placeholder="mode === 'ai' ? '✨ Zeptejte se AI učitele na cokoliv... (Enter pro odeslání)' : '💬 Napište svou zprávu nebo otázku... (Enter pro odeslání)'"
              class="w-full px-6 py-4 pr-32 bg-white/95 backdrop-blur-2xl border-2 border-slate-200/60 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium shadow-xl hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
              :class="{'ring-4 ring-purple-500/30 border-purple-400': mode === 'ai' && isFocused}"
              rows="1"
              style="max-height: 160px; min-height: 56px;"
              ref="textareaRef"
            ></textarea>
            
            <!-- Character count for long messages -->
            <Transition name="fade">
              <div v-if="inputValue.length > 100" class="absolute -top-7 right-4 text-xs font-semibold text-slate-500 bg-white/90 px-2 py-1 rounded-lg shadow-sm">
                {{ inputValue.length }} / 1000
              </div>
            </Transition>
            
            <!-- Voice Input Button with premium animation -->
            <button
              @click="handleVoiceInput"
              :disabled="isProcessing"
              :class="[
                'absolute right-20 top-1/2 transform -translate-y-1/2 p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl',
                isVoiceRecording 
                  ? 'text-white bg-gradient-to-br from-red-500 to-rose-600 animate-pulse-glow scale-110' 
                  : isVoiceProcessing
                    ? 'text-white bg-gradient-to-br from-blue-500 to-indigo-600 animate-spin-slow'
                    : 'text-slate-600 bg-white hover:text-blue-600 hover:bg-blue-50 hover:scale-110'
              ]"
              :title="isVoiceRecording ? 'Klikněte pro ukončení a odeslání' : 'Hlasový vstup (automaticky odešle)'"
            >
              <svg v-if="!isVoiceProcessing" class="w-5 h-5 transition-transform" :class="{'scale-125': isVoiceRecording}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="isVoiceRecording 
                    ? 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
                    : 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'"
                />
                <circle v-if="isVoiceRecording" cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            
            <!-- Mode indicator badge -->
            <Transition name="slide-down">
              <div v-if="mode === 'ai' && !inputValue && !isFocused" class="absolute -top-9 left-6">
                <div class="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl animate-float-gentle">
                  <span>🤖</span>
                  <span>AI Režim aktivní</span>
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </Transition>
            
            <!-- Voice recording indicator -->
            <Transition name="slide-down">
              <div v-if="isVoiceRecording" class="absolute -top-9 right-6">
                <div class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl animate-pulse-glow">
                  <div class="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span>🎤 Nahrávání...</span>
                </div>
              </div>
            </Transition>
            
            <!-- Voice processing indicator -->
            <Transition name="slide-down">
              <div v-if="isVoiceProcessing" class="absolute -top-9 right-6">
                <div class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl">
                  <div class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>⏳ Zpracovávám...</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        
        <!-- Premium send button -->
        <button
          @click="$emit('send-message')"
          :disabled="!inputValue.trim() || isProcessing"
          :class="[
            'relative p-4 text-white rounded-2xl transition-all duration-300 shadow-2xl transform overflow-hidden group',
            !inputValue.trim() || isProcessing
              ? 'bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed opacity-60'
              : mode === 'ai'
                ? 'bg-gradient-to-r from-purple-500 via-pink-600 to-rose-600 hover:shadow-purple-500/50 hover:scale-110 hover:-translate-y-1 active:scale-95'
                : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:shadow-blue-500/50 hover:scale-110 hover:-translate-y-1 active:scale-95'
          ]"
        >
          <span class="relative z-10">
            <svg v-if="!isProcessing" class="w-6 h-6 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <div v-else class="animate-spin">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
          </span>
          <div v-if="!isProcessing && inputValue.trim()" class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer-fast"></div>
        </button>
      </div>
      
      <!-- AI Quick suggestions with premium cards -->
      <Transition name="expand">
        <div v-if="mode === 'ai' && inputValue.length === 0 && !isFocused" class="mt-5">
          <div class="flex items-center space-x-2 mb-3">
            <div class="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Rychlé dotazy</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              v-for="suggestion in aiSuggestions"
              :key="suggestion"
              @click="$emit('use-suggestion', suggestion)"
              class="group relative px-4 py-3 text-sm bg-white/90 backdrop-blur-xl text-slate-700 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-slate-200/60 hover:border-purple-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 text-left font-medium"
            >
              <div class="flex items-center space-x-2">
                <span class="text-lg group-hover:scale-125 transition-transform">✨</span>
                <span class="line-clamp-1">{{ suggestion }}</span>
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVoiceInput } from '../../../composables/useVoiceInput'

interface Props {
  inputValue: string
  isProcessing: boolean
  mode: 'standard' | 'ai'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'send-message': []
  'use-suggestion': [suggestion: string]
  'update:inputValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const isFocused = ref(false)

// Voice input composable
const { isRecording: isVoiceRecording, isProcessing: isVoiceProcessing, toggleRecording } = useVoiceInput()

const aiSuggestions = [
  'Jak vypočítám diskriminant?',
  'Vysvětli kvadratické rovnice',
  'Ukažte příklad řešení',
  'Rozdíl mezi lineární a kvadratickou',
  'Jak nakreslit parabolu?',
  'Co je to kořen rovnice?'
]

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:inputValue', target.value)
  autoResize()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (props.inputValue.trim() && !props.isProcessing) {
      emit('send-message')
    }
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleVoiceInput = async () => {
  try {
    const result = await toggleRecording()
    
    if (result && result.trim()) {
      emit('update:inputValue', result)
      await nextTick()
      emit('send-message')
    }
  } catch (error) {
    console.error('Voice input error:', error)
  }
}

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 160) + 'px'
  }
}

onMounted(() => {
  autoResize()
})
</script>

<style scoped>
@import "tailwindcss" reference;

@keyframes shimmer-fast {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(239, 68, 68, 0.8);
  }
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-shimmer-fast {
  animation: shimmer-fast 1.5s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-float-gentle {
  animation: float-gentle 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

/* Transition animations */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.8);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.95);
}

.expand-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.8);
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: scaleY(1);
}
</style>