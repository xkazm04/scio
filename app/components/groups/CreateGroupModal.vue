<template>
  <Modal 
    v-model="isOpen" 
    title="Vytvořit novou skupinu"
    subtitle="Definujte název a cíl vaší studijní skupiny"
    size="md"
  >
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Group Name -->
      <div class="space-y-3">
        <label for="groupName" class="block text-sm font-bold text-gray-800">
          Název skupiny
          <span class="text-red-500 ml-1">*</span>
        </label>
        <div class="relative">
          <input
            id="groupName"
            v-model="formData.name"
            type="text"
            required
            placeholder="např. A2 - Kvadratické rovnice 1"
            class="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.name }"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg v-if="formData.name" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
        <p class="text-xs text-gray-500 leading-relaxed">
          Zvolte výstižný název, který popisuje předmět nebo téma skupiny
        </p>
      </div>

      <!-- Goal Description -->
      <div class="space-y-3">
        <label for="goalDescription" class="block text-sm font-bold text-gray-800">
          Popis cíle skupiny
          <span class="text-red-500 ml-1">*</span>
        </label>
        <div class="relative">
          <textarea
            id="goalDescription"
            v-model="formData.description"
            required
            rows="4"
            placeholder="např. vyřeší samostatně 3 různé kvadratické rovnice typu ax² + bx + c pomocí diskriminantu"
            class="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.description }"
          ></textarea>
          <div class="absolute right-3 bottom-3">
            <div class="text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {{ formData.description.length }}/500
            </div>
          </div>
        </div>
        <p v-if="errors.description" class="text-xs text-red-600 mt-1">{{ errors.description }}</p>
        <p class="text-xs text-gray-500 leading-relaxed">
          Popište konkrétní učební cíl nebo dovednost, kterou chcete ve skupině dosáhnout
        </p>
      </div>

      <!-- Additional Options -->
      <div class="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-100/50">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-blue-900 mb-2">Co se stane po vytvoření?</h4>
            <ul class="text-xs text-blue-800 space-y-1">
              <li class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Automaticky se stanete administrátorem skupiny
              </li>
              <li class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Získáte QR kód pro snadné pozvání ostatních
              </li>
              <li class="flex items-center">
                <svg class="w-3 h-3 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Budete moci spravovat členy a sledovat pokrok
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="props.errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800 font-medium">Chyba při vytváření skupiny</p>
            <p class="text-sm text-red-700 mt-1">{{ props.errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4 pt-6 border-t border-gray-100">
        <button
          type="button"
          @click="handleCancel"
          class="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold shadow-sm"
        >
          Zrušit
        </button>
        <button
          type="submit"
          :disabled="!isFormValid || isCreating"
          class="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span v-if="!isCreating" class="relative z-10">Vytvořit skupinu</span>
          <span v-else class="relative z-10 inline-flex items-center">
            <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Vytváří se...
          </span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
// Explicit import to fix component resolution
import Modal from '~/components/ui/Modal.vue'

interface Props {
  modelValue: boolean
  isCreating?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isCreating: false,
  errorMessage: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'create-group': [data: { name: string; description: string }]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref({
  name: '',
  description: ''
})

const errors = ref({
  name: '',
  description: ''
})

const isFormValid = computed(() => {
  return formData.value.name.trim().length > 0 && 
         formData.value.description.trim().length > 0 &&
         formData.value.description.length <= 500
})

const validateForm = () => {
  errors.value = { name: '', description: '' }
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Název skupiny je povinný'
  } else if (formData.value.name.length < 3) {
    errors.value.name = 'Název musí mít alespoň 3 znaky'
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = 'Popis cíle je povinný'
  } else if (formData.value.description.length < 10) {
    errors.value.description = 'Popis musí mít alespoň 10 znaků'
  } else if (formData.value.description.length > 500) {
    errors.value.description = 'Popis může mít maximálně 500 znaků'
  }
  
  return !errors.value.name && !errors.value.description
}

const handleSubmit = () => {
  if (validateForm() && isFormValid.value) {
    emit('create-group', {
      name: formData.value.name.trim(),
      description: formData.value.description.trim()
    })
  }
}

const handleCancel = () => {
  formData.value = { name: '', description: '' }
  errors.value = { name: '', description: '' }
  isOpen.value = false
}

// Reset form when modal is closed
watch(isOpen, (newValue) => {
  if (!newValue) {
    formData.value = { name: '', description: '' }
    errors.value = { name: '', description: '' }
  }
})
</script>