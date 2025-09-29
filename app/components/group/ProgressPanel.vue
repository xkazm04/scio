<template>
  <div class="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden h-full relative">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-lg animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <div class="relative p-6 h-full flex flex-col">
      <!-- Header with floating animation -->
      <div class="mb-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group">
              <!-- Pulse effect -->
              <div class="absolute inset-0 bg-emerald-500/20 rounded-2xl animate-ping"></div>
              <svg class="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Váš pokrok
            </h3>
            <p class="text-sm text-gray-500">{{ completedCount }} z {{ totalCount }} cílů splněno</p>
          </div>
        </div>
        
        <!-- Overall progress with animated ring -->
        <div class="relative bg-gradient-to-r from-gray-50/80 to-white/60 rounded-2xl p-5 border border-gray-100/60 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-gray-700">Celkový pokrok</span>
                <span class="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {{ Math.round(overallProgress) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200/80 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  class="h-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  :style="{ width: `${overallProgress}%` }"
                >
                  <!-- Shimmer effect -->
                  <div class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
            
            <!-- Circular indicator -->
            <div class="ml-4 relative w-16 h-16">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" stroke="rgb(229 231 235)" stroke-width="8" fill="none"/>
                <circle
                  cx="50" cy="50" r="35"
                  :stroke="overallProgress >= 80 ? 'rgb(16 185 129)' : overallProgress >= 50 ? 'rgb(59 130 246)' : 'rgb(168 85 247)'"
                  stroke-width="8" fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="strokeOffset"
                  class="transition-all duration-1000 ease-out"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-gray-700">{{ Math.round(overallProgress) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Goals List with  cards -->
      <div class="flex-1 overflow-y-auto">
        <h4 class="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 flex items-center">
          <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-2"></div>
          Studijní cíle
        </h4>
        
        <TransitionGroup name="goal" tag="div" class="space-y-3">
          <div
            v-for="(goal, index) in goals"
            :key="goal.id"
            :style="{ '--delay': `${index * 100}ms` }"
            class="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 transition-all duration-300 hover:shadow-xl hover:border-blue-300/50 hover:-translate-y-1 cursor-pointer"
          >
            <!-- Goal card background pattern -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30"></div>
            </div>
            
            <!-- Progress indicator stripe -->
            <div 
              :class="[
                'absolute left-0 top-0 w-1 h-full transition-all duration-300',
                getGoalIndicatorColor(goal)
              ]"
            ></div>
            
            <div class="relative p-4">
              <div class="flex items-start space-x-4">
                <!--  goal icon -->
                <div class="relative flex-shrink-0">
                  <div :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110',
                    getGoalIconColor(goal)
                  ]">
                    <component :is="getGoalIcon(goal)" class="w-6 h-6 text-white" />
                    
                    <!-- Status indicator -->
                    <div :class="[
                      'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm',
                      isGoalCompleted(goal) ? 'bg-emerald-500' : 'bg-gray-300'
                    ]">
                      <svg v-if="isGoalCompleted(goal)" class="w-3 h-3 text-white absolute top-0 left-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Goal content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-2">
                    <h5 class="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors duration-200">
                      {{ goal.title }}
                    </h5>
                    <div :class="[
                      'px-2 py-1 rounded-full text-xs font-bold',
                      isGoalCompleted(goal) 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    ]">
                      {{ goal.type === 'progress' ? `${goal.progress || 0}%` : (goal.completed ? 'Hotovo' : 'Čekající') }}
                    </div>
                  </div>
                  
                  <p class="text-xs text-gray-600 leading-relaxed">{{ goal.description }}</p>
                  
                  <!--  progress for percentage goals -->
                  <div v-if="goal.type === 'progress'" class="mt-3">
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{{ goal.current || 0 }} / {{ goal.target || 0 }} kroků</span>
                      <span class="font-medium">{{ goal.progress || 0 }}%</span>
                    </div>
                    <div class="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden">
                      <div 
                        :class="[
                          'h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden',
                          getProgressBarColor(goal.progress || 0)
                        ]"
                        :style="{ width: `${goal.progress || 0}%` }"
                      >
                        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
        
        <!-- Add Goal Button (only for group creators/teachers) -->
        <div 
          v-if="canAddGoals"
          @click="showAddGoalModal = true"
          class="group relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl border-2 border-dashed border-blue-300/60 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer mt-4"
        >
          <div class="relative p-6 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <h4 class="font-bold text-gray-800 text-sm mb-1">Přidat úkol</h4>
            <p class="text-xs text-gray-600">Vytvořte nový studijní cíl</p>
          </div>
        </div>
      </div>
      
      <!-- Add Goal Modal -->
      <Modal 
        v-model="showAddGoalModal" 
        title="Přidat nový studijní cíl" 
        subtitle="Definujte nový úkol pro studenty"
        size="lg"
      >
        <AddGoalForm 
          @goal-added="handleGoalAdded"
          @cancel="showAddGoalModal = false"
        />
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'
import Modal from '~/components/ui/Modal.vue'
import AddGoalForm from '~/components/group/AddGoalForm.vue'

interface Props {
  goals: Goal[]
  groupData?: any
  userRole?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'goal-added': [goal: Goal]
}>()

