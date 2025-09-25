<template>
  <div class="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
    <!-- Enhanced Header -->
    <div class="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-50/10 to-blue-50/10"></div>
      <div class="relative flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div>
            <h3 class="font-bold text-gray-900 text-sm">Students Overview</h3>
            <p class="text-xs text-gray-600">{{ totalStudents }} active students</p>
          </div>
        </div>
        
        <!-- Assignment Filter Dropdown -->
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-gray-600">Filter:</span>
          <div class="relative">
            <select
              v-model="activeAssignmentFilter"
              class="text-xs font-semibold rounded-lg transition-all duration-200 border border-gray-200 bg-white px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 appearance-none cursor-pointer"
            >
              <option :value="null">All Assignments</option>
              <option
                v-for="assignment in assignments"
                :key="assignment.id"
                :value="assignment.id"
              >
                {{ assignment.shortName }}
              </option>
            </select>
            <!-- Custom dropdown arrow -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Students List -->
    <div class="max-h-96 overflow-y-auto">
      <TransitionGroup
        name="student-list"
        tag="div"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 transform scale-95 translate-y-2"
        enter-to-class="opacity-100 transform scale-100 translate-y-0"
        leave-active-class="transition-all duration-400 ease-in"
        leave-from-class="opacity-100 transform scale-100 translate-y-0"
        leave-to-class="opacity-0 transform scale-95 -translate-y-2"
        move-class="transition-transform duration-300 ease-out"
      >
        <template v-for="group in groupedStudents" :key="`assignment-${group.assignmentId}`">
          <!-- Assignment Divider -->
          <SlimDivider 
            :label="group.assignmentName" 
            :count="group.students.length"
          />
          
          <!-- Students in this assignment -->
          <div
            v-for="(student, index) in group.students"
            :key="`student-${student.id}`"
            :style="{ '--delay': `${index * 50}ms` }"
            class="group px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 relative overflow-hidden transition-all duration-300 ease-out border-b border-gray-50/60 last:border-b-0"
            :class="`delay-[var(--delay)]`"
          >
            <!-- Hover effect -->
            <div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="flex items-center space-x-3 relative z-10">
              <!-- Student Name -->
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 text-sm truncate group-hover:text-blue-700 transition-colors duration-200">
                  {{ student.name }}
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div class="flex-1 min-w-0 max-w-24">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 relative">
                    <div class="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
                      <div 
                        class="h-1.5 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                        :class="getProgressColor(student.progress)"
                        :style="{ width: `${student.progress}%` }"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs font-bold text-gray-600 min-w-[2rem] text-right">
                    {{ student.progress }}%
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center space-x-1">
                <button
                  @click="$emit('remind-student', student.id)"
                  class="w-7 h-7 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg transition-all duration-200 border border-amber-200/50 hover:border-amber-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Send reminder"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 12l8-8m0 0V4m0 0H20M4 4l7.35 7.35"/>
                  </svg>
                </button>
                <button
                  @click="$emit('open-student', student.id)"
                  class="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg transition-all duration-200 border border-blue-200/50 hover:border-blue-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Open student details"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </template>
      </TransitionGroup>
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
  current?: number
  target?: number
}

interface Student {
  id: string
  name: string
  goals: StudentGoal[]
  lastActive: Date
  currentAssignmentId: string
  progress: number
}

interface Assignment {
  id: string
  shortName: string
  fullName: string
  order: number
}

interface Props {
  students: Student[]
  assignments: Assignment[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'remind-student': [studentId: string]
  'open-student': [studentId: string]
}>()

// State
const activeAssignmentFilter = ref<string | null>(null)

// Computed
const totalStudents = computed(() => props.students.length)

const filteredStudents = computed(() => {
  if (!activeAssignmentFilter.value) {
    return props.students
  }
  return props.students.filter(student => 
    student.currentAssignmentId === activeAssignmentFilter.value
  )
})

const groupedStudents = computed(() => {
  // Group students by their current assignment
  const groups = new Map<string, Student[]>()
  
  filteredStudents.value.forEach(student => {
    const assignmentId = student.currentAssignmentId
    if (!groups.has(assignmentId)) {
      groups.set(assignmentId, [])
    }
    groups.get(assignmentId)!.push(student)
  })
  
  // Convert to array and sort by assignment order
  const result = Array.from(groups.entries()).map(([assignmentId, students]) => {
    const assignment = props.assignments.find(a => a.id === assignmentId)
    return {
      assignmentId,
      assignmentName: assignment?.shortName || 'Unknown',
      assignmentOrder: assignment?.order || 999,
      students: students.sort((a, b) => a.name.localeCompare(b.name))
    }
  })
  
  return result.sort((a, b) => a.assignmentOrder - b.assignmentOrder)
})

// Methods
const toggleAssignmentFilter = (assignmentId: string) => {
  activeAssignmentFilter.value = activeAssignmentFilter.value === assignmentId ? null : assignmentId
}

const clearAssignmentFilter = () => {
  activeAssignmentFilter.value = null
}

const getProgressColor = (progress: number): string => {
  if (progress >= 100) return 'bg-emerald-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-blue-400'
  if (progress >= 25) return 'bg-yellow-500'
  return 'bg-gray-400'
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

/* Transition animations */
.student-list-enter-active {
  transition: all 0.5s ease-out;
}
.student-list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.student-list-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.student-list-leave-active {
  transition: all 0.4s ease-in;
}
.student-list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.student-list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.student-list-move {
  transition: transform 0.3s ease-out;
}
</style>
