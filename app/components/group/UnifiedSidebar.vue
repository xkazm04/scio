<template>
  <div class="h-full bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl overflow-hidden flex flex-col">
    <!-- Subtle linear pattern overlay -->
    <div class="absolute inset-0 opacity-10 rounded-2xl" style="background-image: linear-gradient(135deg, transparent 45%, rgba(59, 130, 246, 0.02) 50%, transparent 55%); background-size: 30px 30px;"></div>
    
    <!-- Tab Navigation with elegant borders -->
    <div class="relative flex-shrink-0 flex border-b border-gray-100/80">
      <!-- Top accent line -->
      <div class="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-40"></div>
      <button
        @click="activeTab = 'assignments'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'assignments' 
            ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
        ]"
      >
        Úkoly ({{ goals.length }})
      </button>
      <button
        v-if="isTeacher"
        @click="activeTab = 'students'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'students' 
            ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
        ]"
      >
        Studenti ({{ students?.length || 0 }})
      </button>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- Assignments Tab -->
      <div v-if="activeTab === 'assignments'" class="p-4">
        <div class="space-y-3">
          <div
            v-for="(goal, index) in goals"
            :key="goal.id"
            class="bg-white/80 rounded-xl p-3 border border-gray-100/60 hover:shadow-lg hover:border-blue-200/60 transition-all duration-200 overflow-hidden relative group"
          >
            <!-- Left accent line for visual distinction -->
            <div 
              :class="[
                'absolute left-0 top-2 bottom-2 w-1 rounded-r transition-all duration-300',
                isGoalCompleted(goal) 
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-600' 
                  : (goal.type === 'progress' && (goal.progress || 0) > 0)
                    ? 'bg-gradient-to-b from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-b from-gray-400 to-gray-500'
              ]"
            ></div>

            <!-- Assignment Header with Number and Status Icon -->
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold">{{ index + 1 }}</span>
              </div>
              <div class="font-medium text-gray-900 text-sm leading-tight flex-1">
                {{ goal.title }}
              </div>
              
              <!-- Status Icon -->
              <div class="flex-shrink-0">
                <!-- Completed - Green Checkmark -->
                <div v-if="isGoalCompleted(goal)" class="w-5 h-5 opacity-70">
                  <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <!-- In Progress - Blue Hourglass -->
                <div v-else-if="goal.type === 'progress' && (goal.progress || 0) > 0" class="w-5 h-5 opacity-70">
                  <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/>
                  </svg>
                </div>
                <!-- Not Started - Gray Circle -->
                <div v-else class="w-5 h-5 opacity-50">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Students Tab -->
      <StudentsPanel
        v-if="activeTab === 'students' && isTeacher"
        :students="studentsWithProgress"
        :assignments="assignments"
        @remind-student="$emit('remind-student', $event)"
        @open-student="$emit('open-student', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'
import StudentsPanel from './StudentsPanel.vue'

interface StudentGoal {
  id: string
  type: 'boolean' | 'progress'
  title: string
  description: string
  completed?: boolean
  progress?: number
  current?: number
  target?: number
}

interface Student {
  id: string
  name: string
  goals: StudentGoal[]
  lastActive: Date
}

interface Assignment {
  id: string
  shortName: string
  fullName: string
  order: number
}

interface Props {
  goals: Goal[]
  students?: Student[]
  isTeacher?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'remind-student': [studentId: string]
  'open-student': [studentId: string]
}>()

// State
const activeTab = ref<'assignments' | 'students'>('assignments')

// Sample assignments data - replace with real data
const assignments = ref<Assignment[]>([
  { id: '1', shortName: 'Assignment 1', fullName: 'Linear vs Quadratic Equations', order: 1 },
  { id: '2', shortName: 'Assignment 2', fullName: 'Quadratic Formula & Discriminant', order: 2 },
  { id: '3', shortName: 'Assignment 3', fullName: 'Real-world Applications', order: 3 }
])

// Computed
const studentsWithProgress = computed(() => {
  if (!props.students) return []
  
  return props.students.map(student => ({
    ...student,
    progress: getStudentProgress(student),
    currentAssignmentId: getCurrentAssignmentId(student)
  }))
})

//Methods
const getProgressWidth = (goal: Goal): number => {
  if (goal.type === 'boolean') {
    return goal.completed ? 100 : 0
  }
  return goal.progress || 0
}

const getProgressColor = (goal: Goal): string => {
  const progress = getProgressWidth(goal)
  if (progress >= 100) return 'bg-emerald-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-gray-400'
}

const isGoalCompleted = (goal: Goal): boolean => {
  if (goal.type === 'boolean') return goal.completed || false
  return (goal.progress || 0) >= 100
}

const getStudentProgress = (student: Student): number => {
  if (student.goals.length === 0) return 0
  
  const totalProgress = student.goals.reduce((sum, goal) => {
    if (goal.type === 'boolean') {
      return sum + (goal.completed ? 100 : 0)
    } else {
      return sum + (goal.progress || 0)
    }
  }, 0)
  
  return Math.round(totalProgress / student.goals.length)
}

const getCurrentAssignmentId = (student: Student): string => {
  // Determine which assignment the student is currently on
  // This is simplified logic - in practice, you'd have more complex business logic
  const completedGoals = student.goals.filter(goal => 
    goal.type === 'boolean' ? goal.completed : (goal.progress || 0) >= 100
  ).length
  
  if (completedGoals === 0) return '1'
  if (completedGoals <= 1) return '2'
  return '3'
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
