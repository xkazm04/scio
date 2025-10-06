<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
    <div class="text-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="text-slate-600">Načítání skupiny...</p>
    </div>
  </div>
  
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
    <div class="text-center space-y-4 max-w-md mx-auto px-4">
      <div class="text-red-500 text-5xl">⚠️</div>
      <h2 class="text-xl font-semibold text-slate-800">Chyba při načítání</h2>
      <p class="text-slate-600">{{ error }}</p>
      <button 
        @click="loadGroupData" 
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Zkusit znovu
      </button>
    </div>
  </div>

  <div v-else class="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
    <div class="relative z-10 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!--  Goal Header with Group Info -->
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
            :assignments="defaultAssignments"
            :is-teacher="isTeacher"
            :group-data="groupData"
            :user-role="userRole"
            @remind-student="handleRemindStudent"
            @open-student="handleOpenStudent"
            @message-student="handleMessageStudent"
            @goal-added="handleGoalAdded"
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
                :user-role="userRole"
                :selected-student="selectedStudentName"
                @toggle-mode="handleModeToggle"
              />
            </div>

            <!-- Messages Area - Flexible height with scroll -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
              <!-- Show chat content only for students OR teachers with selected student -->
              <template v-if="userRole === 'student' || (userRole === 'teacher' && selectedStudentName)">
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
              </template>
              
              <!-- Teacher placeholder when no student selected -->
              <div v-else-if="userRole === 'teacher' && !selectedStudentName" class="flex-1 flex items-center justify-center">
                <div class="text-center max-w-md mx-auto">
                  <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-3">Vyberte studenta pro komunikaci</h3>
                  <p class="text-gray-600 leading-relaxed mb-6">
                    Klikněte na tlačítko "Poslat zprávu" u vybraného studenta v panelu vpravo pro zahájení individuální konverzace.
                  </p>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p class="text-sm text-blue-800">
                      <strong>Tip:</strong> Můžete komunikovat s každým studentem zvlášť a sledovat jejich pokrok v reálném čase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input - Fixed height -->
            <div v-if="userRole === 'student' || (userRole === 'teacher' && selectedStudentName)" class="flex-shrink-0">
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
import { useRealTime } from '~/composables/useRealTime'

// Get route params and auth
const route = useRoute()
const groupId = route.params.id as string
const { userRole, getCurrentUserId, isLoading: authLoading, isUserLoaded } = useAuth()
const currentUserId = computed(() => getCurrentUserId())
const supabase = useSupabaseClient()

// Reactive data
const groupData = ref<any>(null)
const goals = ref<Goal[]>([])
const studentsData = ref<any[]>([])
const helpRequests = ref<any[]>([])
const messages = ref<any[]>([])
const selectedStudentName = ref<string | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Default assignments for StudentsPanel
const defaultAssignments = ref([
  { id: 'assignment-1', shortName: 'Úkol 1', fullName: 'První studijní úkol', order: 1 },
  { id: 'assignment-2', shortName: 'Úkol 2', fullName: 'Druhý studijní úkol', order: 2 },
  { id: 'assignment-3', shortName: 'Úkol 3', fullName: 'Třetí studijní úkol', order: 3 },
])

// Role-based data loading
const isTeacher = computed(() => userRole.value === 'teacher')
const isStudent = computed(() => userRole.value === 'student')

// Use chat composable
const {
  messages: chatMessages,
  messageInput,
  isProcessing,
  isTyping,
  messagesContainer,
  chatMode,
  handleModeToggle,
  useSuggestion,
  sendMessage
} = useChat(groupId, groupData, goals)

// Real-time updates for teachers
const { isConnected, onMessage } = useRealTime(groupId, userRole.value || 'student')

// Handle real-time updates
if (isTeacher.value) {
  onMessage((data: any) => {
    switch (data.type) {
      case 'goal_progress_updated':
        // Update student progress in real-time
        updateStudentProgress(data.data)
        break
      case 'help_request_created':
        // Update help request count
        updateHelpRequests(data.data)
        break
      case 'help_request_resolved':
        // Remove resolved help request
        removeResolvedHelpRequest(data.data)
        break
      case 'message_created':
        // Update message count
        updateMessageCount(data.data)
        break
    }
  })
}

// Device ID for student identification (simulate localStorage)
const getDeviceId = () => {
  if (process.client) {
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 12)
      localStorage.setItem('deviceId', deviceId)
    }
    return deviceId
  }
  return null
}