const currentTipIndex = ref(0)
const showAddGoalModal = ref(false)

// Check if user can add goals (group creator/teacher)
const canAddGoals = computed(() => {
  const { getCurrentUserId } = useAuth()
  const currentUserId = getCurrentUserId()
  
  console.log('🔍 Checking canAddGoals:', {
    userRole: props.userRole,
    hasGroupData: !!props.groupData,
    teacherId: props.groupData?.teacherId,
    currentUserId: currentUserId,
    isTeacher: props.userRole === 'teacher',
    isGroupCreator: currentUserId === props.groupData?.teacherId
  })
  
  return props.userRole === 'teacher' && 
         !!props.groupData?.teacherId && 
         currentUserId === props.groupData?.teacherId
})

// Computed properties
const overallProgress = computed(() => {
  let totalScore = 0
  let maxScore = 0

  props.goals.forEach(goal => {
    if (goal.type === 'boolean') {
      maxScore += 100
      totalScore += goal.completed ? 100 : 0
    } else if (goal.type === 'progress') {
      maxScore += 100
      totalScore += goal.progress || 0
    }
  })

  return maxScore > 0 ? (totalScore / maxScore) * 100 : 0
})

const completedCount = computed(() => {
  return props.goals.filter(goal => {
    if (goal.type === 'boolean') return goal.completed
    return (goal.progress || 0) >= 100
  }).length
})

const totalCount = computed(() => props.goals.length)

// Circular progress calculations
const circumference = 2 * Math.PI * 35
const strokeOffset = computed(() => {
  const progress = overallProgress.value / 100
  return circumference - (progress * circumference)
})

// Tips system
const tips = [
  'Pokud se zaseknete, zkuste položit konkrétní otázku asistentovi. Čím přesnější otázka, tím lepší pomoc dostanete!',
  'Při řešení rovnic si vždy nejprve zapište, co víte a co hledáte.',
  'Nakreslete si graf nebo schéma - vizualizace často pomáhá pochopit problém.',
  'Nebojte se dělat chyby - jsou součástí učení. Důležité je z nich poučit se.',
  'Procvičte si podobné příklady - opakování je matka moudrosti.',
  'AI učitel vám může vysvětlit každý krok podrobněji - stačí se zeptat!'
]

const currentTip = computed(() => tips[currentTipIndex.value])

const rotateTip = () => {
  currentTipIndex.value = (currentTipIndex.value + 1) % tips.length
}

const handleGoalAdded = (newGoal: Goal) => {
  showAddGoalModal.value = false
  emit('goal-added', newGoal)
}

// Helper functions
const isGoalCompleted = (goal: Goal): boolean => {
  if (goal.type === 'boolean') return goal.completed || false
  return (goal.progress || 0) >= 100
}

const getGoalIndicatorColor = (goal: Goal): string => {
  if (isGoalCompleted(goal)) return 'bg-gradient-to-b from-emerald-500 to-emerald-600'
  const progress = goal.type === 'progress' ? (goal.progress || 0) : 0
  if (progress >= 75) return 'bg-gradient-to-b from-blue-500 to-blue-600'
  if (progress >= 50) return 'bg-gradient-to-b from-blue-500 to-blue-600'
  if (progress >= 25) return 'bg-gradient-to-b from-purple-500 to-purple-600'
  return 'bg-gradient-to-b from-gray-400 to-gray-500'
}

const getGoalIconColor = (goal: Goal): string => {
  if (isGoalCompleted(goal)) return 'bg-gradient-to-br from-emerald-500 to-emerald-600'
  const progress = goal.type === 'progress' ? (goal.progress || 0) : 0
  if (progress >= 75) return 'bg-gradient-to-br from-blue-500 to-blue-600'
  if (progress >= 50) return 'bg-gradient-to-br from-blue-500 to-blue-600'
  if (progress >= 25) return 'bg-gradient-to-br from-purple-500 to-purple-600'
  return 'bg-gradient-to-br from-gray-400 to-gray-500'
}

const getProgressBarColor = (progress: number): string => {
  if (progress >= 100) return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  if (progress >= 75) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600'
  if (progress >= 25) return 'bg-gradient-to-r from-purple-500 to-purple-600'
  return 'bg-gradient-to-r from-gray-400 to-gray-500'
}

const getGoalIcon = (goal: Goal) => {
  // Return different icons based on goal type/content
  if (goal.title.toLowerCase().includes('rozdíl')) {
    return 'svg' // We'll use a comparison icon
  }
  if (goal.title.toLowerCase().includes('diskriminant') || goal.title.toLowerCase().includes('rovnice')) {
    return 'svg' // Calculator icon
  }
  if (goal.title.toLowerCase().includes('aplikuje') || goal.title.toLowerCase().includes('praktické')) {
    return 'svg' // Application icon
  }
  return 'svg' // Default target icon
}

// Auto-rotate tip every 30 seconds
onMounted(() => {
  setInterval(() => {
    rotateTip()
  }, 30000)
})
</script>

<style scoped>
@import "tailwindcss" reference;

.goal-enter-active {
  transition: all 0.6s ease-out;
}
.goal-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.goal-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
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