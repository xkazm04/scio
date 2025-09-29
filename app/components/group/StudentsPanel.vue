<template>
  <div class="bg-white/90 backdrop-blur-3xl rounded-3xl border-2 border-white/70 shadow-2xl overflow-hidden">
    <!-- Premium Header -->
    <div class="px-6 py-5 border-b border-white/60 bg-gradient-to-r from-purple-50/40 via-blue-50/40 to-indigo-50/40 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
      <div class="relative flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Premium icon -->
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-6">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-black text-slate-900 text-lg">Students Overview</h3>
            <p class="text-sm text-slate-600 font-semibold">{{ students.length }} active students</p>
          </div>
        </div>
        
        <!-- Premium Goal Filter -->
        <div class="flex items-center space-x-3">
          <span class="text-xs font-black text-slate-600 uppercase tracking-wider">Filter:</span>
          <div class="relative">
            <select
              v-model="showGoalType"
              class="text-sm font-bold rounded-xl transition-all duration-300 border-2 border-slate-200 bg-white/90 backdrop-blur-2xl px-4 py-2 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 appearance-none cursor-pointer shadow-lg hover:shadow-xl"
            >
              <option value="all">All Goals</option>
              <option value="incomplete">Incomplete</option>
              <option value="completed">Completed</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Students List with premium cards -->
    <div class="max-h-[600px] overflow-y-auto p-4 space-y-4">
      <div v-if="students.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <p class="text-slate-500 font-semibold">No students in this group yet</p>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="(student, index) in students" 
          :key="student.id"
          :style="{ '--delay': `${index * 0.1}s` }"
          class="group relative animate-slide-in-stagger"
        >
          <!-- Premium student card -->
          <div class="relative p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border-2 border-slate-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <!-- Gradient accent on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 transition-all duration-500"></div>
            
            <!-- Left accent bar -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Student Header -->
            <div class="relative flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <!-- Premium avatar -->
                <div class="relative">
                  <div class="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {{ getStudentInitial(student.nickname) }}
                  </div>
                  <!-- Online indicator -->
                  <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                </div>
                
                <div>
                  <h4 class="font-black text-slate-900 text-base">{{ student.nickname || 'Student' }}</h4>
                  <p class="text-sm text-slate-600 font-semibold">{{ getGoalCount(student.goals) }} goals • {{ getCompletionRate(student.goals) }}% complete</p>
                </div>
              </div>
              
              <!-- Status Indicators -->
              <div class="flex items-center space-x-2">
                <!-- Help Request Indicator -->
                <Transition name="pop">
                  <div 
                    v-if="student.helpRequests && student.helpRequests > 0"
                    class="relative group/help"
                  >
                    <div class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-2 rounded-xl text-xs font-black shadow-lg animate-pulse-gentle cursor-pointer transform hover:scale-110 transition-all">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ student.helpRequests }}</span>
                    </div>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xl opacity-0 group-hover/help:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {{ student.helpRequests }} help request{{ student.helpRequests > 1 ? 's' : '' }}
                      <div class="absolute top-full right-4 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </Transition>

                <!-- Message Indicator -->
                <Transition name="pop">
                  <div 
                    v-if="student.unreadMessages && student.unreadMessages > 0"
                    class="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-black shadow-lg"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>{{ student.unreadMessages }}</span>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Individual Goal Progress with premium cards -->
            <div v-if="student.goals && student.goals.length > 0" class="relative space-y-3 mb-4">
              <div 
                v-for="goal in getFilteredGoals(student.goals)" 
                :key="goal.id"
                class="relative p-3 bg-gradient-to-br from-slate-50/80 to-white rounded-2xl border border-slate-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h5 class="text-sm font-black text-slate-900 mb-1">{{ goal.title }}</h5>
                    
                    <!-- Goal type badge -->
                    <div class="flex items-center space-x-2">
                      <span 
                        :class="[
                          'px-2 py-0.5 rounded-lg text-xs font-black',
                          goal.type === 'boolean' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        ]"
                      >
                        {{ goal.type === 'boolean' ? 'Checkbox' : 'Progress' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Goal Progress Display -->
                  <div class="ml-4 flex items-center space-x-3">
                    <template v-if="goal.type === 'boolean'">
                      <!-- Premium Boolean Goal -->
                      <div 
                        class="w-8 h-8 rounded-xl border-3 flex items-center justify-center transition-all duration-300 shadow-lg"
                        :class="goal.completed 
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400' 
                          : 'border-slate-300 bg-white hover:border-slate-400'"
                      >
                        <svg 
                          v-if="goal.completed" 
                          class="w-5 h-5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    </template>
                    
                    <template v-else>
                      <!-- Premium Progress Goal -->
                      <div class="flex items-center space-x-3">
                        <div class="relative">
                          <!-- Circular progress -->
                          <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <circle
                              cx="18" cy="18" r="14"
                              fill="none"
                              stroke="rgb(226 232 240)"
                              stroke-width="3"
                            />
                            <circle
                              cx="18" cy="18" r="14"
                              fill="none"
                              :stroke="getProgressColor(goal)"
                              stroke-width="3"
                              :stroke-dasharray="`${getProgressPercentage(goal) * 0.88} 88`"
                              stroke-linecap="round"
                              class="transition-all duration-500"
                            />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center">
                            <span class="text-xs font-black text-slate-700">{{ getProgressPercentage(goal) }}%</span>
                          </div>
                        </div>
                        <div class="text-xs font-bold text-slate-600">
                          {{ goal.current || 0 }}/{{ goal.target || 0 }}
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Premium Action Buttons -->
            <div class="relative flex justify-end space-x-3">
              <button
                @click="$emit('message-student', student.id)"
                class="group/btn relative px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 border-2 border-green-400/50 hover:border-green-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 flex items-center space-x-2 font-bold text-sm overflow-hidden"
                title="Send message to student"
              >
                <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span class="relative z-10">Message</span>
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 animate-shimmer-btn"></div>
              </button>
              
              <button
                @click="$emit('open-student', student.id)"
                class="group/btn relative px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 border-2 border-blue-400/50 hover:border-blue-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 flex items-center space-x-2 font-bold text-sm overflow-hidden"
                title="Open student details"
              >
                <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                <span class="relative z-10">Details</span>
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 animate-shimmer-btn"></div>
              </button>
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
  current?: number
  target?: number
}

interface Student {
  id: string
  nickname?: string
  goals?: StudentGoal[]
  helpRequests?: number
  unreadMessages?: number
  lastMessage?: string
}

defineProps<{
  students: Student[]
}>()

defineEmits<{
  'message-student': [studentId: string]
  'open-student': [studentId: string]
  'help-resolved': [studentId: string]
}>()

// Reactive state
const showGoalType = ref<'all' | 'incomplete' | 'completed'>('all')

// Helper functions
const getStudentInitial = (nickname?: string): string => {
  return (nickname || 'S').charAt(0).toUpperCase()
}

const getGoalCount = (goals?: StudentGoal[]): number => {
  return goals?.length || 0
}

const getCompletionRate = (goals?: StudentGoal[]): number => {
  if (!goals || goals.length === 0) return 0
  const completed = goals.filter(goal => {
    if (goal.type === 'boolean') return goal.completed
    return (goal.progress || 0) >= 100
  }).length
  return Math.round((completed / goals.length) * 100)
}

const getFilteredGoals = (goals: StudentGoal[]): StudentGoal[] => {
  if (!goals) return []
  
  return goals.filter(goal => {
    if (showGoalType.value === 'all') return true
    
    const isCompleted = goal.type === 'boolean' 
      ? goal.completed 
      : (goal.progress || 0) >= 100
    
    return showGoalType.value === 'completed' ? isCompleted : !isCompleted
  })
}

const getProgressPercentage = (goal: StudentGoal): number => {
  if (goal.type === 'boolean') {
    return goal.completed ? 100 : 0
  }
  return Math.round(goal.progress || 0)
}

const getProgressColor = (goal: StudentGoal): string => {
  const percentage = getProgressPercentage(goal)
  if (percentage >= 100) return '#10b981' // emerald-500
  if (percentage >= 75) return '#3b82f6' // blue-500
  if (percentage >= 50) return '#6366f1' // indigo-500
  if (percentage >= 25) return '#8b5cf6' // violet-500
  return '#ef4444' // red-500
}
</script>

<style scoped>
@import "tailwindcss" reference;

@keyframes slide-in-stagger {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-gentle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer-btn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-slide-in-stagger {
  animation: slide-in-stagger 0.5s ease-out;
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

.animate-shimmer-btn {
  animation: shimmer-btn 1.5s infinite;
}

/* Transition animations */
.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.2s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgb(99 102 241), rgb(139 92 246));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgb(79 70 229), rgb(124 58 237));
}
</style>