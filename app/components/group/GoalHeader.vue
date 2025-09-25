<template>
  <div class="mb-8 relative">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden rounded-3xl">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20"></div>
    </div>

    <div class="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-8 overflow-hidden">
      <!-- Progress Ring Animation -->
      <div class="absolute -top-20 -right-20 w-40 h-40 opacity-10">
        <svg class="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            stroke-width="2"
            fill="none"
            stroke-dasharray="70 30"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6"/>
              <stop offset="100%" style="stop-color:#8B5CF6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="relative flex items-center justify-between">
        <!-- Goal Info -->
        <div class="flex items-center space-x-6">
          <!-- Animated Goal Icon -->
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group">
              <!-- Shimmer Effect -->
              <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out"></div>
              
              <svg class="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              
              <!-- Floating particles -->
              <div class="absolute inset-0">
                <div class="w-1 h-1 bg-white/40 rounded-full absolute top-2 right-3 animate-pulse"></div>
                <div class="w-1 h-1 bg-white/40 rounded-full absolute bottom-3 left-2 animate-pulse" style="animation-delay: 0.5s"></div>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Aktuální cíl
              </h2>
              <div class="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200/50">
                Aktivní
              </div>
            </div>
            
            <p class="text-gray-700 text-lg font-medium leading-relaxed">
              {{ currentGoal?.description || 'Žádný aktivní cíl' }}
            </p>
          </div>
        </div>

        <!-- Progress Visualization -->
        <div class="flex items-center space-x-4">
          <!-- Circular Progress -->
          <div class="relative w-24 h-24">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgb(229 231 235)"
                stroke-width="8"
                fill="none"
              />
              <!-- Progress circle -->
              <circle
                cx="50"
                cy="50"
                r="40"
                :stroke="getProgressColor(overallProgress)"
                stroke-width="8"
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                class="transition-all duration-1000 ease-out"
                stroke-linecap="round"
              />
            </svg>
            
            <!-- Progress Text -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-lg font-bold text-gray-800">
                {{ Math.round(overallProgress) }}%
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ completedGoals }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">z {{ totalGoals }} cílů</div>
          </div>
        </div>
      </div>

      <!-- Goal Progress Indicators -->
      <div class="mt-6 flex items-center space-x-2">
        <div 
          v-for="(goal, index) in goals" 
          :key="goal.id"
          class="flex-1 h-2 rounded-full overflow-hidden bg-gray-200 relative group cursor-pointer"
          @mouseenter="hoveredGoal = goal"
          @mouseleave="hoveredGoal = null"
        >
          <div 
            :class="[
              'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
              getGoalProgressColor(goal)
            ]"
            :style="{ width: `${getGoalProgress(goal)}%` }"
          >
            <!-- Shimmer effect on progress bars -->
            <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
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
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'

interface Props {
  goals: Goal[]
  overallProgress: number
}

const props = defineProps<Props>()

const hoveredGoal = ref<Goal | null>(null)

// Computed properties
const currentGoal = computed(() => {
  // Find the first incomplete goal or the most recently active one
  return props.goals.find(g => !g.completed && g.type === 'progress') || 
         props.goals.find(g => !g.completed) ||
         props.goals[0]
})

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
const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'url(#emerald-gradient)'
  if (progress >= 60) return 'url(#blue-gradient)'
  if (progress >= 40) return 'url(#indigo-gradient)'
  if (progress >= 20) return 'url(#purple-gradient)'
  return 'url(#gray-gradient)'
}

const getGoalProgress = (goal: Goal): number => {
  if (goal.type === 'boolean') return goal.completed ? 100 : 0
  return goal.progress || 0
}

const getGoalProgressColor = (goal: Goal): string => {
  const progress = getGoalProgress(goal)
  if (progress === 100) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  if (progress >= 75) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (progress >= 25) return 'bg-gradient-to-r from-purple-500 to-purple-600'
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
