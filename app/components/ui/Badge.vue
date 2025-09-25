<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'sm',
  rounded: true,
  outline: false,
});

const badgeClasses = computed(() => [
  'inline-flex items-center font-medium',
  
  // Size variants
  {
    'px-1.5 py-0.5 text-xs': props.size === 'xs',
    'px-2 py-0.5 text-xs': props.size === 'sm',
    'px-2.5 py-1 text-sm': props.size === 'md',
    'px-3 py-1.5 text-sm': props.size === 'lg',
  },
  
  // Border radius
  {
    'rounded-md': !props.rounded,
    'rounded-full': props.rounded,
  },
  
  // Variant styles
  {
    // Default
    'bg-gray-100 text-gray-800': props.variant === 'default' && !props.outline,
    'border border-gray-300 text-gray-600': props.variant === 'default' && props.outline,
    
    // Primary (Scio blue)
    'bg-blue-100 text-blue-800': props.variant === 'primary' && !props.outline,
    'border border-blue-300 text-blue-600': props.variant === 'primary' && props.outline,
    
    // Secondary
    'bg-slate-100 text-slate-800': props.variant === 'secondary' && !props.outline,
    'border border-slate-300 text-slate-600': props.variant === 'secondary' && props.outline,
    
    // Success
    'bg-emerald-100 text-emerald-800': props.variant === 'success' && !props.outline,
    'border border-emerald-300 text-emerald-600': props.variant === 'success' && props.outline,
    
    // Warning
    'bg-amber-100 text-amber-800': props.variant === 'warning' && !props.outline,
    'border border-amber-300 text-amber-600': props.variant === 'warning' && props.outline,
    
    // Danger
    'bg-red-100 text-red-800': props.variant === 'danger' && !props.outline,
    'border border-red-300 text-red-600': props.variant === 'danger' && props.outline,
    
    // Info
    'bg-sky-100 text-sky-800': props.variant === 'info' && !props.outline,
    'border border-sky-300 text-sky-600': props.variant === 'info' && props.outline,
  }
]);
</script>