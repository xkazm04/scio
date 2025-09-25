<template>
  <div 
    :class="[
      'w-full rounded-full h-1.5 transition-all duration-700 ease-out',
      progressClasses
    ]"
    :style="{ width: `${progress}%` }"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  size: 'md'
})

const progressClasses = computed(() => {
  const prog = props.progress
  return [
    prog >= 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
    prog >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
    prog >= 50 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' :
    prog >= 25 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
    'bg-gradient-to-r from-gray-400 to-gray-500'
  ]
})
</script>