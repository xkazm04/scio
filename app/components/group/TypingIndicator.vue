<template>
  <div class="mr-12 animate-fade-in">
    <div class="bg-white/60 border border-gray-200/70 rounded-2xl p-4 shadow-sm">
      <div class="flex items-center space-x-3">
        <!-- Simple Avatar -->
        <div 
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold',
            mode === 'ai' ? 'bg-purple-500' : 'bg-gray-500'
          ]"
        >
          {{ mode === 'ai' ? 'AI' : 'A' }}
        </div>
        
        <!-- Typing Content -->
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-700 mb-1">
            {{ mode === 'ai' ? 'AI Teacher' : 'Assistant' }}
          </div>
          
          <!-- Simple typing animation -->
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-1">
              <div 
                v-for="i in 3" 
                :key="i" 
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                :style="{ animationDelay: `${i * 150}ms` }"
              ></div>
            </div>
            <div class="text-xs text-gray-500">
              Typing...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode: 'standard' | 'ai'
}

defineProps<Props>()
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Simple bounce animation */
.animate-bounce {
  animation-duration: 1s;
}
</style>
