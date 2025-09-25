<template>
  <div class="relative">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        
        <template v-if="options">
          <option
            v-for="option in options"
            :key="typeof option === 'string' ? option : option.value"
            :value="typeof option === 'string' ? option : option.value"
            :disabled="typeof option === 'object' && option.disabled"
          >
            {{ typeof option === 'string' ? option : option.label }}
          </option>
        </template>
        
        <slot v-else />
      </select>
      
      <!-- Dropdown arrow -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Helper text or error -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="helper" class="mt-1 text-sm text-gray-500">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  options?: (string | Option)[];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  size: 'md',
  variant: 'default',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  change: [event: Event];
}>();

// Generate unique ID
const selectId = computed(() => `select-${Math.random().toString(36).substring(2, 9)}`);

const selectClasses = computed(() => [
  'block w-full border rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed appearance-none pr-10',
  
  // Size variants
  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-3 py-2 text-sm': props.size === 'md',
    'px-4 py-3 text-base': props.size === 'lg',
  },
  
  // Variants
  {
    'border-gray-300 bg-white': props.variant === 'default' && !props.error,
    'border-gray-200 bg-gray-50': props.variant === 'filled' && !props.error,
    'border-red-300 bg-red-50': props.error,
  }
]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  let value: string | number = target.value;
  
  // Try to convert to number if the original value was numeric
  if (props.options) {
    const selectedOption = props.options.find(opt => 
      (typeof opt === 'string' ? opt : opt.value).toString() === value
    );
    if (selectedOption && typeof selectedOption === 'object' && typeof selectedOption.value === 'number') {
      value = parseFloat(value);
    }
  }
  
  emit('update:modelValue', value);
  emit('change', event);
};
</script>