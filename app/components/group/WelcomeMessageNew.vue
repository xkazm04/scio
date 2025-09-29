<template>
  <div class="text-center py-12 animate-fade-in-up">
    <!-- Premium welcome card -->
    <div class="relative max-w-3xl mx-auto">
      <div class="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-3xl rounded-3xl p-10 border-2 border-white/70 shadow-2xl overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <!-- Premium top accent -->
        <div class="absolute top-0 left-12 right-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div class="relative">
          <!-- Welcome icon with animation -->
          <div class="relative inline-block mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6 mx-auto relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-5xl relative z-10">
                {{ mode === 'ai' ? '🤖' : '👋' }}
              </span>
            </div>
            <!-- Floating particles -->
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-xl"></div>
            <div class="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce shadow-xl" style="animation-delay: 0.2s"></div>
          </div>
          
          <!-- Main welcome message -->
          <h2 class="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            {{ mode === 'ai' ? 'Vítejte v AI Učiteli!' : 'Začněte svou studijní cestu!' }}
          </h2>
          
          <p class="text-lg text-slate-600 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ mode === 'ai' 
              ? 'Váš osobní AI asistent je připraven vám pomoci s jakýmkoli matematickým problémem 24/7' 
              : 'Jsme tu, abychom vám pomohli dosáhnout vašich studijních cílů společně' 
            }}
          </p>
          
          <!-- Premium goal description card -->
          <div class="relative mb-8 animate-slide-in" style="animation-delay: 0.2s">
            <div class="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200/60 shadow-xl overflow-hidden">
              <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                
                <div class="flex-1 text-left">
                  <div class="text-sm font-black text-emerald-700 mb-2 uppercase tracking-wider flex items-center space-x-2">
                    <span>Váš studijní cíl</span>
                    <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <p class="text-slate-800 leading-relaxed font-medium text-base">
                    {{ groupDescription || 'Dokončete všechny úkoly a dosáhněte svých studijních cílů!' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Premium call to action with features -->
          <div class="space-y-4 animate-slide-in" style="animation-delay: 0.4s">
            <!-- Main CTA -->
            <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200/60 shadow-xl">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-gentle">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                
                <div class="flex-1 text-left">
                  <div class="text-base font-black text-slate-900 mb-1">
                    Začněte konverzaci
                  </div>
                  <div class="text-sm text-slate-600 font-medium">
                    {{ mode === 'ai' 
                      ? 'Položte libovolnou otázku nebo požádejte o vysvětlení konceptu' 
                      : 'Sdělte, na čem byste chtěli dnes pracovat nebo co vás zajímá' 
                    }}
                  </div>
                </div>
                
                <div class="text-blue-500">
                  <svg class="w-6 h-6 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Premium feature cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="group p-4 bg-white/80 backdrop-blur-2xl rounded-xl border-2 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span class="text-xl">💡</span>
                </div>
                <div class="text-sm font-black text-slate-900 mb-1">Postupné vysvětlení</div>
                <div class="text-xs text-slate-600 font-medium">Každý krok podrobně rozebrán</div>
              </div>
              
              <div class="group p-4 bg-white/80 backdrop-blur-2xl rounded-xl border-2 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span class="text-xl">🎯</span>
                </div>
                <div class="text-sm font-black text-slate-900 mb-1">Sledování pokroku</div>
                <div class="text-xs text-slate-600 font-medium">Vidíte svůj postup v reálném čase</div>
              </div>
              
              <div class="group p-4 bg-white/80 backdrop-blur-2xl rounded-xl border-2 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                  <span class="text-xl">⚡</span>
                </div>
                <div class="text-sm font-black text-slate-900 mb-1">Okamžitá pomoc</div>
                <div class="text-xs text-slate-600 font-medium">Dostupná kdykoliv potřebujete</div>
              </div>
            </div>
          </div>
          
          <!-- Premium tip -->
          <div class="mt-8 flex items-center justify-center space-x-3 text-sm text-slate-500 font-medium animate-fade-in" style="animation-delay: 0.6s">
            <svg class="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span><strong class="text-slate-700">Tip:</strong> Stiskněte <kbd class="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-black border border-slate-300 shadow-sm">Enter</kbd> pro rychlé odeslání zprávy</span>
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

<style scoped>
@import "tailwindcss" reference;

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}

@keyframes pulse-gentle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounce-horizontal {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-slide-in {
  animation: slide-in 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
  animation-fill-mode: both;
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-pulse-gentle {
  animation: pulse-gentle 3s ease-in-out infinite;
}

.animate-bounce-horizontal {
  animation: bounce-horizontal 2s ease-in-out infinite;
}
</style>