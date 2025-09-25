<template>
  <div :class="containerClasses">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 :class="titleClasses">
        {{ title }}
      </h1>
      <slot name="actions" />
    </div>
    
    <!-- Breadcrumbs -->
    <nav v-if="breadcrumbs?.length" class="mb-6">
      <ol class="flex items-center space-x-2 text-sm text-gray-500">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
          <template v-if="index > 0">
            <svg class="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </template>
          
          <NuxtLink
            v-if="crumb.to && index < breadcrumbs.length - 1"
            :to="crumb.to"
            class="hover:text-gray-700 transition-colors"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span
            v-else
            :class="{ 'text-gray-900 font-medium': index === breadcrumbs.length - 1 }"
          >
            {{ crumb.label }}
          </span>
        </li>
      </ol>
    </nav>
    
    <!-- Subtitle -->
    <p v-if="subtitle" class="text-lg text-gray-600 mb-8">
      {{ subtitle }}
    </p>
    
    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  breadcrumbs?: Breadcrumb[];
  centered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  maxWidth: '7xl',
  centered: false,
});

const containerClasses = computed(() => [
  'mx-auto px-4 sm:px-6 lg:px-8 py-8',
  
  // Max width variants
  {
    'max-w-sm': props.maxWidth === 'sm',
    'max-w-md': props.maxWidth === 'md',
    'max-w-lg': props.maxWidth === 'lg',
    'max-w-xl': props.maxWidth === 'xl',
    'max-w-2xl': props.maxWidth === '2xl',
    'max-w-4xl': props.maxWidth === '4xl',
    'max-w-6xl': props.maxWidth === '6xl',
    'max-w-7xl': props.maxWidth === '7xl',
    'max-w-full': props.maxWidth === 'full',
  }
]);

const titleClasses = computed(() => [
  'font-bold text-gray-900',
  
  // Size variants
  {
    'text-xl': props.size === 'sm',
    'text-2xl': props.size === 'md',
    'text-3xl': props.size === 'lg',
  }
]);

const contentClasses = computed(() => [
  {
    'text-center': props.centered,
  }
]);
</script>