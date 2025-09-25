<template>
  <div class="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
    <!-- Tab Navigation -->
    <div class="flex border-b border-gray-100">
      <button
        @click="activeTab = 'assignments'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'assignments' 
            ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
        ]"
      >
        Assignments ({{ goals.length }})
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
        Students ({{ students.length }})
      </button>
    </div>

    <!-- Content Area -->
    <div class="h-[calc(100vh-240px)] overflow-y-auto">
      <!-- Assignments Tab -->
      <div v-if="activeTab === 'assignments'" class="p-4">
        <div class="space-y-3">
          <div
            v-for="(goal, index) in goals"
            :key="goal.id"
            class="bg-white/60 rounded-xl p-3 border border-gray-100/60 hover:shadow-md transition-all duration-200"
          >
            <!-- Assignment Title -->
            <div class="font-medium text-gray-900 text-sm leading-tight mb-2">
              {{ goal.title }}
            </div>
            
            <!-- Progress Bar -->
            <div class="relative">
              <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span class="font-medium">Progress</span>
                <span v-if="goal.type === 'progress'">
                  {{ goal.current || 0 }}/{{ goal.target || 0 }} steps
                </span>
                <span v-else>
                  {{ goal.completed ? 'Complete' : 'Pending' }}
                </span>
              </div>
              
              <div class="w-full bg-gray-200/60 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor(goal)"
                  :style="{ width: getProgressWidth(goal) + '%' }"
                ></div>
              </div>
              
              <!-- Progress percentage inside bar for progress type -->
              <div 
                v-if="goal.type === 'progress' && getProgressWidth(goal) > 0"
                class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white"
                style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5)"
              >
                {{ Math.round(getProgressWidth(goal)) }}%
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

// Methods
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
