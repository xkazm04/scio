<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
      <div class="mb-6">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ getStatusTitle() }}
      </h1>
      
      <p class="text-gray-600 mb-6">
        {{ getStatusMessage() }}
      </p>

      <!-- Error state -->
      <div v-if="status === 'error'" class="space-y-4">
        <NuxtLink
          to="/auth/login"
          class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Zkusit znovu
        </NuxtLink>
        
        <NuxtLink
          to="/"
          class="w-full text-gray-600 hover:text-gray-900 transition-colors inline-block"
        >
          Domů
        </NuxtLink>
      </div>
    </div>

    <!-- Registration Modal -->
    <RegistrationModal
      v-if="showRegistration && currentUser"
      :user="currentUser"
      @profile-created="handleProfileCreated"
      @error="handleRegistrationError"
    />
  </div>
</template>

<script setup lang="ts">
import RegistrationModal from '~/components/auth/RegistrationModal.vue'

const supabase = useSupabaseClient()
const router = useRouter()

const status = ref<'processing' | 'success' | 'error' | 'registering'>('processing')
const errorMessage = ref('')
const showRegistration = ref(false)
const currentUser = ref<any>(null)

onMounted(async () => {
  try {
    // Handle the OAuth callback
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth callback error:', error)
      status.value = 'error'
      errorMessage.value = error.message
      return
    }

    if (session?.user) {
      currentUser.value = session.user
      
      // Check if user profile exists in database
      try {
        // Get the access token for API calls
        const accessToken = session.access_token;
        
        const profileResponse: any = await $fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (profileResponse.exists) {
          // User profile exists, redirect to dashboard
          status.value = 'success'
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          // User needs to complete registration
          status.value = 'registering'
          showRegistration.value = true
        }
      } catch (profileError: any) {
        console.log('Profile check failed, assuming user needs registration:', profileError)
        // If profile check fails, assume user needs registration
        status.value = 'registering'
        showRegistration.value = true
      }
    } else {
      // Wait and retry once for session
      setTimeout(async () => {
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        if (retrySession?.user) {
          currentUser.value = retrySession.user
          status.value = 'registering'
          showRegistration.value = true
        } else {
          status.value = 'error'
          errorMessage.value = 'Autentizace selhala - nebyla nalezena relace'
        }
      }, 1000)
    }
  } catch (err) {
    console.error('Callback processing error:', err)
    status.value = 'error'
    errorMessage.value = 'Nastala neočekávaná chyba'
  }
})

const handleProfileCreated = (user: any) => {
  showRegistration.value = false
  status.value = 'success'
  
  setTimeout(() => {
    router.push('/dashboard')
  }, 1500)
}

const handleRegistrationError = (error: string) => {
  status.value = 'error'
  errorMessage.value = error
  showRegistration.value = false
}

const getStatusTitle = () => {
  switch (status.value) {
    case 'processing':
      return 'Zpracovává se...'
    case 'registering':
      return 'Dokončování registrace...'
    case 'error':
      return 'Chyba autentizace'
    case 'success':
      return 'Úspěch!'
    default:
      return 'Zpracovává se...'
  }
}

const getStatusMessage = () => {
  switch (status.value) {
    case 'processing':
      return 'Dokončování přihlášení...'
    case 'registering':
      return 'Potřebujeme ještě pár informací pro dokončení vašeho profilu'
    case 'error':
      return errorMessage.value
    case 'success':
      return 'Přesměrovávání na dashboard...'
    default:
      return 'Zpracovává se...'
  }
}

// SEO
useHead({
  title: 'Autentizace',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})

// Define layout
definePageMeta({
  layout: false
})
</script>