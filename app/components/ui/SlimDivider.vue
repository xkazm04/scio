<template>
  <div class="relative flex items-center justify-center py-4">
    <!-- Gradient divider line -->
    <div class="absolute inset-0 flex items-center">
      <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent"></div>
    </div>
    
    <!-- Label container -->
    <div class="relative bg-white px-4">
      <div class="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <div class="w-2 h-2 rounded-full bg-blue-400/60"></div>
        <span>{{ label }}</span>
        <div v-if="count !== undefined" class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
          {{ count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  count?: number
}

defineProps<Props>()
</script>

<style scoped>
/* Additional styling if needed */
</style>
