<template>
  <div 
    :class="[
      'relative flex-shrink-0',
      type === 'boolean' ? sizeConfig.checkbox + ' mt-1' : sizeConfig.circle
    ]"
  >
    <!-- Boolean goal (checkbox) -->
    <div v-if="type === 'boolean'" class="relative">
      <div
        :class="[
          sizeConfig.checkbox + ' rounded border-2 transition-all duration-300',
          completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'bg-white border-gray-300 group-hover:border-emerald-400'
        ]"
      >
        <svg 
          v-if="completed" 
          :class="[
            'text-white absolute inset-0.5',
            size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : 'w-3 h-3'
          ]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <!-- Completion animation -->
      <div v-if="completed" class="absolute inset-0 animate-ping">
        <div :class="[sizeConfig.checkbox + ' rounded border-2 border-emerald-400 opacity-50']"></div>
      </div>
    </div>
    
    <!-- Progress goal (circular progress) -->
    <div v-else class="relative">
      <svg :class="[sizeConfig.circle + ' transform -rotate-90']" viewBox="0 0 36 36">
        <path
          class="stroke-current text-gray-200"
          :stroke-width="sizeConfig.strokeWidth"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          :class="progressClasses"
          :stroke-width="sizeConfig.strokeWidth"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="`${progress || 0}, 100`"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span :class="[sizeConfig.text + ' font-bold text-gray-700']">{{ progress || 0 }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'boolean' | 'progress'
  completed?: boolean
  progress?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  completed: false,
  progress: 0,
  size: 'md'
})

// Size configurations
const sizeConfig = computed(() => {
  const configs = {
    xs: {
      checkbox: 'w-3 h-3',
      circle: 'w-5 h-5',
      text: 'text-xs',
      strokeWidth: '2'
    },
    sm: {
      checkbox: 'w-4 h-4',
      circle: 'w-6 h-6',
      text: 'text-xs',
      strokeWidth: '2.5'
    },
    md: {
      checkbox: 'w-5 h-5',
      circle: 'w-8 h-8',
      text: 'text-xs',
      strokeWidth: '3'
    },
    lg: {
      checkbox: 'w-6 h-6',
      circle: 'w-10 h-10',
      text: 'text-sm',
      strokeWidth: '3.5'
    }
  }
  return configs[props.size]
})

const progressClasses = computed(() => {
  const prog = props.progress || 0
  return [
    'stroke-current transition-all duration-1000 ease-out',
    prog >= 100 ? 'text-emerald-500' :
    prog >= 75 ? 'text-blue-500' :
    prog >= 50 ? 'text-indigo-500' :
    prog >= 25 ? 'text-purple-500' :
    'text-gray-400'
  ].join(' ')
})
</script>