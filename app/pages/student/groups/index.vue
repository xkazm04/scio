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

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Enhanced Header -->
      <GroupsHeader 
        :total-groups="groups.length"
        :completed-groups="completedGroups"
        :average-progress="averageProgress"
      />

      <!-- Enhanced Table -->
      <GroupsTable 
        :groups="groups"
        @generate-qr="handleGenerateQR"
        @leave-group="handleLeaveGroup"
        @enter-group="handleEnterGroup"
        @create-group="showCreateModal = true"
      />

      <!-- Modals -->
      <CreateGroupModal
        v-model="showCreateModal"
        :is-creating="isCreating"
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

interface Group {
  id: number
  name: string
  description: string
  status: string
  progress: number
  memberCount: number
  qrToken: string
}

const groups = ref<Group[]>([])
const isLoadingGroups = ref(true)
const groupsError = ref('')

// Modal states
const showCreateModal = ref(false)
const showQRModal = ref(false)
const showLeaveModal = ref(false)
const selectedGroup = ref<Group | null>(null)
const groupToLeave = ref<Group | null>(null)
const isCreating = ref(false)
const isLeaving = ref(false)

// Computed stats
const completedGroups = computed(() => 
  groups.value.filter(group => group.progress === 100).length
)

const averageProgress = computed(() => {
  if (groups.value.length === 0) return 0
  return Math.round(groups.value.reduce((sum, group) => sum + group.progress, 0) / groups.value.length)
})

const lastUpdate = computed(() => '2 hodinami') // Mock data

// Load groups from API
const loadGroups = async () => {
  try {
    isLoadingGroups.value = true
    groupsError.value = ''
    
    // Get user session for auth token
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('No access token available')
    }
    
    const response = await $fetch('/api/groups', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    }) as any
    
    if (response.success && response.data) {
      // Map API response to local interface
      groups.value = response.data.map((group: any) => ({
        id: parseInt(group.id) || Math.random(),
        name: group.name,
        description: group.description,
        status: group.status || 'active',
        progress: group.progress || 0,
        memberCount: group.memberCount || 0,
        qrToken: group.qrCodeToken || group.qrToken
      }))
    }
  } catch (error: any) {
    console.error('Failed to load groups:', error)
    groupsError.value = error.message || 'Failed to load groups'
    
    // Fallback to mock data on error
    groups.value = [
      {
        id: 1,
        name: 'Matematika 2A - Kvadratické rovnice',
        description: 'vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu',
        status: 'active',
        progress: 75,
        memberCount: 12,
        qrToken: 'MTK-2A-KR-001'
      }
    ]
  } finally {
    isLoadingGroups.value = false
  }
}

// Load groups on mount
onMounted(() => {
  loadGroups()
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
  
  console.log(`Generated QR for group ${group.name} with token ${group.qrToken} and device ${deviceId}`)
}

const handleEnterGroup = (groupId: number) => {
  // Navigate to group detail page
  console.log(`Entering group ${groupId}`)
  // In real app: navigateTo(`/student/groups/${groupId}`)
}

const handleLeaveGroup = (groupId: number) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    groupToLeave.value = group
    showLeaveModal.value = true
  }
}

const confirmLeaveGroup = async (groupId: number) => {
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
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate new group
    const newId = Math.max(...groups.value.map(g => g.id)) + 1
    const qrToken = `GRP-${newId}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    
    const group: Group = {
      id: newId,
      name: data.name,
      description: data.description,
      status: 'active',
      progress: 0,
      memberCount: 1, // Creator is first member
      qrToken
    }
    
    groups.value.unshift(group)
    
    showCreateModal.value = false
    
    console.log('New group created:', group)
  } catch (error) {
    console.error('Error creating group:', error)
  } finally {
    isCreating.value = false
  }
}

// SEO
useHead({
  title: 'Moje skupiny',
  meta: [
    { name: 'description', content: 'Spravujte své studijní skupiny a sledujte pokrok v učení' }
  ]
})

// Protect the route for students
definePageMeta({
  middleware: 'student'
})
</script>