<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      
      <!-- Geometric patterns -->
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      <div class="absolute top-20 left-0 w-2/3 h-px bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-transparent"></div>
      <div class="absolute bottom-20 right-0 w-1/2 h-px bg-gradient-to-l from-indigo-200/30 via-blue-200/30 to-transparent"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!--  Header -->
      <GroupsHeader 
        :total-groups="groups.length"
        :completed-groups="completedGroups"
        :average-progress="averageProgress"
        :user-role="userRole"
        :groups="groups"
      />

      <!--  Table -->
      <GroupsTable 
        :groups="groups"
        :user-role="userRole"
        :current-user-id="currentUserId"
        :is-loading="isLoading"
        @generate-qr="handleGenerateQR"
        @leave-group="handleLeaveGroup"
        @delete-group="handleDeleteGroup"
        @enter-group="handleEnterGroup"
        @create-group="showCreateModal = true"
      />

      <!-- Modals -->
      <CreateGroupModal
        v-model="showCreateModal"
        :is-creating="isCreating"
        :error-message="createGroupError"
        @create-group="handleCreateGroup"
      />

      <QRModal
        v-model="showQRModal"
        :group="selectedGroup"
      />

      <LeaveConfirmationModal
        v-model="showLeaveModal"
        :group="groupToLeave"
        :is-leaving="isLeaving"
        @confirm-leave="confirmLeaveGroup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Explicit component imports to resolve component resolution issues
import GroupsHeader from '~/components/groups/GroupsHeader.vue'
import GroupsTable from '~/components/groups/GroupsTable.vue'
import CreateGroupModal from '~/components/groups/CreateGroupModal.vue'
import QRModal from '~/components/groups/QRModal.vue'
import LeaveConfirmationModal from '~/components/groups/LeaveConfirmationModal.vue'

// Get user role from auth composable
const { userRole, getCurrentUserId } = useAuth()
const currentUserId = computed(() => getCurrentUserId())
const supabase = useSupabaseClient()

interface Group {
  id: string
  name: string
  description: string
  status: string
  progress: number
  memberCount: number
  qrCodeToken: string
  teacherId: string
  teacher: {
    id: string
    fullName: string
    email: string
  }
}

const groups = ref<Group[]>([])
const isLoading = ref(true)

// Debug user role (only log when it actually changes)
watch(userRole, (newRole, oldRole) => {
  if (newRole !== oldRole) {
    console.log('User role in groups page:', newRole)
  }
})

// Get authorization header for API calls
const getAuthHeaders = async (): Promise<Record<string, string> | undefined> => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      return {
        'Authorization': `Bearer ${session.access_token}`
      }
    }
  } catch (error) {
    console.warn('Could not get auth session:', error)
  }
  
  // Return undefined if no session available
  return undefined
}

// Fetch groups from API
const fetchGroups = async () => {
  try {
    isLoading.value = true
    const headers = await getAuthHeaders()
    
    const response = await $fetch('/api/groups', {
      ...(headers && { headers })
    }) as { success: boolean, data: Group[] }
    
    if (response.success) {
      groups.value = response.data
    }
  } catch (error) {
    console.error('Error fetching groups:', error)
  } finally {
    isLoading.value = false
  }
}

// Load groups on component mount
onMounted(fetchGroups)

// Modal states
const showCreateModal = ref(false)
const showQRModal = ref(false)
const showLeaveModal = ref(false)
const selectedGroup = ref<Group | null>(null)
const groupToLeave = ref<Group | null>(null)
const isCreating = ref(false)
const isLeaving = ref(false)
const createGroupError = ref('')

// Computed stats
const completedGroups = computed(() => 
  groups.value.filter(group => group.progress === 100).length
)

const averageProgress = computed(() => {
  if (groups.value.length === 0) return 0
  return Math.round(groups.value.reduce((sum, group) => sum + group.progress, 0) / groups.value.length)
})


// Methods
const handleGenerateQR = (group: Group) => {
  // Generate unique device ID if not exists
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('deviceId', deviceId)
  }
  
  selectedGroup.value = group
  showQRModal.value = true
  
  console.log(`Generated QR for group ${group.name} with token ${group.qrCodeToken} and device ${deviceId}`)
}

const handleEnterGroup = (groupId: string) => {
  // Navigate to group detail page
  navigateTo(`/groups/${groupId}`)
}

const handleDeleteGroup = async (groupId: string) => {
  try {
    const headers = await getAuthHeaders()
    
    await $fetch(`/api/groups/${groupId}`, {
      method: 'DELETE',
      ...(headers && { headers })
    })

    // Remove from local state
    const index = groups.value.findIndex(g => g.id === groupId)
    if (index > -1) {
      groups.value.splice(index, 1)
    }

    console.log(`Deleted group ${groupId}`)
  } catch (error) {
    console.error('Error deleting group:', error)
    alert('Nastala chyba při mazání skupiny.')
  }
}

const handleLeaveGroup = (groupId: string) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    groupToLeave.value = group
    showLeaveModal.value = true
  }
}

const confirmLeaveGroup = async (groupId: string) => {
  isLeaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from local state
    const index = groups.value.findIndex(g => g.id === groupId)
    if (index > -1) {
      groups.value.splice(index, 1)
    }
    
    showLeaveModal.value = false
    groupToLeave.value = null
    
    console.log(`Left group ${groupId}`)
  } catch (error) {
    console.error('Error leaving group:', error)
  } finally {
    isLeaving.value = false
  }
}

const handleCreateGroup = async (data: { name: string; description: string }) => {
  isCreating.value = true
  createGroupError.value = '' // Clear any previous errors
  
  try {
    const headers = await getAuthHeaders()
    
    // Call the API to create the group
    const response = await $fetch('/api/groups', {
      method: 'POST',
      body: data,
      ...(headers && { headers })
    }) as { data: Group }
    
    // Success - response should have the created group data
    if (response.data) {
      // Add the new group to the local state
      groups.value.unshift(response.data)
      console.log('New group created:', response.data.name)
    }
    
    // Close the modal on success
    showCreateModal.value = false
    createGroupError.value = ''
      
  } catch (error: any) {
    console.error('Error creating group:', error)
    
    // Check if it's actually a success with 201 status
    if (error.status === 201 || error.statusCode === 201) {
      // This is actually success, just close the modal
      showCreateModal.value = false
      createGroupError.value = ''
      // Refetch groups to get the updated list
      fetchGroups()
    } else {
      // Real error occurred
      createGroupError.value = error.data?.message || error.message || 'Nastala neočekávaná chyba při vytváření skupiny'
    }
  } finally {
    isCreating.value = false
  }
}

// Clear error when modal is opened
watch(showCreateModal, (newValue) => {
  if (newValue) {
    createGroupError.value = ''
  }
})

// SEO
useHead({
  title: userRole.value === 'teacher' ? 'Moje třídy' : 'Moje skupiny',
  meta: [
    { name: 'description', content: 'Spravujte své studijní skupiny a sledujte pokrok v učení' }
  ]
})

// Protect the route - both students and teachers can access
definePageMeta({
  middleware: 'auth'
})
</script>