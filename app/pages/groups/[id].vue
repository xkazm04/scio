<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Group Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/groups" class="p-2 bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 hover:bg-white transition-colors shadow-lg">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {{ groupData?.name }}
              </h1>
              <p class="text-gray-600 mt-1">{{ groupData?.description }}</p>
            </div>
          </div>
          
          <!-- Status indicator -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/30 shadow-lg">
              <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-sm font-medium text-gray-700">Aktivní</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/30 shadow-lg">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">{{ groupData?.memberCount }} členů</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Goal Header -->
      <GoalHeader 
        :goals="goals"
        :overall-progress="overallProgress"
      />

      <!-- Main Interface Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <!-- Left Unified Sidebar -->
        <div class="xl:col-span-1">
          <UnifiedSidebar 
            :goals="goals"
            :students="studentsData"
            :is-teacher="isTeacher"
            @remind-student="handleRemindStudent"
            @open-student="handleOpenStudent"
          />
        </div>

        <!-- Chat Interface -->
        <div class="xl:col-span-2">
          <div class="h-full bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative">
            <!-- Chat Header -->
            <ChatHeader 
              :mode="chatMode"
              :is-processing="isProcessing"
              @toggle-mode="handleModeToggle"
            />

            <!-- Messages Area -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100%-180px)]">
              <!-- Welcome message -->
              <WelcomeMessageNew 
                v-if="messages.length === 0"
                :mode="chatMode"
                :group-description="groupData?.description || ''"
              />

              <!-- Chat messages -->
              <TransitionGroup name="message" tag="div">
                <ChatMessageNew
                  v-for="message in messages"
                  :key="message.id"
                  :type="message.type"
                  :content="message.content"
                  :timestamp="message.timestamp"
                  :warning="message.warning"
                  :mode="chatMode"
                />
              </TransitionGroup>

              <!-- Typing indicator -->
              <TypingIndicator v-if="isTyping" :mode="chatMode" />
            </div>

            <!-- Chat Input -->
            <ChatInput
              v-model:input-value="messageInput"
              :is-processing="isProcessing"
              :mode="chatMode"
              @send-message="sendMessage"
              @use-suggestion="useSuggestion"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'
import { calculateOverallProgress } from '~/helpers/goalHelpers'
import { useChat, type Message } from '~/composables/useChat'

// Get route params
const route = useRoute()
const groupId = route.params.id as string

// Sample group data - replace with real API call
const groupData = ref({
  id: groupId,
  name: 'Matematika 2A - Kvadratické rovnice',
  description: 'vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
  memberCount: 12
})

// Goals - sample data
const goals = ref<Goal[]>([
  {
    id: '1',
    type: 'boolean',
    title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
    description: 'Popište základní rozdíly a charakteristiky',
    completed: true
  },
  {
    id: '2',
    type: 'progress',
    title: 'Vyřeší kvadratické rovnice pomocí diskriminantu',
    description: 'Dokončete 3 různé příklady',
    progress: 33,
    current: 1,
    target: 3
  },
  {
    id: '3',
    type: 'boolean',
    title: 'Aplikuje kvadratické rovnice na praktické problémy',
    description: 'Vyřešte slovní úlohu s kvadratickou rovnicí',
    completed: false
  }
])

// Use chat composable
const {
  messages,
  messageInput,
  isProcessing,
  isTyping,
  messagesContainer,
  chatMode,
  handleModeToggle,
  useSuggestion,
  sendMessage
} = useChat(groupId, groupData, goals)

// Teacher/Student role management
const isTeacher = ref(true) // This would come from user authentication/role

// Sample students data for teacher view
const studentsData = ref([
  {
    id: '1',
    name: 'Jan Novák',
    lastActive: new Date(),
    goals: [
      {
        id: '1',
        type: 'boolean' as const,
        title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
        description: 'Popište základní rozdíly a charakteristiky',
        completed: true
      },
      {
        id: '2',
        type: 'progress' as const,
        title: 'Vyřeší kvadratické rovnice pomocí diskriminantu',
        description: 'Dokončete 3 různé příklady',
        progress: 67,
        current: 2,
        target: 3
      }
    ]
  },
  {
    id: '2',
    name: 'Marie Svobodová',
    lastActive: new Date(),
    goals: [
      {
        id: '1',
        type: 'boolean' as const,
        title: 'Vysvětlí rozdíl mezi lineární a kvadratickou rovnicí',
        description: 'Popište základní rozdíly a charakteristiky',
        completed: false
      },
      {
        id: '2',
        type: 'progress' as const,
        title: 'Vyřeší kvadratické rovnice pomocí diskriminantu',
        description: 'Dokončete 3 různé příklady',
        progress: 33,
        current: 1,
        target: 3
      }
    ]
  }
])

// Sample key messages data
const keyMessagesData = ref([
  {
    studentId: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    question: 'Jaký je rozdíl mezi ax + b = 0 a ax² + bx + c = 0?',
    response: 'Hlavní rozdíl je ve stupni rovnice. **Lineární rovnice** má stupeň 1 a graf je přímka. **Kvadratická rovnice** má stupeň 2 a graf je parabola.',
    goalId: '1',
    goalTitle: 'Rozdíl mezi lineární a kvadratickou rovnicí',
    progressImpact: 'Dokončen cíl - pochopení rozdílu'
  },
  {
    studentId: '1',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    question: 'Jak vypočítám diskriminant pro rovnici 2x² - 5x + 2 = 0?',
    response: 'Pro rovnici 2x² - 5x + 2 = 0 je a=2, b=-5, c=2. Diskriminant D = b² - 4ac = (-5)² - 4×2×2 = 25 - 16 = 9',
    goalId: '2',
    goalTitle: 'Řešení pomocí diskriminantu',
    progressImpact: 'Pokrok +33% - zvládnutí výpočtu diskriminantu'
  },
  {
    studentId: '2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    question: 'Proč má kvadratická rovnice maximálně 2 řešení?',
    response: 'Kvadratická rovnice má maximálně 2 řešení, protože parabola může protínat osu x nejvýše ve 2 bodech. To závisí na hodnotě diskriminantu D.',
    goalId: '1',
    goalTitle: 'Pochopení základů',
    progressImpact: 'Částečné pochopení - pokračování potřebné'
  }
])

// Computed properties
const overallProgress = computed(() => calculateOverallProgress(goals.value))

// Methods
const handleRemindStudent = (studentId: string) => {
  // TODO: Implement remind student functionality
  console.log('Reminding student:', studentId)
}

const handleOpenStudent = (studentId: string) => {
  // TODO: Implement open student details functionality
  console.log('Opening student details:', studentId)
}

// SEO
useHead({
  title: `${groupData.value.name} - Studijní skupina`,
  meta: [
    { name: 'description', content: `Aktivní studijní skupina: ${groupData.value.description}` }
  ]
})

// Page meta
definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
/* Transition animations */
.message-enter-active {
  transition: all 0.5s ease-out;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.message-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
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