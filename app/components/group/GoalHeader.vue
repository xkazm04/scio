<template>
  <div class="relative">
    <!-- Subtle linear background pattern -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/60"></div>
      <!-- Linear pattern overlay -->
      <div class="absolute inset-0" style="background-image: linear-gradient(45deg, transparent 45%, rgba(59, 130, 246, 0.03) 50%, transparent 55%); background-size: 20px 20px;"></div>
    </div>

    <div class="relative rounded-2xl border border-white/60 shadow-xl overflow-hidden">
      <!-- Group Header Section -->
      <div class="px-3 py-1 border-b border-gray-100/60">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/groups" class="p-2 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 hover:bg-white hover:shadow-md transition-all duration-200 group">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                {{ groupData?.name }}
              </h1>
              <p class="text-gray-600 text-sm mt-1">{{ groupData?.description }}</p>
            </div>
          </div>
          
          <!-- Status indicators with progress stats -->
          <div class="flex items-center space-x-4">
            <!-- Status badges -->
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-xl px-3 py-1.5 border border-emerald-200/60 shadow-sm">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-xs font-medium text-gray-700">Aktivní</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-xl px-3 py-1.5 border border-blue-200/60 shadow-sm">
                <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                <span class="text-xs font-medium text-gray-700">{{ groupData?.memberCount }} členů</span>
              </div>
            </div>

            <!-- Progress stats -->
            <div class="flex items-center space-x-6">
              <!-- Circular progress -->
              <div class="relative w-16 h-16">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="35"
                    stroke="rgb(229 231 235)"
                    stroke-width="6"
                    fill="none"
                  />
                  <circle
                    cx="50" cy="50" r="35"
                    :stroke="getProgressColor(overallProgress)"
                    stroke-width="6"
                    fill="none"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    class="transition-all duration-1000 ease-out"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-bold text-gray-800">{{ Math.round(overallProgress) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress indicators -->
      <div class="px-6 py-4">
        <div class="flex items-center space-x-2">
          <div 
            v-for="(goal, index) in goals" 
            :key="goal.id"
            class="flex-1 relative group cursor-pointer"
            @mouseenter="hoveredGoal = goal"
            @mouseleave="hoveredGoal = null"
          >
            <!-- Progress bar background -->
            <div class="h-3 rounded-full bg-gray-200/60 overflow-hidden border border-gray-300/40">
              <div 
                :class="[
                  'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
                  getGoalProgressColor(goal)
                ]"
                :style="{ width: `${getGoalProgress(goal)}%` }"
              >
                <!-- Subtle shimmer effect -->
                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000"></div>
              </div>
            </div>
            
            <!-- Assignment number -->
            <div class="absolute -top-1 left-1 w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-gray-600">{{ index + 1 }}</span>
            </div>
            
            <!-- Goal tooltip -->
            <div 
              v-if="hoveredGoal?.id === goal.id"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-10 animate-fade-in"
            >
              {{ goal.title }}
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
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
  memberCount: number
}

interface Props {
  goals: Goal[]
  overallProgress: number
  groupData: GroupData
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
const circumference = 2 * Math.PI * 35 // r = 35
const strokeDashoffset = computed(() => {
  const progress = props.overallProgress / 100
  return circumference - (progress * circumference)
})

// Helper functions
const getProgressColor = (progress: number): string => {
  if (progress >= 80) return '#10b981' // emerald-500
  if (progress >= 60) return '#3b82f6' // blue-500
  if (progress >= 40) return '#6366f1' // indigo-500
  if (progress >= 20) return '#8b5cf6' // violet-500
  return '#9ca3af' // gray-400
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
  return 'bg-gradient-to-r from-gray-400 to-gray-500'
}
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* Gradient definitions for SVG */
svg defs {
  background: none;
}
</style>
