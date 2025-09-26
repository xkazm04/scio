<template>
  <div class="p-6 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40">
    <div class="flex items-end space-x-4">
      <div class="flex-1 relative">
        <textarea
          :value="inputValue"
          @input="handleInput"
          @keydown="handleKeyDown"
          :disabled="isProcessing"
          :placeholder="mode === 'ai' ? 'Zeptejte se AI učitele na cokoliv o matematice... (Enter pro odeslání)' : 'Napište svou zprávu nebo otázku... (Enter pro odeslání)'"
          class="w-full px-4 py-3 pr-20 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/50 transition-all duration-200 text-gray-900 placeholder-gray-500"
          rows="1"
          style="max-height: 120px;"
          ref="textareaRef"
        ></textarea>
        
        <!-- Voice Input Button with Animation -->
        <button
          @click="handleVoiceInput"
          :disabled="isProcessing"
          :class="[
            'absolute right-14 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300',
            isVoiceRecording 
              ? 'text-red-600 bg-red-50 hover:bg-red-100 animate-pulse scale-110' 
              : isVoiceProcessing
                ? 'text-blue-600 bg-blue-50 animate-spin'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
          ]"
          :title="isVoiceRecording ? 'Klikněte pro ukončení nahrávání a odeslání' : 'Hlasový vstup (automaticky odešle)'"
        >
          <svg v-if="!isVoiceProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        <!-- AI mode indicator -->
        <div v-if="mode === 'ai'" class="absolute -top-8 left-4 text-xs text-purple-600 font-medium animate-pulse">
          🤖 AI Režim aktivní
        </div>
        
        <!-- Voice recording indicator -->
        <div v-if="isVoiceRecording" class="absolute -top-8 right-4 text-xs text-red-600 font-medium animate-pulse">
          🎤 Nahrávání...
        </div>
        
        <!-- Voice processing indicator -->
        <div v-if="isVoiceProcessing" class="absolute -top-8 right-4 text-xs text-blue-600 font-medium animate-pulse">
          ⏳ Zpracovávání a odesílání...
        </div>
      </div>
      
      <button
        @click="$emit('send-message')"
        :disabled="!inputValue.trim() || isProcessing"
        :class="[
          'p-3 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed',
          mode === 'ai' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        ]"
      >
        <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        <div v-else class="animate-spin">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
      </button>
    </div>
    
    <!-- Quick suggestions for AI mode -->
    <div v-if="mode === 'ai' && inputValue.length === 0" class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="suggestion in aiSuggestions"
        :key="suggestion"
        @click="$emit('use-suggestion', suggestion)"
        class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
      >
        {{ suggestion }}
      </button>
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

// Voice input composable
const { isRecording: isVoiceRecording, isProcessing: isVoiceProcessing, toggleRecording } = useVoiceInput()

const aiSuggestions = [
  'Jak vypočítám diskriminant?',
  'Vysvětli kvadratické rovnice',
  'Ukažte příklad řešení',
  'Rozdíl mezi lineární a kvadratickou rovnicí',
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
    // Send message if there's content and not processing
    if (props.inputValue.trim() && !props.isProcessing) {
      emit('send-message')
    }
  }
}

const handleVoiceInput = async () => {
  try {
    const result = await toggleRecording()
    
    if (result && result.trim()) {
      // Auto-send the transcribed voice message directly
      emit('update:inputValue', result)
      
      // Wait a brief moment for the input to update, then send
      await nextTick()
      emit('send-message')
    }
  } catch (error) {
    console.error('Voice input error:', error)
    // Show user-friendly error message
    if (error instanceof Error && error.message.includes('permission')) {
      // Could show a toast notification here
      console.log('Microphone permission denied')
    }
  }
}

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
  }
}
</script>