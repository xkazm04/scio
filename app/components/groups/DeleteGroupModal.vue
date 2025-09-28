<template>
  <Modal 
    v-model="isOpen" 
    title="Smazat skupinu"
    :subtitle="subtitleText"
    size="sm"
  >
    <div class="space-y-6">
      <!-- Warning Message -->
      <div class="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="text-sm text-red-800 leading-relaxed">
            <p class="font-semibold mb-1">Tato akce je nevratná!</p>
          </div>
        </div>
      </div>

      <!-- Group Info -->
      <div v-if="group" class="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">{{ group.name }}</h4>
            <p class="text-sm text-gray-600">{{ group.memberCount }} členů</p>
          </div>
        </div>
      </div>

      <!-- Confirmation Input -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-gray-700">
          Pro potvrzení napište název skupiny: <span class="font-bold text-red-600">{{ group?.name }}</span>
        </label>
        <input
          v-model="confirmationText"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          :placeholder="placeholderText"
          :disabled="isDeleting"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 pt-4">
        <button
          @click="$emit('update:modelValue', false)"
          :disabled="isDeleting"
          class="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zrušit
        </button>
        <button
          @click="handleDelete"
          :disabled="!canDelete || isDeleting"
          class="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          <div v-if="isDeleting" class="flex items-center justify-center space-x-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Mazání...</span>
          </div>
          <span v-else>Smazat skupinu</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// Explicit import to fix component resolution
import Modal from '~/components/ui/Modal.vue'

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

interface Props {
  modelValue: boolean
  group: Group | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm-delete': [groupId: string]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmationText = ref('')
const isDeleting = ref(false)

const subtitleText = computed(() => {
  return `Opravdu chcete smazat skupinu "${props.group?.name}"?`
})

const placeholderText = computed(() => {
  return `Napište "${props.group?.name}" pro potvrzení`
})

const canDelete = computed(() => {
  return confirmationText.value === props.group?.name
})

const handleDelete = async () => {
  if (!props.group || !canDelete.value) return
  
  isDeleting.value = true
  
  try {
    emit('confirm-delete', props.group.id)
    // Reset form
    confirmationText.value = ''
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    isDeleting.value = false
  }
}

// Reset form when modal closes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    confirmationText.value = ''
    isDeleting.value = false
  }
})
</script>