<template>
  <div class="text-center py-8">
    <!-- Elegant linear welcome card -->
    <div class="relative max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-white/95 to-gray-50/80 rounded-2xl p-8 border border-gray-200/60 shadow-lg overflow-hidden">
        <!-- Subtle linear pattern overlay -->
        <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(45deg, transparent 45%, rgba(59, 130, 246, 0.02) 50%, transparent 55%); background-size: 40px 40px;"></div>
        
        <!-- Top accent line -->
        <div class="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-60"></div>
        
        <div class="relative">
          <!-- Header with icon -->
          <div class="flex items-center justify-center space-x-4 mb-6">
            <div 
              :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg',
                mode === 'ai' 
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 border-purple-400/60' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/60'
              ]"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div class="text-left">
              <h2 class="text-2xl font-bold text-gray-900">
                Vítejte ve studijní skupině
              </h2>
              <div 
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1',
                  mode === 'ai' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                ]">
                {{ mode === 'ai' ? '🤖 AI Učitel je připraven' : '📚 Asistent je připraven' }}
              </div>
            </div>
          </div>
          
          <!-- Goal description card -->
          <div class="bg-white/80 rounded-xl p-6 border border-gray-200/40 shadow-sm mb-6">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-400/60 shadow-sm">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-emerald-700 mb-2">Váš studijní cíl:</div>
                <p class="text-gray-700 leading-relaxed">{{ groupDescription }}</p>
              </div>
            </div>
          </div>
          
          <!-- Call to action -->
          <div class="bg-gray-50/80 rounded-xl p-4 border border-gray-200/40 shadow-sm">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center border border-gray-500/60 shadow-sm">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <div class="text-sm text-gray-600 font-medium">
                  Začněte položením otázky nebo sdělte, na čem byste chtěli dnes pracovat.
                </div>
              </div>
              <div class="text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode: 'standard' | 'ai'
  groupDescription?: string
}

defineProps<Props>()
</script>
