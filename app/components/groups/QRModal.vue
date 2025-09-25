<template>
  <Modal 
    v-model="isOpen" 
    title="QR kód pro vstup do skupiny"
    :subtitle="group?.name"
    size="sm"
  >
    <div class="text-center">
      <div class="mb-8">
        <p class="text-gray-600 text-sm leading-relaxed mb-6">
          Nechte ostatní naskenovat tento QR kód pro snadné připojení do skupiny
        </p>
        
        <!-- QR Code Container -->
        <div class="relative inline-block">
          <div class="w-56 h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-gray-200/60 shadow-inner relative overflow-hidden">
            <!-- Decorative corners -->
            <div class="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-500"></div>
            <div class="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-500"></div>
            <div class="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-500"></div>
            <div class="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-500"></div>
            
            <!-- QR Code Placeholder -->
            <div class="text-center">
              <div class="relative">
                <svg class="w-20 h-20 text-gray-400 mx-auto mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M8 16h.01M16 8h.01M8 12h.01m0 4h.01M8 8h.01M12 4h.01"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <p class="text-xs text-gray-500 font-medium">Generování QR kódu...</p>
            </div>
          </div>
          
          <!-- Glow effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10"></div>
        </div>
      </div>

      <!-- Token Info -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 mb-6 border border-gray-200/50">
        <div class="flex items-center justify-center space-x-2 mb-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H9"/>
          </svg>
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Kód skupiny</span>
        </div>
        <div class="font-mono text-lg font-bold text-gray-800 tracking-wider">
          {{ group?.qrToken }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="copyQRLink"
          class="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Zkopírovat odkaz
        </button>
        
        <button
          @click="shareQRCode"
          class="w-full inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
          </svg>
          Sdílet
        </button>
      </div>

      <!-- Instructions -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <p class="text-xs text-gray-500 leading-relaxed">
          Ostatní mohou naskenovat tento QR kód mobilním telefonem nebo zadat kód skupiny ručně pro připojení.
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// Explicit import to fix component resolution
import Modal from '~/components/ui/Modal.vue'

interface Group {
  id: number
  name: string
  description: string
  status: string
  progress: number
  memberCount: number
  qrToken: string
}

interface Props {
  modelValue: boolean
  group: Group | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const copyQRLink = () => {
  if (props.group) {
    const link = `${window.location.origin}/join/${props.group.qrToken}`
    navigator.clipboard.writeText(link).then(() => {
      // You could add a toast notification here
      console.log('QR link copied to clipboard')
    })
  }
}

const shareQRCode = () => {
  if (props.group && navigator.share) {
    const shareData = {
      title: `Připojte se do skupiny: ${props.group.name}`,
      text: `Připojte se do naší studijní skupiny pomocí tohoto odkazu!`,
      url: `${window.location.origin}/join/${props.group.qrToken}`
    }
    
    navigator.share(shareData).catch((error) => {
      console.log('Error sharing:', error)
      // Fallback to copying to clipboard
      copyQRLink()
    })
  } else {
    // Fallback for browsers that don't support sharing
    copyQRLink()
  }
}
</script>