// Load data based on user role
const loadGroupData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // CRITICAL: Wait for user role to be loaded before proceeding
    if (!userRole.value) {
      console.log('⏳ UserRole not yet loaded, waiting...')
      error.value = null
      isLoading.value = false
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      error.value = 'Authentication required'
      return
    }

    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
    }

    console.log('🔄 Loading group data for:', { 
      groupId, 
      userRole: userRole.value, 
      isTeacher: isTeacher.value,
      isStudent: isStudent.value,
      isUserLoaded: isUserLoaded.value
    })

    // Build query params for students (deviceId)
    let url = `/api/groups/${groupId}`
    if (isStudent.value) {
      const deviceId = getDeviceId()
      if (!deviceId) {
        error.value = 'Device ID required for student access'
        return
      }
      url += `?deviceId=${deviceId}`
    }

    console.log('📞 Calling UNIFIED endpoint:', url)
    
    // Single API call for both teacher and student
    const response: any = await $fetch(url, { headers })
    
    console.log('🔍 Raw API Response:', response)
    console.log('🔍 Response.success:', response.success)
    console.log('🔍 Response.data:', response.data)
    
    if (response.success && response.data) {
      const data = response.data
      
      console.log('✅ Data loaded, viewType:', data.viewType)
      console.log('📦 Full data object:', data)
      
      groupData.value = data.group
      
      if (data.viewType === 'teacher') {
        // Handle teacher data
        goals.value = data.goals.map((goal: any) => ({
          id: goal.id,
          type: goal.goalType === 'boolean' ? 'boolean' : 'progress',
          title: goal.title,
          description: goal.description,
          completed: goal.completionRate === 100,
          progress: goal.completionRate,
          current: goal.completedBy,
          target: goal.totalParticipants || 1,
        }))
        
        // Transform participants for the sidebar
        studentsData.value = (data.participants || []).map((participant: any) => ({
          id: participant.id,
          nickname: participant.nickname,
          lastActive: new Date(participant.lastActivity || participant.joinedAt),
          currentAssignmentId: 'assignment-1',
          progress: participant.overallProgress || 0,
          unreadMessages: participant.messageCount || 0,  // Match StudentsPanel interface
          helpRequests: participant.helpRequestCount || 0,  // Match StudentsPanel interface
          goals: (participant.progress || []).map((prog: any) => ({
            id: prog.goalId,
            type: prog.goalType === 'boolean' ? 'boolean' as const : 'progress' as const,
            title: prog.goalTitle,
            description: '',
            completed: prog.isCompleted,
            progress: prog.goalType === 'percentage' && prog.targetValue > 0 
              ? Math.round((prog.currentValue / prog.targetValue) * 100)
              : prog.isCompleted ? 100 : 0,
            current: prog.currentValue,
            target: prog.targetValue,
          }))
        }))
        
        console.log('✅ Students loaded:', studentsData.value.length)
        console.log('📊 Student data sample:', studentsData.value[0])
        
        helpRequests.value = data.helpRequests || []
        
      } else if (data.viewType === 'student') {
        // Handle student data
        console.log('�‍🎓 Student data loaded')
        
        // Check if student has joined the group
        if (data.notJoined) {
          error.value = 'You have not joined this group yet. Please use the join link to join first.'
          return
        }
        
        console.log('✅ Student groupData loaded:', groupData.value)
        
        // Transform goals for student view
        goals.value = data.goals.map((goal: any) => ({
          id: goal.id,
          type: goal.goalType === 'boolean' ? 'boolean' : 'progress',
          title: goal.title,
          description: goal.description,
          completed: goal.isCompleted,
          progress: goal.progress,
          current: goal.currentValue,
          target: goal.targetValue,
        }))
        
        messages.value = data.messages || []
        
      } else {
        console.error('❌ Unknown viewType:', data.viewType)
        error.value = 'Invalid response from server'
      }
    } else {
      error.value = 'No data received from server'
    }
  } catch (err: any) {
    console.error('Error loading group data:', err)
    error.value = err?.data?.message || 'Failed to load group data'
  } finally {
    isLoading.value = false
  }
}

// Load data on mount and when role changes
onMounted(() => {
  // Wait for auth to be fully loaded before fetching data
  if (isUserLoaded.value && userRole.value) {
    console.log('✅ Auth ready on mount, loading group data immediately')
    loadGroupData()
  } else {
    console.log('⏳ Waiting for auth to load...', { isUserLoaded: isUserLoaded.value, userRole: userRole.value })
  }
})

// Watch for user to be loaded (more reliable than watching authLoading)
watch(isUserLoaded, (loaded) => {
  if (loaded && userRole.value && !groupData.value) {
    console.log('✅ User loaded via watch, loading group data now')
    loadGroupData()
  }
})

