<template>
  <div class="relative animate-slide-up">
    <!-- Enhanced background with floating elements -->
    <div class="relative bg-gradient-to-br from-blue-50/90 via-purple-50/70 to-blue-50/90 border border-blue-200/70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
      <!-- Animated background particles -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-4 right-8 w-3 h-3 bg-blue-400/20 rounded-full animate-float"></div>
        <div class="absolute top-12 right-16 w-2 h-2 bg-purple-400/30 rounded-full animate-float-delayed"></div>
        <div class="absolute bottom-8 right-12 w-4 h-4 bg-blue-400/15 rounded-full animate-float-slow"></div>
        <div class="absolute bottom-16 left-8 w-2 h-2 bg-cyan-400/25 rounded-full animate-float-delayed"></div>
        
        <!-- Subtle gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
      </div>
      
      <div class="relative flex items-start space-x-6">
        <!-- Enhanced welcome icon with multiple animations -->
        <div class="relative flex-shrink-0">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <!-- Rotating glow effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-transparent to-purple-400/30 animate-spin-slow opacity-75"></div>
            
            <!-- Shimmer effect -->
            <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1500 ease-out"></div>
            
            <svg class="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            
            <!-- Floating sparkles -->
            <div class="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div class="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style="animation-delay: 0.8s"></div>
          </div>
        </div>
        
        <div class="flex-1 space-y-4">
          <!-- Enhanced header with typing animation -->
          <div class="flex items-center space-x-3 mb-3">
            <div :class="[
              'px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg',
              mode === 'ai' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
            ]">
              {{ mode === 'ai' ? '🤖 AI Učitel' : '📚 Studijní asistent' }}
            </div>
            <div class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 animate-pulse">
              Online
            </div>
          </div>
          
          <!-- Welcome message with staggered animation -->
          <div class="space-y-4">
            <div class="animate-fade-in-delayed-1">
              <h3 class="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <span>Vítejte ve skupině!</span>
                <span class="text-2xl animate-wave">🎯</span>
              </h3>
            </div>
            
            <!-- Goal display card -->
            <div class="animate-fade-in-delayed-2 bg-white/70 rounded-2xl p-5 border border-blue-200/50 shadow-lg relative overflow-hidden">
              <!-- Card background pattern -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
              
              <div class="relative">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-emerald-700 mb-1 uppercase tracking-wide">Váš studijní cíl</div>
                    <div class="text-gray-800 font-medium leading-relaxed">{{ groupDescription }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Assistant description -->
            <div class="animate-fade-in-delayed-3 text-gray-700 leading-relaxed">
              <div :class="[
                'p-4 rounded-2xl border shadow-lg',
                mode === 'ai' 
                  ? 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/60' 
                  : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-200/60'
              ]">
                <div class="flex items-start space-x-3">
                  <div :class="[
                    'w-6 h-6 rounded-lg flex items-center justify-center',
                    mode === 'ai' ? 'bg-purple-500' : 'bg-blue-500'
                  ]">
                    <span class="text-white text-sm">{{ mode === 'ai' ? '🤖' : '📚' }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm">
                      {{ mode === 'ai' 
                        ? 'Jsem pokročilý AI učitel matematiky. Pomohu vám porozumět složitým konceptům, krok za krokem vysvětlím každý problém a přizpůsobím se vašemu tempu učení!'
                        : 'Jsem zde, abych vám pomohl dosáhnout vašich studijních cílů. Kladte otázky, žádejte o vysvětlení a společně projdeme každý krok!'
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Call to action -->
            <div class="animate-fade-in-delayed-4">
              <div class="flex items-center space-x-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50 shadow-lg">
                <div class="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-md">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm text-gray-600">
                    💬 <strong>Začněte konverzaci</strong> - napište zprávu do pole níže
                  </div>
                </div>
                <div class="animate-bounce">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                </div>
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
  groupDescription: string
}

defineProps<Props>()
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
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

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes fade-in-delayed-1 {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-delayed-2 {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-delayed-3 {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-delayed-4 {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3.5s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-wave {
  animation: wave 2s ease-in-out infinite;
}

.animate-fade-in-delayed-1 {
  animation: fade-in-delayed-1 0.6s ease-out 0.2s both;
}

.animate-fade-in-delayed-2 {
  animation: fade-in-delayed-2 0.6s ease-out 0.4s both;
}

.animate-fade-in-delayed-3 {
  animation: fade-in-delayed-3 0.6s ease-out 0.6s both;
}

.animate-fade-in-delayed-4 {
  animation: fade-in-delayed-4 0.6s ease-out 0.8s both;
}
</style>
