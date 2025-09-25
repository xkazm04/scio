<template>
  <div class="p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40 relative">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-blue-50/10"></div>
    <div class="relative flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {{ mode === 'ai' ? 'AI Učitel' : 'Studijní chat' }}
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ mode === 'ai' ? 'Pokročilý AI asistent pro matematiku' : 'Kolaborativní studijní prostor' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Mode Toggle -->
        <div class="flex items-center bg-white/80 backdrop-blur-xl rounded-xl p-1 border border-white/30 shadow-lg">
          <button
            @click="$emit('toggle-mode')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              mode === 'standard'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100/60'
            ]"
          >
            📚 Standard
          </button>
          <button
            @click="$emit('toggle-mode')"
            :class="[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
              mode === 'ai'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100/60'
            ]"
          >
            🤖 AI Učitel
          </button>
        </div>
        
        <!-- Processing indicator -->
        <div v-if="isProcessing" class="flex items-center space-x-2 bg-white/80 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/30 shadow-lg">
          <div class="animate-spin">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-700">Zpracovávám...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode: 'standard' | 'ai'
  isProcessing: boolean
}

defineProps<Props>()

defineEmits<{
  'toggle-mode': []
}>()
</script>