<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M8 16h.01M16 8h.01M8 12h.01m0 4h.01M8 8h.01M12 4h.01"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Připojit se ke skupině</h1>
        <p class="text-lg text-gray-600">Naskenujte QR kód nebo zadejte token skupiny</p>
      </div>

      <!-- Join Form Card -->
      <div class="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden p-8">
        <div v-if="!joined">
          <!-- QR Scanner Section -->
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">Naskenovat QR kód</h2>
            <div class="bg-gray-100 rounded-2xl p-8 text-center">
              <div class="w-32 h-32 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M8 16h.01M16 8h.01M8 12h.01m0 4h.01M8 8h.01M12 4h.01"/>
                </svg>
              </div>
              <p class="text-gray-600">Připojte kameru pro skenování QR kódu</p>
              <button 
                class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                @click="enableQRScanner"
              >
                Zapnout kameru
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500 font-medium">nebo</span>
            </div>
          </div>

          <!-- Manual Entry Form -->
          <form @submit.prevent="handleJoin" class="space-y-6">
            <div>
              <label for="qrToken" class="block text-sm font-semibold text-gray-700 mb-2">
                Token skupiny
                <span v-if="form.qrToken" class="text-emerald-600 text-xs font-normal ml-2">✓ Vyplněno z odkazu</span>
              </label>
              <input
                id="qrToken"
                v-model="form.qrToken"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  form.qrToken ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300'
                ]"
                placeholder="Zadejte token skupiny (např. group_abc123)"
                :disabled="isLoading"
              >
              <p v-if="form.qrToken" class="text-xs text-emerald-600 mt-1">
                Token byl automaticky vyplněn z QR kódu. Můžete jej upravit nebo pokračovat.
              </p>
            </div>

            <div>
              <label for="nickname" class="block text-sm font-semibold text-gray-700 mb-2">
                Vaše přezdívka
              </label>
              <input
                id="nickname"
                v-model="form.nickname"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Zadejte své jméno (např. Honza Novák)"
                :disabled="isLoading"
              >
            </div>

            <!-- Error Display -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm text-red-700">{{ error }}</span>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading || !form.qrToken || !form.nickname"
              class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <div v-if="isLoading" class="flex items-center justify-center space-x-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Připojuji se...</span>
              </div>
              <span v-else>Připojit se ke skupině</span>
            </button>
          </form>
        </div>

        <!-- Success State -->
        <div v-else class="text-center py-8">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Úspěšně připojen!</h2>
          <p class="text-gray-600 mb-6">{{ successMessage }}</p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 class="font-semibold text-blue-900 mb-2">{{ joinedGroup?.name }}</h3>
            <p class="text-sm text-blue-700">{{ joinedGroup?.description }}</p>
          </div>

          <div class="flex space-x-3">
            <NuxtLink
              :to="`/groups/${joinedGroup?.id}`"
              class="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              Vstoupit do skupiny
            </NuxtLink>
            <NuxtLink
              to="/groups"
              class="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 text-center"
            >
              Moje skupiny
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Generate or get device ID from localStorage
const getDeviceId = () => {
  if (process.client) {
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 12)
      localStorage.setItem('deviceId', deviceId)
    }
    return deviceId
  }
  return null
}

// Form state
const form = reactive({
  qrToken: '',
  nickname: ''
})

const isLoading = ref(false)
const error = ref('')
const joined = ref(false)
const successMessage = ref('')
const joinedGroup = ref<any>(null)
const tokenFromUrl = ref(false)

// QR Scanner placeholder
const enableQRScanner = () => {
  alert('QR scanner功能将在后续版本中实现')
}

// Handle form submission
const handleJoin = async () => {
  if (!form.nickname) {
    error.value = 'Vyplňte prosím přezdívku'
    return
  }
  
  if (!form.qrToken) {
    error.value = 'Token skupiny je vyžadován'
    return
  }

  const deviceId = getDeviceId()
  if (!deviceId) {
    error.value = 'Nepodařilo se získat ID zařízení'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response: any = await $fetch('/api/groups/join', {
      method: 'POST',
      body: {
        qrToken: form.qrToken.trim(),
        deviceId: deviceId,
        nickname: form.nickname.trim()
      }
    })

    if (response.success) {
      joined.value = true
      joinedGroup.value = response.group
      successMessage.value = response.message
    }
  } catch (err: any) {
    error.value = err?.data?.message || 'Nastala chyba při připojování ke skupině'
  } finally {
    isLoading.value = false
  }
}

// Get QR token from URL (params or query)
const route = useRoute()
onMounted(() => {
  // Check route params first (for /join/:token routes)
  const paramToken = route.params.id as string
  const queryToken = route.query.token as string
  
  const urlToken = paramToken || queryToken
  
  if (urlToken) {
    form.qrToken = urlToken
    tokenFromUrl.value = true
    console.log('✅ Token loaded from URL:', form.qrToken)
  }
})

// SEO
useHead({
  title: 'Připojit se ke skupině',
  meta: [
    { name: 'description', content: 'Připojte se ke studijní skupině pomocí QR kódu' }
  ]
})
</script>