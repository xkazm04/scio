<template>
  <div class="mr-8 animate-fade-in">
    <div class="relative">
      <div class="bg-gradient-to-br from-white/95 to-gray-50/80 border border-gray-200/60 rounded-2xl p-4 shadow-sm overflow-hidden">
        <!-- Subtle linear pattern -->
        <div class="absolute inset-0 opacity-20 bg-gradient-to-br from-gray-100/20 to-transparent" 
             style="background-image: linear-gradient(135deg, transparent 45%, rgba(99, 102, 241, 0.02) 50%, transparent 55%); background-size: 30px 30px;"></div>
        
        <!-- Left accent line -->
        <div 
          :class="[
            'absolute left-0 top-3 bottom-3 w-1 rounded-r',
            mode === 'ai' 
              ? 'bg-gradient-to-b from-purple-500 to-violet-600' 
              : 'bg-gradient-to-b from-gray-500 to-gray-600'
          ]"
        ></div>

        <div class="relative ml-3 flex items-center space-x-3">
          <!-- Elegant Avatar -->
          <div 
            :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold border shadow-sm',
              mode === 'ai' 
                ? 'bg-gradient-to-br from-purple-500 to-violet-600 border-purple-400/60' 
                : 'bg-gradient-to-br from-gray-500 to-gray-600 border-gray-400/60'
            ]"
          >
            {{ mode === 'ai' ? 'AI' : 'A' }}
          </div>
          
          <!-- Typing Content -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <div class="text-sm font-semibold text-gray-700">
                {{ mode === 'ai' ? 'AI Učitel' : 'Asistent' }}
              </div>
              <div 
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium border',
                  mode === 'ai' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                ]">
                {{ mode === 'ai' ? '🤖 AI' : '📚' }}
              </div>
            </div>
            
            <!-- Elegant typing animation -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-1">
                <div 
                  v-for="i in 3" 
                  :key="i" 
                  :class="[
                    'w-2 h-2 rounded-full animate-bounce',
                    mode === 'ai' ? 'bg-purple-400' : 'bg-gray-400'
                  ]"
                  :style="{ animationDelay: `${i * 150}ms` }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 font-medium">
                Píše odpověď...
              </div>
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
