<template>
  <div class="relative p-6 border-b border-white/20 backdrop-blur-3xl bg-gradient-to-r from-slate-50/40 via-white/30 to-blue-50/40 overflow-hidden">
    <!-- Animated background orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-float-delayed"></div>
    </div>
    
    <!-- Teacher with no student selected - Enhanced instruction -->
    <div v-if="userRole === 'teacher' && !selectedStudent" class="relative text-center py-12">
      <div class="relative inline-block">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform transition-all duration-500 hover:scale-110 hover:rotate-3 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg class="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
        </div>
        <div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
      </div>
      
      <h3 class="text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-3 animate-fade-in">
        Vyberte studenta pro komunikaci
      </h3>
      <p class="text-base text-slate-600 max-w-lg mx-auto leading-relaxed animate-fade-in-delayed">
        Klikněte na tlačítko <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-green-100 text-green-700 font-semibold text-sm mx-1">💬 Poslat zprávu</span> u studenta v panelu vpravo
      </p>
      
      <!-- Animated hint arrow -->
      <div class="absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-500 animate-bounce-horizontal hidden xl:block">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </div>
    </div>
    
    <!-- Enhanced chat header when student is selected or for students -->
    <div v-else class="relative flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Premium chat icon with pulse animation -->
        <div class="relative">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-6 relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg class="w-7 h-7 text-white relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
        
        <div>
          <h3 class="text-xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-1">
            <template v-if="userRole === 'teacher' && selectedStudent">
              <span class="inline-flex items-center">
                Chat s <span class="ml-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 text-base">{{ selectedStudent }}</span>
              </span>
            </template>
            <template v-else>
              {{ mode === 'ai' ? '🤖 AI Učitel' : '📚 Studijní chat' }}
            </template>
          </h3>
          <p class="text-sm text-slate-600 font-medium">
            <template v-if="userRole === 'teacher'">
              Individuální komunikace • Real-time
            </template>
            <template v-else>
              {{ mode === 'ai' ? 'Pokročilý AI asistent dostupný 24/7' : 'Kolaborativní studijní prostor' }}
            </template>
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Premium Mode Toggle - only for students -->
        <div v-if="userRole === 'student'" class="relative">
          <div class="flex items-center bg-white/90 backdrop-blur-2xl rounded-2xl p-1.5 border border-white/60 shadow-2xl">
            <button
              @click="$emit('toggle-mode')"
              :class="[
                'relative px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 overflow-hidden',
                mode === 'standard'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
              ]"
            >
              <span class="relative z-10 flex items-center space-x-1.5">
                <span>📚</span>
                <span>Standard</span>
              </span>
              <div v-if="mode === 'standard'" class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer-slide"></div>
            </button>
            <button
              @click="$emit('toggle-mode')"
              :class="[
                'relative px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 overflow-hidden',
                mode === 'ai'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
              ]"
            >
              <span class="relative z-10 flex items-center space-x-1.5">
                <span>🤖</span>
                <span>AI Učitel</span>
              </span>
              <div v-if="mode === 'ai'" class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer-slide"></div>
            </button>
          </div>
          <div v-if="mode === 'ai'" class="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black rounded-full shadow-lg animate-pulse">
            PRO
          </div>
        </div>
        
        <!-- Enhanced processing indicator -->
        <Transition name="slide-fade">
          <div v-if="isProcessing" class="flex items-center space-x-3 bg-white/95 backdrop-blur-2xl rounded-2xl px-5 py-3 border border-blue-200/60 shadow-2xl">
            <div class="relative">
              <div class="animate-spin">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div class="absolute inset-0 animate-ping">
                <svg class="w-5 h-5 text-blue-400 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
            </div>
            <div>
              <span class="text-sm font-bold text-slate-800">Zpracovávám...</span>
              <div class="flex space-x-1 mt-0.5">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode: 'standard' | 'ai'
  isProcessing: boolean
  userRole?: string
  selectedStudent?: string | null
}

defineProps<Props>()

defineEmits<{
  'toggle-mode': []
}>()
</script>

<style scoped>
@import "tailwindcss" reference;

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-30px, 30px) rotate(-5deg);
  }
  66% {
    transform: translate(20px, -20px) rotate(5deg);
  }
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delayed {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-horizontal {
  0%, 100% {
    transform: translateX(0) translateY(-50%);
  }
  50% {
    transform: translateX(10px) translateY(-50%);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-shimmer-slide {
  animation: shimmer-slide 2s infinite;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 0.6s ease-out 0.2s both;
}

.animate-bounce-horizontal {
  animation: bounce-horizontal 2s ease-in-out infinite;
}

/* Transition animations */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>