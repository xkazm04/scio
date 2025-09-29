<template>
  <div class="relative">
    <!-- Delete Group Modal -->
    <DeleteGroupModal 
      v-model="showDeleteModal" 
      :group="groupToDelete" 
      @confirm-delete="handleDeleteConfirm"
    />
    
    <!-- Table Container -->
    <div class="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent"></div>
      
      <!-- Table Header -->
      <div class="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/60 to-white/40 relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-purple-50/10"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Seznam skupin
              </h2>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Category Filters -->
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-600">Filtr:</span>
              <button
                v-for="category in categories"
                :key="category.name"
                @click="toggleCategory(category.name)"
                :class="[
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
                  activeCategories.includes(category.name)
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                ]"
              >
                <span class="mr-1">{{ category.icon }}</span>
                {{ category.name }}
              </button>
            </div>
            
            <!-- Create Button -->
            <button
              @click="$emit('create-group')"
              class="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Vytvořit skupinu
            </button>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="relative">
        <!-- Table Headers -->
        <div class="px-8 py-4 border-b border-gray-100/60 bg-gradient-to-r from-gray-25/80 to-white/40">
          <div class="grid grid-cols-12 gap-6 text-xs font-bold text-gray-600 uppercase tracking-wider">
            <div class="col-span-4 flex items-center">
              <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.414 1.414 0 01-2 0l-7-7A1.414 1.414 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Název a cíl
            </div>
            <div class="col-span-3 flex items-center">
              <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Pokrok
            </div>
            <div class="col-span-2 flex items-center">
              <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              Členové
            </div>
            <div class="col-span-3 flex items-center">
              <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
              </svg>
              Akce
            </div>
          </div>
        </div>

        <!-- Group Rows with  Motion Animations -->
        <TransitionGroup 
          name="list" 
          tag="div"
          class="divide-y divide-gray-100/60"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 transform scale-95 translate-y-4"
          enter-to-class="opacity-100 transform scale-100 translate-y-0"
          leave-active-class="transition-all duration-400 ease-in"
          leave-from-class="opacity-100 transform scale-100 translate-y-0"
          leave-to-class="opacity-0 transform scale-95 -translate-y-4"
          move-class="transition-transform duration-300 ease-out"
        >
          <div 
            v-for="(group, index) in filteredGroups" 
            :key="`group-${group.id}`"
            :style="{ '--delay': `${index * 50}ms` }"
            class="group px-8 py-6 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 relative overflow-hidden transition-all duration-300 ease-out"
            :class="`delay-[var(--delay)]`"
          >
            <!--  hover border effect with gradient -->
            <div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
            
            <!-- Subtle background animation on hover -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"></div>
            
            <div class="grid grid-cols-12 gap-6 items-center relative z-10">
              <!-- Group Info -->
              <div class="col-span-4">
                <div class="flex items-start space-x-4">
                  <div class="relative">
                    <div class="w-3 h-3 rounded-full shadow-sm transition-all duration-300 group-hover:scale-110" :class="getStatusIndicator(group.status)"></div>
                    <div class="absolute inset-0 rounded-full animate-pulse transition-opacity duration-300 group-hover:opacity-75" :class="getStatusIndicator(group.status)" v-if="group.status === 'active'"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors duration-200 truncate">
                      {{ group.name }}
                    </h3>
                    <p class="text-xs text-gray-500 leading-relaxed overflow-hidden line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">{{ group.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Progress -->
              <div class="col-span-3">
                <div class="flex items-center space-x-3">
                  <div class="flex-1 relative">
                    <div v-if="userRole === 'teacher' && group.goals && group.goals.length > 0" class="flex w-full space-x-0.5">
                      <div v-for="goal in group.goals" :key="goal.id" class="flex-1 h-2 rounded-full overflow-hidden relative">
                        <div
                          :class="goal.progress && goal.progress.every((p: any) => p && p.is_completed) ? 'bg-emerald-500' : 'bg-gray-300'"
                          class="h-full w-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                    <div v-else class="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        class="h-2 rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover:scale-y-110"
                        :class="getProgressColor(group.progress)"
                        :style="{ width: `${group.progress}%` }"
                      >
                        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out"></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs font-bold text-gray-700 min-w-[2.5rem] text-right group-hover:text-gray-900 transition-colors duration-200">
                    {{ group.progress }}%
                  </div>
                </div>
              </div>

              <!-- Members + Help Requests -->
              <div class="col-span-2">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-all duration-200 group-hover:scale-105">
                    <svg class="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{{ group.memberCount }}</span>
                  <span v-if="userRole === 'teacher' && group.unresolvedHelpRequests > 0" class="flex items-center ml-2">
                    <svg class="w-4 h-4 text-amber-500 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-xs font-bold text-amber-700">{{ group.unresolvedHelpRequests }}</span>
                  </span>
                </div>
              </div>

              <!-- Actions with  animations -->
              <div class="col-span-3">
                <div class="flex items-center space-x-1.5">
                  <!-- Enter Group Button -->
                  <button
                    @click="$emit('enter-group', group.id)"
                    class="inline-flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg transition-all duration-200 border border-blue-200/50 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
                    title="Vstoupit do skupiny"
                  >
                    <svg class="w-4 h-4 transition-transform duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  
                  <!-- QR Code Button - Only for teachers with better QR icon -->
                  <button
                    v-if="userRole === 'teacher'"
                    @click="$emit('generate-qr', group)"
                    class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg transition-all duration-200 border border-emerald-200/50 hover:border-emerald-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
                    title="Generovat QR kód"
                  >
                    <svg class="w-4 h-4 transition-transform duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 14a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V4zM14 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM14 19a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-1 1h-6a1 1 0 01-1-1v-1zM19 14a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z"/>
                    </svg>
                  </button>
                  
                  <!-- Delete Group Button - Only for group creators with modal -->
                  <button
                    v-if="userRole === 'teacher' && canDeleteGroup(group)"
                    @click="openDeleteModal(group)"
                    class="inline-flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 rounded-lg transition-all duration-200 border border-red-200/50 hover:border-red-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
                    title="Smazat skupinu"
                  >
                    <svg class="w-4 h-4 transition-transform duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                  
                  <!-- Leave Group Button - Only for students -->
                  <button
                    v-if="userRole === 'student'"
                    @click="$emit('leave-group', group.id)"
                    class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg transition-all duration-200 border border-amber-200/50 hover:border-amber-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
                    title="Opustit skupinu"
                  >
                    <svg class="w-4 h-4 transition-transform duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Loading State -->
        <div v-if="isLoading" class="px-8 py-20 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-100/80 to-purple-100/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Načítání skupin...</h3>
          <p class="text-gray-500">Připravujeme data...</p>
        </div>

        <div v-else-if="filteredGroups.length === 0 && activeCategories.length > 0" class="px-8 py-16 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-gray-100/80 to-gray-200/80 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Žádné výsledky</h3>
          <p class="text-gray-500 mb-4">Pro vybrané filtry nebyly nalezeny žádné skupiny.</p>
          <button
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Vymazat filtry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && filteredGroups.length === 0" class="px-8 py-20 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-100/80 to-purple-100/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Žádné skupiny</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Vytvořte novou skupinu nebo se připojte k existující pomocí QR kódu a začněte spolupracovat.
          </p>
          <button
            @click="$emit('create-group')"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Vytvořit první skupinu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Explicit import for delete modal
import DeleteGroupModal from './DeleteGroupModal.vue'

interface Goal {
  id: string
  title: string
  description?: string
  goalType: 'boolean' | 'percentage'
  targetValue: number
  orderIndex: number
  progress?: any[]
}

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
  goals?: Goal[]
  unresolvedHelpRequests?: number
}

interface Props {
  groups: Group[]
  userRole?: string
  currentUserId?: string
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'generate-qr': [group: Group]
  'leave-group': [groupId: string]
  'delete-group': [groupId: string]
  'create-group': []
  'enter-group': [groupId: string]
}>()

// Category filtering
const categories = ref([
  { name: 'Matematika', icon: '📐' },
  { name: 'Fyzika', icon: '⚛️' },
  { name: 'Chemie', icon: '🧪' }
])

const activeCategories = ref<string[]>([])

const toggleCategory = (category: string) => {
  const index = activeCategories.value.indexOf(category)
  if (index > -1) {
    activeCategories.value.splice(index, 1)
  } else {
    activeCategories.value.push(category)
  }
}

const clearFilters = () => {
  activeCategories.value = []
}

const filteredGroups = computed(() => {
  if (activeCategories.value.length === 0) {
    return props.groups
  }
  return props.groups.filter(group => {
    return activeCategories.value.some(category => 
      group.name.toLowerCase().includes(category.toLowerCase())
    )
  })
})

const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500 ring-2 ring-emerald-200'
    case 'completed':
      return 'bg-blue-500 ring-2 ring-blue-200'
    case 'pending':
      return 'bg-amber-500 ring-2 ring-amber-200'
    default:
      return 'bg-gray-400 ring-2 ring-gray-200'
  }
}

const getProgressColor = (progress: number) => {
  if (progress === 100) {
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  } else if (progress >= 75) {
    return 'bg-gradient-to-r from-blue-500 to-blue-600'
  } else if (progress >= 50) {
    return 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  } else if (progress >= 25) {
    return 'bg-gradient-to-r from-purple-500 to-purple-600'
  } else {
    return 'bg-gradient-to-r from-gray-400 to-gray-500'
  }
}

// Delete modal state
const showDeleteModal = ref(false)
const groupToDelete = ref<Group | null>(null)

// Check if current user can delete the group
const canDeleteGroup = (group: Group) => {
  // Use the passed currentUserId prop instead of mock
  const currentUserId = props.currentUserId
  return currentUserId && group.teacherId === currentUserId
}

// Delete modal handlers
const openDeleteModal = (group: Group) => {
  groupToDelete.value = group
  showDeleteModal.value = true
}

const handleDeleteConfirm = (groupId: string) => {
  emit('delete-group', groupId)
  showDeleteModal.value = false
  groupToDelete.value = null
}
</script>