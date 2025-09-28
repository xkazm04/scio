<template>
  <Modal 
    v-model="isOpen" 
    title="Opustit skupinu"
    :subtitle="group?.name"
    size="sm"
  >
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          Opravdu chcete opustit skupinu?
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Po opuštění skupiny ztratíte přístup ke všem materiálům, diskuzím a svému pokroku v této skupině. 
          Tuto akci nelze vrátit zpět.
        </p>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="text-sm text-amber-800">
            <p class="font-semibold mb-1">Budete muset být znovu přizváni</p>
            <p>Pokud se budete chtít do skupiny vrátit, bude vás muset někdo z členů znovu pozvat.</p>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="handleCancel"
          class="flex-1 px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
        >
          Zrušit
        </button>
        <button
          @click="handleConfirm"
          :disabled="isLeaving"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLeaving">Opustit skupinu</span>
          <span v-else class="inline-flex items-center">
            <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Opouštím...
          </span>
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
  isLeaving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLeaving: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm-leave': [groupId: string]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleCancel = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  if (props.group) {
    emit('confirm-leave', props.group.id)
  }
}
</script>