// Only reload if role actually changes value (not just object reference)
watch(userRole, (newRole, oldRole) => {
  if (newRole && newRole !== oldRole && !groupData.value) {
    console.log('🔄 User role changed, loading group data:', { oldRole, newRole })
    loadGroupData()
  }
})

// Computed properties
const overallProgress = computed(() => calculateOverallProgress(goals.value))

// Methods
const handleRemindStudent = (studentId: string) => {
  // TODO: Implement remind student functionality
  console.log('Reminding student:', studentId)
}

const handleOpenStudent = (studentId: string) => {
  const student = studentsData.value.find(s => s.id === studentId)
  if (student) {
    selectedStudentName.value = student.name
    console.log('Selected student for chat:', student.name)
  }
}

const handleMessageStudent = (studentId: string) => {
  const student = studentsData.value.find(s => s.id === studentId)
  if (student) {
    selectedStudentName.value = student.name
    console.log('Starting chat with student:', student.name)
    // Scroll to chat area if needed
    nextTick(() => {
      const chatArea = document.querySelector('.xl\\:col-span-2')
      if (chatArea) {
        chatArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

const handleGoalAdded = async (newGoal: Goal) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      console.error('No session available')
      return
    }

    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
    }

    // Send goal to API
    const response: any = await $fetch(`/api/groups/${groupId}/goals`, {
      method: 'POST',
      headers,
      body: {
        title: newGoal.title,
        description: newGoal.description,
        goalType: newGoal.type === 'boolean' ? 'boolean' : 'percentage',
        targetValue: newGoal.target || 1,
        orderIndex: goals.value.length
      }
    })

    if (response.success && response.data) {
      // Add the new goal with the real ID from the database
      const createdGoal = {
        id: response.data.id,
        type: response.data.goalType === 'boolean' ? 'boolean' as const : 'progress' as const,
        title: response.data.title,
        description: response.data.description,
        completed: false,
        progress: 0,
        current: 0,
        target: response.data.targetValue || 1
      }
      
      goals.value.push(createdGoal)
      console.log('✅ Goal created successfully:', createdGoal)
    }
  } catch (error: any) {
    console.error('Error creating goal:', error)
    // You could add toast notification here
  }
}

// Real-time update handlers
const updateStudentProgress = (progressData: any) => {
  const studentIndex = studentsData.value.findIndex((s: any) => s.id === progressData.participantId)
  if (studentIndex !== -1) {
    const goalIndex = studentsData.value[studentIndex].goals.findIndex((g: any) => g.id === progressData.goalId)
    if (goalIndex !== -1) {
      // Update goal progress with animation
      studentsData.value[studentIndex].goals[goalIndex] = {
        ...studentsData.value[studentIndex].goals[goalIndex],
        completed: progressData.isCompleted,
        progress: progressData.progress,
        current: progressData.currentValue
      }
      
      // Recalculate overall student progress
      const completedGoals = studentsData.value[studentIndex].goals.filter((g: any) => 
        g.type === 'boolean' ? g.completed : (g.progress || 0) >= 100
      ).length
      studentsData.value[studentIndex].progress = Math.round(
        (completedGoals / studentsData.value[studentIndex].goals.length) * 100
      )
    }
  }
}

const updateHelpRequests = (helpData: any) => {
  const studentIndex = studentsData.value.findIndex(s => s.id === helpData.participantId)
  if (studentIndex !== -1) {
    studentsData.value[studentIndex].helpRequestCount += 1
  }
}

const removeResolvedHelpRequest = (helpData: any) => {
  const studentIndex = studentsData.value.findIndex(s => s.id === helpData.participantId)
  if (studentIndex !== -1) {
    studentsData.value[studentIndex].helpRequestCount = Math.max(0, 
      studentsData.value[studentIndex].helpRequestCount - 1
    )
  }
}

const updateMessageCount = (messageData: any) => {
  const studentIndex = studentsData.value.findIndex(s => s.id === messageData.participantId)
  if (studentIndex !== -1) {
    studentsData.value[studentIndex].messageCount += 1
  }
}

const handleHelpResolved = (studentId: string) => {
  removeResolvedHelpRequest({ participantId: studentId })
}

// SEO
useHead({
  title: computed(() => groupData.value?.name ? `${groupData.value.name} - Studijní skupina` : 'Studijní skupina'),
  meta: [
    { name: 'description', content: computed(() => groupData.value?.description ? `Aktivní studijní skupina: ${groupData.value.description}` : 'Aktivní studijní skupina') }
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