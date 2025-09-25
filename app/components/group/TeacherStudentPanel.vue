<template>
  <div class="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-gray-900">Přehled studentů</h3>
          <p class="text-sm text-gray-600">{{ students.length }} aktivních studentů</p>
        </div>
      </div>
    </div>

    <!-- Students List -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="student in students"
        :key="student.id"
        class="bg-gradient-to-r from-gray-50/80 to-white/60 rounded-2xl p-4 border border-gray-100/60 transition-all duration-300 hover:shadow-lg group cursor-pointer"
        @click="toggleStudentDetail(student)"
      >
        <!-- Student Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
              {{ student.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ student.name }}</h4>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <span>{{ getStudentProgress(student) }}% dokončeno</span>
                <span>•</span>
                <span>{{ getStudentKeyMessages(student).length }} klíčových zpráv</span>
              </div>
            </div>
          </div>
          
          <!-- Expand/Collapse indicator -->
          <div class="flex items-center space-x-3">
            <!-- Progress ring -->
            <div class="relative w-8 h-8">
              <svg class="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  class="stroke-current text-gray-200"
                  stroke-width="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  :class="[
                    'stroke-current transition-all duration-1000 ease-out',
                    getStudentProgress(student) >= 75 ? 'text-green-500' :
                    getStudentProgress(student) >= 50 ? 'text-blue-500' :
                    getStudentProgress(student) >= 25 ? 'text-yellow-500' :
                    'text-red-500'
                  ]"
                  stroke-width="3"
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${getStudentProgress(student)}, 100`"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-gray-700">{{ getStudentProgress(student) }}%</span>
              </div>
            </div>
            
            <!-- Expand button -->
            <button class="p-1 hover:bg-gray-200/60 rounded-lg transition-colors">
              <svg 
                class="w-4 h-4 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': expandedStudent?.id === student.id }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Quick Goals Preview -->
        <div class="mt-3 flex items-center space-x-2">
          <div
            v-for="goal in student.goals.slice(0, 4)"
            :key="goal.id"
            class="flex-shrink-0"
          >
            <GoalIndicator
              :type="goal.type"
              :completed="goal.completed"
              :progress="goal.progress"
              size="xs"
            />
          </div>
          <span v-if="student.goals.length > 4" class="text-xs text-gray-500">
            +{{ student.goals.length - 4 }} dalších
          </span>
        </div>
      </div>
    </div>

    <!-- Expanded Student Detail -->
    <Transition name="slide-down">
      <div v-if="expandedStudent" class="mt-6 border-t border-gray-100/80 pt-6">
        <StudentDetail
          :student="expandedStudent"
          :key-messages="getStudentKeyMessages(expandedStudent)"
          @close="expandedStudent = null"
        />
      </div>
    </Transition>
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
  lastActive: Date
}

interface KeyMessage {
  studentId: string
  timestamp: Date
  question: string
  response: string
  goalId: string
  goalTitle: string
  progressImpact: string
}

interface Props {
  students: Student[]
  keyMessages: KeyMessage[]
}

const props = defineProps<Props>()

// State
const expandedStudent = ref<Student | null>(null)

// Methods
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

const getStudentKeyMessages = (student: Student): KeyMessage[] => {
  return props.keyMessages.filter(msg => msg.studentId === student.id)
}

const toggleStudentDetail = (student: Student) => {
  expandedStudent.value = expandedStudent.value?.id === student.id ? null : student
}
</script>

<style scoped>
/* Transition animations */
.slide-down-enter-active {
  transition: all 0.4s ease-out;
}
.slide-down-leave-active {
  transition: all 0.3s ease-in;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

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