<template>
  <div class="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
    <div class="relative z-10 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Enhanced Goal Header with Group Info -->
      <div class="flex-shrink-0 py-2">
        <GoalHeader 
          :goals="goals"
          :overall-progress="overallProgress"
          :group-data="groupData"
        />
      </div>

      <!-- Main Interface Grid - Flexible height -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 pb-2 min-h-0">
        <!-- Left Unified Sidebar - Constrained height -->
        <div class="xl:col-span-1 min-h-0">
          <UnifiedSidebar 
            :goals="goals"
            :students="studentsData"
            :is-teacher="isTeacher"
            @remind-student="handleRemindStudent"
            @open-student="handleOpenStudent"
            class="h-full min-h-[80vh]"
          />
        </div>

        <!-- Chat Interface - Constrained height -->
        <div class="xl:col-span-2 min-h-0">
          <div class="h-full min-h-[80vh] bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative flex flex-col">
            <!-- Chat Header - Fixed height -->
            <div class="flex-shrink-0">
              <ChatHeader 
                :mode="chatMode"
                :is-processing="isProcessing"
                @toggle-mode="handleModeToggle"
              />
            </div>

            <!-- Messages Area - Flexible height with scroll -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
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
                  :key="`${message.id}-${chatMode}`"
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

            <!-- Chat Input - Fixed height -->
            <div class="flex-shrink-0">
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