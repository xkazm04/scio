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
      <div v-if="activeTab === 'assignments'" class="h-full">
        <ProgressPanel
          :goals="goals"
          :group-data="groupData"
          :user-role="userRole"
          @goal-added="$emit('goal-added', $event)"
        />
      </div>

      <!-- Students Tab -->
      <StudentsPanel
        v-if="activeTab === 'students' && isTeacher"
        :students="students || []"
        :assignments="assignments"
        @remind-student="$emit('remind-student', $event)"
        @open-student="$emit('open-student', $event)"
        @message-student="$emit('message-student', $event)"
        @help-resolved="$emit('help-resolved', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'
import StudentsPanel from './StudentsPanel.vue'
import ProgressPanel from './ProgressPanel.vue'

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
  nickname?: string  // Changed from 'name' to match StudentsPanel
  goals?: StudentGoal[]  // Made optional to match StudentsPanel
  lastActive?: Date
  currentAssignmentId?: string
  progress?: number
  unreadMessages?: number  // Changed from 'messageCount' to match StudentsPanel
  helpRequests?: number  // Changed from 'helpRequestCount' to match StudentsPanel
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
  assignments?: Assignment[]
  isTeacher?: boolean
  groupData?: any
  userRole?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'remind-student': [studentId: string]
  'open-student': [studentId: string]
  'message-student': [studentId: string]
  'goal-added': [goal: Goal]
  'help-resolved': [studentId: string]
}>()

// State
const activeTab = ref<'assignments' | 'students'>('assignments')

// Use provided assignments or fallback to default
const assignments = computed(() => props.assignments || [
  { id: '1', shortName: 'Assignment 1', fullName: 'Linear vs Quadratic Equations', order: 1 },
  { id: '2', shortName: 'Assignment 2', fullName: 'Quadratic Formula & Discriminant', order: 2 },
  { id: '3', shortName: 'Assignment 3', fullName: 'Real-world Applications', order: 3 }
])

// Helper functions
const isGoalCompleted = (goal: Goal): boolean => {
  if (goal.type === 'boolean') return goal.completed || false
  return (goal.progress || 0) >= 100
}

const overallProgressPercent = computed(() => {
  if (props.goals.length === 0) return 0
  const completedCount = props.goals.filter(isGoalCompleted).length
  return (completedCount / props.goals.length) * 100
})
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