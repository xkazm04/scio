<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      @click="$emit('update:modelValue', false)"
    >
      <div 
        class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full overflow-hidden transform transition-all duration-300 ease-out"
        :class="sizeClasses"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-gray-100/50 relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {{ title }}
              </h3>
              <p v-if="subtitle" class="text-gray-600 mt-1 text-sm">{{ subtitle }}</p>
            </div>
            <button
              @click="$emit('update:modelValue', false)"
              class="w-10 h-10 rounded-xl bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group border border-gray-100"
            >
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'md':
      return 'max-w-lg'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    default:
      return 'max-w-lg'
  }
})
</script>

<style scoped>
@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: animate-in 0.2s ease-out;
}
</style>