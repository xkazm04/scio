<template>
  <div class="text-center py-8">
    <!-- Simple Title -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        {{ groupDescription || 'Welcome to your study group' }}
      </h2>
      <p class="text-gray-600 text-sm">
        {{ mode === 'ai' ? 'AI Teacher is ready to help' : 'Assistant is ready to help' }}
      </p>
    </div>
    
    <!-- Simple Welcome Message -->
    <div class="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
      <div class="text-gray-700 text-sm leading-relaxed">
        Start by asking a question or sharing what you'd like to work on today.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode: 'standard' | 'ai'
  groupDescription?: string
}

defineProps<Props>()
</script>
