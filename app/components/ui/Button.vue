<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="linkProps"
    @click="handleClick"
  >
    <div class="flex items-center justify-center">
      <!-- Loading spinner -->
      <div v-if="loading" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      
      <!-- Left icon -->
      <component
        v-if="iconLeft && !loading"
        :is="iconLeft"
        class="w-4 h-4 mr-2"
      />
      
      <!-- Content slot -->
      <span v-if="$slots.default">
        <slot />
      </span>
      
      <!-- Right icon -->
      <component
        v-if="iconRight && !loading"
        :is="iconRight"
        class="w-4 h-4 ml-2"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  href?: string;
  iconLeft?: any;
  iconRight?: any;
  fullWidth?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Determine component tag
const tag = computed(() => {
  if (props.to) return 'NuxtLink';
  if (props.href) return 'a';
  return 'button';
});

// Props for links
const linkProps = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return {};
});

// Dynamic classes
const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Size variants
  {
    'px-2 py-1 text-xs': props.size === 'xs',
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-sm': props.size === 'md',
    'px-6 py-3 text-base': props.size === 'lg',
    'px-8 py-4 text-lg': props.size === 'xl',
  },
  
  // Border radius
  {
    'rounded-md': !props.rounded,
    'rounded-full': props.rounded,
  },
  
  // Width
  {
    'w-full': props.fullWidth,
  },
  
  // Variant styles
  {
    // Primary (Scio blue)
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md': props.variant === 'primary',
    
    // Secondary (warm gray)
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': props.variant === 'secondary',
    
    // Outline
    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500': props.variant === 'outline',
    
    // Ghost
    'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': props.variant === 'ghost',
    
    // Danger
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md': props.variant === 'danger',
    
    // Success
    'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md': props.variant === 'success',
  }
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>