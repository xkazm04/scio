<template>
  <div class="space-y-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Goal Title -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">
          Název úkolu *
        </label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="Např. Vyřeši kvadratické rovnice pomocí diskriminantu"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200"
        />
      </div>

      <!-- Goal Description -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">
          Popis úkolu
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Podrobný popis toho, co mají studenti udělat..."
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 resize-none"
        ></textarea>
      </div>

      <!-- Goal Type -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-3">
          Typ úkolu *
        </label>
        <div class="grid grid-cols-2 gap-4">
          <!-- Boolean Type -->
          <div
            @click="form.goalType = 'boolean'"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
              form.goalType === 'boolean' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                form.goalType === 'boolean' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              ]">
                <div v-if="form.goalType === 'boolean'" class="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">Ano/Ne úkol</div>
                <div class="text-xs text-gray-600">Buď splněno nebo nesplněno</div>
              </div>
            </div>
          </div>

          <!-- Percentage Type -->
          <div
            @click="form.goalType = 'percentage'"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
              form.goalType === 'percentage' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                form.goalType === 'percentage' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              ]">
                <div v-if="form.goalType === 'percentage'" class="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">Postupný úkol</div>
                <div class="text-xs text-gray-600">S číselnými kroky (1/5, 3/10, atd.)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Target Value (for percentage type) -->
      <div v-if="form.goalType === 'percentage'">
        <label class="block text-sm font-semibold text-gray-900 mb-2">
          Cílová hodnota *
        </label>
        <input
          v-model.number="form.targetValue"
          type="number"
          min="1"
          required
          placeholder="Např. 10 (pro 10 příkladů)"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200"
        />
        <p class="text-xs text-gray-500 mt-1">
          Kolik jednotek musí student dokončit pro splnění úkolu
        </p>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
        >
          Zrušit
        </button>
        <button
          type="submit"
          :disabled="!form.title.trim() || isSubmitting"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>{{ isSubmitting ? 'Vytvářím...' : 'Vytvořit úkol' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/helpers/goalHelpers'

const emit = defineEmits<{
  'goal-added': [goal: Goal]
  'cancel': []
}>()

// Form state
const form = reactive({
  title: '',
  description: '',
  goalType: 'boolean' as 'boolean' | 'percentage',
  targetValue: 1
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // Validate form
    if (!form.title.trim()) {
      throw new Error('Název úkolu je povinný')
    }

    if (form.goalType === 'percentage' && (!form.targetValue || form.targetValue < 1)) {
      throw new Error('Cílová hodnota musí být alespoň 1')
    }

    // Create goal object
    const newGoal: Goal = {
      id: `temp-${Date.now()}`, // Temporary ID
      type: form.goalType === 'boolean' ? 'boolean' : 'progress',
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      completed: false,
      progress: 0,
      current: 0,
      target: form.goalType === 'percentage' ? form.targetValue : 1
    }

    // Emit the new goal
    emit('goal-added', newGoal)
    
    // Reset form
    form.title = ''
    form.description = ''
    form.goalType = 'boolean'
    form.targetValue = 1

  } catch (error: any) {
    console.error('Error creating goal:', error)
    // You could add toast notification here
  } finally {
    isSubmitting.value = false
  }
}
</script>