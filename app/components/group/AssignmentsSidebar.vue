<template>
  <div class="w-80 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden h-full">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Úkoly
          </h3>
          <p class="text-xs text-gray-500">{{ completedCount }}/{{ goals.length }} splněno</p>
        </div>
      </div>
      
      <!-- Overall Progress Ring -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex-1">
          <div class="text-xs text-gray-600 mb-2">Celkový pokrok</div>
          <div class="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden">
            <div 
              class="h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
        </div>
        <div class="ml-4 text-right">
          <div class="text-lg font-bold text-emerald-600">{{ Math.round(overallProgress) }}%</div>
        </div>
      </div>
    </div>

    <!-- Goals List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <TransitionGroup name="goal" tag="div" class="space-y-3">
        <div
          v-for="(goal, index) in goals"
          :key="goal.id"
          class="group relative bg-white/80 rounded-2xl border border-gray-200/60 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300/50 hover:-translate-y-0.5"
        >
          <!-- Status stripe -->
          <div 
            :class="[
              'absolute left-0 top-0 w-1 h-full rounded-l-2xl transition-all duration-300',
              isGoalCompleted(goal) ? 'bg-emerald-500' : getProgressStripeColor(goal)
            ]"
          ></div>
          
          <div class="flex items-start space-x-3 pl-2">
            <!-- Goal Icon -->
            <div :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110',
              getGoalIconColor(goal)
            ]">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getGoalIcon(goal)" />
              </svg>
            </div>
            
            <!-- Goal Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors duration-200">
                  {{ goal.title }}
                </h4>
                <div :class="[
                  'px-2 py-0.5 rounded-full text-xs font-bold ml-2 flex-shrink-0',
                  isGoalCompleted(goal) 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600'
                ]">
                  {{ getGoalStatusText(goal) }}
                </div>
              </div>
              
              <!-- Progress for percentage goals -->
              <div v-if="goal.type === 'progress'" class="mb-2">
                <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{{ goal.current || 0 }}/{{ goal.target || 0 }} kroků</span>
                  <span class="font-medium">{{ goal.progress || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    :class="[
                      'h-1.5 rounded-full transition-all duration-700 ease-out',
                      getProgressBarColor(goal.progress || 0)
                    ]"
                    :style="{ width: `${goal.progress || 0}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- Boolean goal completion -->
              <div v-else class="flex items-center space-x-2">
                <div :class="[
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300',
                  goal.completed 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-gray-300 hover:border-blue-400'
                ]">
                  <svg v-if="goal.completed" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="text-xs text-gray-600">
                  {{ goal.completed ? 'Dokončeno' : 'Čeká na splnění' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Quick Stats Footer -->
    <div class="p-4 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-emerald-600">{{ completedCount }}</div>
          <div class="text-xs text-gray-500">Hotovo</div>
        </div>
        <div>
          <div class="text-lg font-bold text-blue-600">{{ inProgressCount }}</div>
          <div class="text-xs text-gray-500">V procesu</div>
        </div>
        <div>
          <div class="text-lg font-bold text-gray-600">{{ pendingCount }}</div>
          <div class="text-xs text-gray-500">Čeká</div>
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

// Computed properties
const completedCount = computed(() => {
  return props.goals.filter(goal => {
    if (goal.type === 'boolean') return goal.completed
    return (goal.progress || 0) >= 100
  }).length
})

const inProgressCount = computed(() => {
  return props.goals.filter(goal => {
    if (goal.type === 'boolean') return !goal.completed
    return (goal.progress || 0) > 0 && (goal.progress || 0) < 100
  }).length
})

const pendingCount = computed(() => {
  return props.goals.filter(goal => {
    if (goal.type === 'boolean') return !goal.completed
    return (goal.progress || 0) === 0
  }).length
})

// Helper functions
const isGoalCompleted = (goal: Goal): boolean => {
  if (goal.type === 'boolean') return goal.completed || false
  return (goal.progress || 0) >= 100
}

const getGoalStatusText = (goal: Goal): string => {
  if (goal.type === 'boolean') {
    return goal.completed ? 'Hotovo' : 'Čeká'
  }
  return `${goal.progress || 0}%`
}

const getProgressStripeColor = (goal: Goal): string => {
  const progress = goal.type === 'progress' ? (goal.progress || 0) : 0
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-blue-400'
  return 'bg-gray-400'
}

const getGoalIconColor = (goal: Goal): string => {
  if (isGoalCompleted(goal)) return 'bg-emerald-500'
  const progress = goal.type === 'progress' ? (goal.progress || 0) : 0
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-blue-400'
  return 'bg-gray-400'
}

const getProgressBarColor = (progress: number): string => {
  if (progress >= 100) return 'bg-emerald-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-blue-400'
  return 'bg-gray-400'
}

const getGoalIcon = (goal: Goal) => {
  // Return SVG path based on goal content
  if (goal.title.toLowerCase().includes('rozdíl') || goal.title.toLowerCase().includes('vysvětlí')) {
    return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 .5-.216.957-.547 1.334l-.001.001A8.661 8.661 0 0112 10a8.661 8.661 0 00-3.452 1.335zM8.228 9L12 13l3.772-4c.331.377.547.834.547 1.334 0 .5-.216.957-.547 1.334L12 16l-3.772-4.332c-.331-.377-.547-.834-.547-1.334 0-.5.216-.957.547-1.334z' // Comparison icon
  }
  if (goal.title.toLowerCase().includes('vyřeší') || goal.title.toLowerCase().includes('diskriminant')) {
    return 'M9 7h6m0 10v-3m-3-4h.01M9 17h6m-3-8v4' // Calculator icon  
  }
  if (goal.title.toLowerCase().includes('aplikuje') || goal.title.toLowerCase().includes('praktické')) {
    return 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m0 0H8m0 0H6a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h8a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-2 0V6' // Application/briefcase icon
  }
  return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Default target/check icon
}
</script>

<style scoped>
.goal-enter-active {
  transition: all 0.5s ease-out;
}
.goal-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.goal-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
