<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header" class="p-6 border-b border-gray-100">
      <slot name="header" />
    </div>
    
    <!-- Image -->
    <div v-if="image" class="relative overflow-hidden">
      <img
        :src="image"
        :alt="imageAlt || 'Card image'"
        class="w-full h-48 object-cover"
        :class="{ 'rounded-t-xl': rounded }"
      />
      <div v-if="badge" class="absolute top-3 right-3">
        <Badge :variant="badgeVariant">{{ badge }}</Badge>
      </div>
    </div>
    
    <!-- Content -->
    <div :class="contentClasses">
      <!-- Title -->
      <h3 v-if="title" :class="titleClasses">
        {{ title }}
      </h3>
      
      <!-- Subtitle -->
      <p v-if="subtitle" class="text-sm text-gray-500 mb-2">
        {{ subtitle }}
      </p>
      
      <!-- Default slot for content -->
      <div v-if="$slots.default" class="text-gray-600">
        <slot />
      </div>
      
      <!-- Description -->
      <p v-else-if="description" class="text-gray-600">
        {{ description }}
      </p>
    </div>
    
    <!-- Footer -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
    
    <!-- Actions -->
    <div v-else-if="$slots.actions" :class="footerClasses">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  shadow?: boolean;
  hover?: boolean;
  clickable?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: true,
  shadow: true,
  hover: false,
  clickable: false,
  badgeVariant: 'default',
});

const cardClasses = computed(() => [
  'bg-white overflow-hidden transition-all duration-200',
  
  // Border radius
  {
    'rounded-lg': props.rounded && props.size !== 'lg',
    'rounded-xl': props.rounded && props.size === 'lg',
  },
  
  // Variants
  {
    'border border-gray-200': props.variant === 'default' || props.variant === 'outline',
    'shadow-sm': props.variant === 'default' && props.shadow,
    'shadow-lg': props.variant === 'elevated',
    'border-2': props.variant === 'outline',
    'shadow-none border-none': props.variant === 'ghost',
  },
  
  // Interactive states
  {
    'hover:shadow-md hover:-translate-y-0.5': props.hover || props.clickable,
    'cursor-pointer': props.clickable,
  }
]);

const contentClasses = computed(() => [
  {
    'p-4': props.size === 'sm',
    'p-6': props.size === 'md',
    'p-8': props.size === 'lg',
  }
]);

const titleClasses = computed(() => [
  'font-semibold text-gray-900 mb-2',
  {
    'text-lg': props.size === 'sm',
    'text-xl': props.size === 'md',
    'text-2xl': props.size === 'lg',
  }
]);

const footerClasses = computed(() => [
  'border-t border-gray-100 bg-gray-50',
  {
    'p-4': props.size === 'sm',
    'p-6': props.size === 'md',
    'p-8': props.size === 'lg',
  }
]);
</script>