<template>
  <div class="relative">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Input field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Left icon -->
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconLeft" class="w-5 h-5 text-gray-400" />
      </div>
      
      <!-- Right icon or loading -->
      <div v-if="iconRight || loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div v-if="loading" class="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <component v-else-if="iconRight" :is="iconRight" class="w-5 h-5 text-gray-400" />
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
interface Props {
  modelValue?: string | number;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  loading?: boolean;
  iconLeft?: any;
  iconRight?: any;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  size: 'md',
  variant: 'default',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`);

const inputClasses = computed(() => [
  'block w-full border rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
  
  // Size variants
  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-3 py-2 text-sm': props.size === 'md',
    'px-4 py-3 text-base': props.size === 'lg',
  },
  
  // Icon spacing
  {
    'pl-10': props.iconLeft,
    'pr-10': props.iconRight || props.loading,
  },
  
  // Variants
  {
    'border-gray-300 bg-white': props.variant === 'default' && !props.error,
    'border-gray-200 bg-gray-50': props.variant === 'filled' && !props.error,
    'border-red-300 bg-red-50': props.error,
  }
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  
  if (props.type === 'number' && value !== '') {
    value = parseFloat(value);
  }
  
  emit('update:modelValue', value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>