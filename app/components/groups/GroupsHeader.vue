<template>
  <div class="mb-12">
    <!-- Main Header Card -->
    <div class="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-3xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/40 overflow-hidden">
      <!--  Decorative Elements -->
      <div class="absolute inset-0">
        <!-- Multi-layer gradient overlays -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-indigo-400/5"></div>
        
        <!--  geometric decorations with animation -->
        <div class="absolute top-0 right-0 w-96 h-96 opacity-[0.08]">
          <div class="w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-3xl transform translate-x-20 -translate-y-10 animate-pulse"></div>
          <div class="w-28 h-28 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full blur-2xl transform translate-x-40 translate-y-6 animate-pulse delay-300"></div>
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-xl transform translate-x-24 translate-y-20 animate-pulse delay-700"></div>
        </div>
        
        <!--  linear motifs with gradients -->
        <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent"></div>
        <div class="absolute top-8 left-0 w-3/4 h-px bg-gradient-to-r from-blue-300/50 via-purple-300/50 to-transparent"></div>
        <div class="absolute top-16 left-1/4 w-1/2 h-px bg-gradient-to-r from-emerald-200/40 via-teal-200/40 to-transparent"></div>
        
        <!-- Mesh gradient overlay -->
        <div class="absolute inset-0 opacity-30" 
             style="background: radial-gradient(circle at 20% 80%, hsla(217,100%,75%,0.1) 0%, transparent 50%), 
                    radial-gradient(circle at 80% 20%, hsla(262,83%,70%,0.1) 0%, transparent 50%), 
                    radial-gradient(circle at 40% 40%, hsla(170,72%,66%,0.05) 0%, transparent 50%);">
        </div>
      </div>

      <div class="relative p-12 lg:p-16">
        <!--  Title Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div class="flex items-start space-x-8">
            <!--  Icon with multiple layers and animations -->
            <div class="relative group">
              <!-- Outer glow ring -->
              <div class="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 animate-pulse"></div>
              
              <!-- Main icon container -->
              <div class="relative w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                <!-- Inner gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                <!-- Animated shine effect -->
                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out"></div>
                
                <svg class="w-10 h-10 text-white relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              
              <!--  status indicator with animation -->
              <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-bounce">
                <div class="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
              </div>
              
              <!-- Floating particles effect -->
              <div class="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping delay-500"></div>
              <div class="absolute top-2 -right-2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-ping delay-1000"></div>
            </div>
            
            <!--  Typography Section -->
            <div class="space-y-4">
              <!-- Main title with  effects -->
              <div class="relative">
                <h1 class="text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight">
                  <!-- Primary text with multiple gradients -->
                  <span class="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 drop-shadow-sm">{{ headerTitle }}</span>
                </h1>
                <!-- Text shadow layer -->
                <div class="absolute inset-0 -z-10">
                  <h1 class="text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-blue-600/5 translate-x-1 translate-y-1">
                    {{ headerTitle }}
                  </h1>
                </div>
              </div>
              
              <!--  subtitle with border and background -->
              <div class="relative inline-block">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-purple-50/60 rounded-2xl blur-sm"></div>
                <p class="relative text-lg font-semibold text-gray-700 px-6 py-3 rounded-2xl bg-white/40">
                  {{ headerSubtitle }}
                </p>
              </div>
            
            </div>
          </div>

          <!--  Compact Stats with premium styling -->
          <div class="flex-shrink-0">
            <div class="grid grid-cols-3 gap-6">
              <!-- Total Groups Stat -->
              <div class="group relative transform transition-all duration-300 hover:scale-105">
                <!--  background with multiple layers -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-blue-100/40 rounded-2xl"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-2xl"></div>
                <div class="absolute inset-0 border border-blue-200/60 rounded-2xl shadow-lg"></div>
                
                <!-- Animated background icon -->
                <div class="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <svg class="w-full h-full text-blue-500/30 p-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                
                <div class="relative p-6 text-center">
                  <div class="text-3xl font-black bg-gradient-to-br from-blue-700 to-blue-900 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    {{ totalGroups }}
                  </div>
                  <div class="text-xs font-bold text-blue-700/80 uppercase tracking-widest">Skupin</div>
                </div>
              </div>

              <!-- Completed Groups Stat -->
              <div class="group relative transform transition-all duration-300 hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-2xl"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl"></div>
                <div class="absolute inset-0 border border-emerald-200/60 rounded-2xl shadow-lg"></div>
                
                <div class="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <svg class="w-full h-full text-emerald-500/30 p-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                
                <div class="relative p-6 text-center">
                  <div class="text-3xl font-black bg-gradient-to-br from-emerald-700 to-emerald-900 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    {{ completedGroups }}
                  </div>
                  <div class="text-xs font-bold text-emerald-700/80 uppercase tracking-widest">Hotovo</div>
                </div>
              </div>

              <!-- Average Progress Stat -->
              <div class="group relative transform transition-all duration-300 hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-2xl"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent rounded-2xl"></div>
                <div class="absolute inset-0 border border-amber-200/60 rounded-2xl shadow-lg"></div>
                
                <div class="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <svg class="w-full h-full text-amber-500/30 p-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                
                <div class="relative p-6 text-center">
                  <div class="text-3xl font-black bg-gradient-to-br from-amber-700 to-amber-900 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    {{ averageProgress }}%
                  </div>
                  <div class="text-xs font-bold text-amber-700/80 uppercase tracking-widest">Průměr</div>
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
  totalGroups: number
  completedGroups: number
  averageProgress: number
  lastUpdate: string
  userRole?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{}>()  // No emits needed anymore

const headerTitle = computed(() => {
  return props.userRole === 'teacher' ? 'Moje Třídy' : 'Moje Skupiny'
})

const headerSubtitle = computed(() => {
  return props.userRole === 'teacher' 
    ? 'Spravujte studijní skupiny a sledujte pokrok studentů'
    : 'Sledujte pokrok ve vašich studijních skupinách'
})
</script>