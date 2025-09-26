<template>
  <div class="bg-gradient-to-br from-white/98 to-gray-50/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden">
    <!-- Linear accent pattern -->
    <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(45deg, transparent 45%, rgba(59, 130, 246, 0.03) 50%, transparent 55%); background-size: 20px 20px;"></div>
    
    <!-- Header with elegant border accent -->
    <div class="relative p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/80">
      <!-- Top accent line -->
      <div class="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-60"></div>
      
      <div class="relative flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl border border-blue-400/60 shadow-lg">
              {{ student.name.charAt(0).toUpperCase() }}
            </div>
            <!-- Status indicator -->
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-lg">{{ student.name }}</h3>
            <p class="text-sm text-gray-600">Detail pokroku studenta</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 border border-gray-200/60 shadow-sm"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 max-h-96 overflow-y-auto">
      <!-- Progress Summary -->
      <div class="mb-6">
        <h4 class="font-semibold text-gray-900 mb-3">Souhrn pokroku</h4>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-green-700">{{ completedGoals }}/{{ totalGoals }}</div>
            <div class="text-sm text-green-600">Dokončené cíle</div>
          </div>
          <div class="bg-blue-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-blue-700">{{ keyMessages.length }}</div>
            <div class="text-sm text-blue-600">Klíčové zprávy</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-purple-700">{{ Math.round(overallProgress) }}%</div>
            <div class="text-sm text-purple-600">Celkový pokrok</div>
          </div>
        </div>
      </div>

      <!-- Key Messages Leading to Progress -->
      <div class="mb-6">
        <h4 class="font-semibold text-gray-900 mb-3">Klíčové zprávy vedoucí k pokroku</h4>
        <div class="space-y-4">
          <div
            v-for="(message, index) in keyMessages"
            :key="index"
            class="bg-gradient-to-r from-blue-50/80 to-purple-50/60 rounded-lg p-4 border border-blue-100/60"
          >
            <!-- Message metadata -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-blue-600 font-medium">{{ formatTime(message.timestamp) }}</span>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ message.goalTitle }}</span>
            </div>
            
            <!-- Student question -->
            <div class="mb-3">
              <div class="text-sm font-medium text-gray-700 mb-1">Otázka studenta:</div>
              <div class="text-sm text-gray-600 bg-white/60 rounded-lg p-3">
                {{ message.question }}
              </div>
            </div>
            
            <!-- Assistant response -->
            <div class="mb-3">
              <div class="text-sm font-medium text-gray-700 mb-1">Odpověď asistenta:</div>
              <div class="text-sm text-gray-600 bg-white/60 rounded-lg p-3">
                <MathRenderer :content="message.response" />
              </div>
            </div>
            
            <!-- Progress impact -->
            <div class="flex items-center space-x-2 text-xs">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-green-600 font-medium">{{ message.progressImpact }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Goal-wise breakdown -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3">Pokrok podle cílů</h4>
        <div class="space-y-3">
          <div
            v-for="goal in student.goals"
            :key="goal.id"
            class="bg-gray-50/80 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h5 class="font-medium text-gray-900 text-sm">{{ goal.title }}</h5>
              <div class="flex items-center space-x-2">
                <GoalIndicator
                  :type="goal.type"
                  :completed="goal.completed"
                  :progress="goal.progress"
                  size="sm"
                />
                <span class="text-sm font-medium text-gray-600">
                  {{ goal.type === 'boolean' ? (goal.completed ? 'Dokončeno' : 'Nedokončeno') : `${goal.progress || 0}%` }}
                </span>
              </div>
            </div>
            <p class="text-xs text-gray-600">{{ goal.description }}</p>
            
            <!-- Related messages count -->
            <div class="mt-2 text-xs text-blue-600">
              {{ getMessagesForGoal(goal.id).length }} souvisejících zpráv
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StudentGoal {
  id: string
  type: 'boolean' | 'progress'
  title: string
  description: string
  completed?: boolean
  progress?: number
}

interface Student {
  id: string
  name: string
  goals: StudentGoal[]
}

interface KeyMessage {
  timestamp: Date
  question: string
  response: string
  goalId: string
  goalTitle: string
  progressImpact: string
}

interface Props {
  student: Student
  keyMessages: KeyMessage[]
}

const props = defineProps<Props>()

// Computed properties
const totalGoals = computed(() => props.student.goals.length)

const completedGoals = computed(() => 
  props.student.goals.filter(goal => 
    goal.type === 'boolean' ? goal.completed : (goal.progress || 0) >= 100
  ).length
)

const overallProgress = computed(() => {
  if (props.student.goals.length === 0) return 0
  
  const totalProgress = props.student.goals.reduce((sum, goal) => {
    if (goal.type === 'boolean') {
      return sum + (goal.completed ? 100 : 0)
    } else {
      return sum + (goal.progress || 0)
    }
  }, 0)
  
  return totalProgress / props.student.goals.length
})

// Methods
const formatTime = (date: Date) => {
  return date.toLocaleString('cs-CZ', { 
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getMessagesForGoal = (goalId: string) => {
  return props.keyMessages.filter(msg => msg.goalId === goalId)
}

// Emits
defineEmits<{
  close: []
}>()
</script>

<style scoped>
/* Custom scrollbar for detail view */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>