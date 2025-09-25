<template>
  <div :class="containerClasses">
    <!-- Loading spinner -->
    <div v-if="variant === 'spinner'" :class="spinnerClasses"></div>
    
    <!-- Pulse loading (skeleton) -->
    <div v-else-if="variant === 'pulse'" :class="pulseClasses"></div>
    
    <!-- Dots loading -->
    <div v-else-if="variant === 'dots'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        :class="[dotClasses, `animate-bounce`]"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>
    
    <!-- Bars loading -->
    <div v-else-if="variant === 'bars'" class="flex space-x-1 items-end">
      <div
        v-for="i in 4"
        :key="i"
        :class="[barClasses, 'animate-pulse']"
        :style="{ 
          animationDelay: `${(i - 1) * 0.1}s`,
          height: `${20 + (i % 2) * 10}px`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  center?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  color: 'primary',
  center: false,
});

const containerClasses = computed(() => [
  {
    'flex justify-center items-center': props.center,
  }
]);

const spinnerClasses = computed(() => [
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  
  // Size variants
  {
    'w-3 h-3': props.size === 'xs',
    'w-4 h-4': props.size === 'sm',
    'w-6 h-6': props.size === 'md',
    'w-8 h-8': props.size === 'lg',
    'w-12 h-12': props.size === 'xl',
  },
  
  // Color variants
  {
    'text-blue-600': props.color === 'primary',
    'text-gray-600': props.color === 'secondary',
    'text-white': props.color === 'white',
  }
]);

const pulseClasses = computed(() => [
  'animate-pulse bg-gray-300 rounded',
  
  // Size variants
  {
    'h-4': props.size === 'xs',
    'h-5': props.size === 'sm',
    'h-6': props.size === 'md',
    'h-8': props.size === 'lg',
    'h-12': props.size === 'xl',
  }
]);

const dotClasses = computed(() => [
  'rounded-full',
  
  // Size variants
  {
    'w-1 h-1': props.size === 'xs',
    'w-1.5 h-1.5': props.size === 'sm',
    'w-2 h-2': props.size === 'md',
    'w-3 h-3': props.size === 'lg',
    'w-4 h-4': props.size === 'xl',
  },
  
  // Color variants
  {
    'bg-blue-600': props.color === 'primary',
    'bg-gray-600': props.color === 'secondary',
    'bg-white': props.color === 'white',
  }
]);

const barClasses = computed(() => [
  'bg-current rounded-sm',
  
  // Width variants
  {
    'w-0.5': props.size === 'xs',
    'w-1': props.size === 'sm',
    'w-1.5': props.size === 'md',
    'w-2': props.size === 'lg',
    'w-3': props.size === 'xl',
  },
  
  // Color variants
  {
    'text-blue-600': props.color === 'primary',
    'text-gray-600': props.color === 'secondary',
    'text-white': props.color === 'white',
  }
]);
</script>