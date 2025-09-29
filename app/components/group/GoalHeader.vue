<template>
  <div class="relative">
    <!-- Premium animated background -->
    <div class="absolute inset-0 overflow-hidden rounded-3xl">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/60 to-indigo-50/80 backdrop-blur-3xl"></div>
      <!-- Animated floating orbs -->
      <div class="absolute top-10 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-10 left-20 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-float-delayed"></div>
    </div>

    <div class="relative rounded-3xl border-2 border-white/70 shadow-2xl overflow-hidden backdrop-blur-xl">
      <!-- Premium Group Header Section -->
      <div class="px-6 py-5 border-b border-white/60 bg-gradient-to-r from-white/40 via-white/30 to-white/40">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-5">
            <!-- Back button with premium styling -->
            <NuxtLink to="/groups" class="group relative p-3 bg-white/90 backdrop-blur-2xl rounded-2xl border-2 border-white/60 hover:border-blue-300 hover:bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5">
              <svg class="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            
            <div>
              <h1 class="text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2 tracking-tight">
                {{ groupData?.name || 'Studijní skupina' }}
              </h1>
              <p class="text-slate-600 text-base font-medium leading-relaxed max-w-2xl">
                {{ groupData?.description || 'Popis skupiny není k dispozici' }}
              </p>
            </div>
          </div>
          
          <!-- Enhanced status indicators -->
          <div class="flex items-center space-x-6">
            <!-- Status badges with premium design -->
            <div class="flex items-center space-x-3">
              <!-- Active status -->
              <div class="relative group/badge">
                <div class="flex items-center space-x-2 bg-white/95 backdrop-blur-2xl rounded-2xl px-5 py-2.5 border-2 border-emerald-200/80 shadow-xl transform transition-all duration-300 hover:scale-105">
                  <div class="relative">
                    <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div class="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  </div>
                  <span class="text-sm font-black text-slate-800">Aktivní</span>
                </div>
              </div>
              
              <!-- Members count -->
              <div class="relative group/badge">
                <div class="flex items-center space-x-2 bg-white/95 backdrop-blur-2xl rounded-2xl px-5 py-2.5 border-2 border-blue-200/80 shadow-xl transform transition-all duration-300 hover:scale-105">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-black text-slate-800">{{ groupData?.memberCount || 0 }} členů</span>
                </div>
              </div>
            </div>

            <!-- Premium circular progress -->
            <div class="relative">
              <div class="relative w-24 h-24 group">
                <svg class="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 100 100">
                  <!-- Background circle -->
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="rgb(226 232 240)"
                    stroke-width="8"
                    fill="none"
                  />
                  <!-- Progress circle with gradient -->
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" :style="`stop-color: ${getProgressGradientStart(overallProgress)}`" />
                      <stop offset="100%" :style="`stop-color: ${getProgressGradientEnd(overallProgress)}`" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="url(#progressGradient)"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    class="transition-all duration-1000 ease-out"
                    stroke-linecap="round"
                  />
                </svg>
                
                <!-- Center content with animation -->
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                    {{ Math.round(overallProgress) }}%
                  </span>
                  <span class="text-xs font-bold text-slate-500 mt-0.5">pokrok</span>
                </div>
                
                <!-- Pulsing glow effect -->
                <div 
                  class="absolute inset-0 rounded-full opacity-20 blur-2xl transition-all duration-1000"
                  :class="overallProgress >= 80 ? 'bg-emerald-400' : overallProgress >= 50 ? 'bg-blue-400' : 'bg-purple-400'"
                  :style="`transform: scale(${0.8 + (overallProgress / 200)})`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium progress indicators -->
      <div class="px-8 py-6 bg-gradient-to-r from-white/30 via-white/20 to-white/30">
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <span class="text-sm font-black text-slate-700 uppercase tracking-wider">Studijní cíle</span>
          <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-black rounded-full">
            {{ completedGoals }} / {{ totalGoals }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            v-for="(goal, index) in goals" 
            :key="goal.id"
            class="group/goal relative"
            @mouseenter="hoveredGoal = goal"
            @mouseleave="hoveredGoal = null"
          >
            <!-- Premium goal card -->
            <div class="relative p-4 bg-white/90 backdrop-blur-2xl rounded-2xl border-2 border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Gradient accent -->
              <div 
                :class="[
                  'absolute top-0 left-0 right-0 h-1.5 transition-all duration-300',
                  getGoalProgressColor(goal)
                ]"
              ></div>
              
              <!-- Goal number badge -->
              <div class="absolute -top-2 -left-2">
                <div class="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl border-2 border-white">
                  {{ index + 1 }}
                </div>
              </div>
              
              <!-- Goal content -->
              <div class="mt-2">
                <h4 class="font-black text-slate-900 text-sm mb-2 line-clamp-1">{{ goal.title }}</h4>
                
                <!-- Progress bar -->
                <div class="relative h-3 rounded-full bg-slate-200/80 overflow-hidden shadow-inner">
                  <div 
                    :class="[
                      'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
                      getGoalProgressColor(goal)
                    ]"
                    :style="{ width: `${getGoalProgress(goal)}%` }"
                  >
                    <!-- Shimmer effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                <!-- Progress percentage -->
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs font-bold text-slate-600">{{ getGoalProgress(goal) }}%</span>
                  <span 
                    v-if="getGoalProgress(goal) === 100"
                    class="text-xs font-black text-emerald-600 flex items-center space-x-1"
                  >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span>Hotovo!</span>
                  </span>
                </div>
              </div>
              
              <!-- Hover tooltip -->
              <Transition name="tooltip">
                <div 
                  v-if="hoveredGoal?.id === goal.id"
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-slate-900 text-white text-sm rounded-xl shadow-2xl whitespace-normal w-64 z-10 font-medium"
                >
                  <div class="font-black mb-1">{{ goal.title }}</div>
                  <div class="text-xs text-slate-300">{{ goal.description }}</div>
                  <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-slate-900"></div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'

