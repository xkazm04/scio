<template>
  <div class="mb-12">
    <!-- Main Header Card -->
    <div class="relative bg-gradient-to-br backdrop-blur-3xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
      <!--  Decorative Elements -->
      <div class="absolute inset-0">
        <!-- Multi-layer gradient overlays -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-indigo-400/5"></div>
      </div>

      <div class="relative p-2">
        <!--  Title Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start space-x-8">
            <!--  Icon with multiple layers and animations -->
            <div class="relative group pl-4">
              <!-- Main icon container -->
              <div class="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-slate-700 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30 overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
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
                <h1 class="text-5xl lg:text-6xl xl:text-5xl font-black leading-none tracking-tight">
                  <!-- Primary text with multiple gradients -->
                  <span class="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 drop-shadow-sm">Moje skupiny</span>
                </h1>
              </div>
              
              <!--  subtitle with border and background -->
              <div class="relative inline-block">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-purple-50/60 rounded-2xl blur-sm"></div>
                <p class="relative text-lg font-semibold text-gray-700 rounded-2xl bg-white/40">
                  {{ headerSubtitle }}
                </p>
              </div>
            
            </div>
          </div>

          <!--  Compact Stats with premium styling -->
          <div class="flex-shrink-0">
            <div class="absolute top-0 right-0 gap-6 flex flex-row">
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
  userRole?: string
}

const props = defineProps<Props>()

const headerSubtitle = computed(() => {
  return props.userRole === 'teacher' 
    ? 'Spravujte studijní skupiny a sledujte pokrok studentů'
    : 'Sledujte pokrok ve vašich studijních skupinách'
})
</script>