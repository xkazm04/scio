<template>
  <div class="relative">
    <label
      v-if="label"
      :for="textareaId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="textareaId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :maxlength="maxLength"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Character count -->
      <div v-if="maxLength && showCount" class="absolute bottom-2 right-2 text-xs text-gray-400">
        {{ characterCount }}/{{ maxLength }}
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
  modelValue?: string;
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
  showCount: false,
  size: 'md',
  variant: 'default',
  resize: 'vertical',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

// Generate unique ID
const textareaId = computed(() => `textarea-${Math.random().toString(36).substring(2, 9)}`);

// Character count
const characterCount = computed(() => (props.modelValue || '').length);

const textareaClasses = computed(() => [
  'block w-full border rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
  
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
  },
  
  // Resize behavior
  {
    'resize-none': props.resize === 'none',
    'resize-y': props.resize === 'vertical',
    'resize-x': props.resize === 'horizontal',
    'resize': props.resize === 'both',
  },
  
  // Extra padding for character count
  {
    'pb-8': props.maxLength && props.showCount,
  }
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>