interface GroupData {
  id: string
  name: string
  description: string
  memberCount?: number
  teacherId?: string
  teacher?: {
    id: string
    fullName: string
    email: string
  }
}

interface Props {
  goals: Goal[]
  overallProgress: number
  groupData?: GroupData
}

const props = defineProps<Props>()

const hoveredGoal = ref<Goal | null>(null)

// Computed properties
const completedGoals = computed(() => {
  return props.goals.filter(goal => {
    if (goal.type === 'boolean') return goal.completed
    return goal.progress === 100
  }).length
})

const totalGoals = computed(() => props.goals.length)

// Progress circle calculations
const circumference = 2 * Math.PI * 40 // r = 40
const strokeDashoffset = computed(() => {
  const progress = props.overallProgress / 100
  return circumference - (progress * circumference)
})

// Helper functions
const getProgressGradientStart = (progress: number): string => {
  if (progress >= 80) return '#10b981' // emerald-500
  if (progress >= 60) return '#3b82f6' // blue-500
  if (progress >= 40) return '#6366f1' // indigo-500
  return '#8b5cf6' // violet-500
}

const getProgressGradientEnd = (progress: number): string => {
  if (progress >= 80) return '#059669' // emerald-600
  if (progress >= 60) return '#2563eb' // blue-600
  if (progress >= 40) return '#4f46e5' // indigo-600
  return '#7c3aed' // violet-600
}

const getGoalProgress = (goal: Goal): number => {
  if (goal.type === 'boolean') return goal.completed ? 100 : 0
  return goal.progress || 0
}

const getGoalProgressColor = (goal: Goal): string => {
  const progress = getGoalProgress(goal)
  if (progress === 100) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  if (progress >= 75) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (progress >= 50) return 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  if (progress >= 25) return 'bg-gradient-to-r from-violet-500 to-violet-600'
  return 'bg-gradient-to-r from-slate-400 to-slate-500'
}
</script>

<style scoped>
@import "tailwindcss" reference;

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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Tooltip animation */
.tooltip-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tooltip-leave-active {
  transition: all 0.2s ease;
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px) scale(0.9);
}
.tooltip-enter-to, .tooltip-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
</style>
