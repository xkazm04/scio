<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Dokončit registraci</h2>
        <p class="text-gray-600">Potřebujeme ještě pár informací pro váš profil</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Full Name -->
        <div>
          <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">
            Celé jméno
          </label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Zadejte své celé jméno"
            :disabled="isLoading"
          >
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-4">
            Vyberte svou roli
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.role = 'teacher'"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                form.role === 'teacher'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
              :disabled="isLoading"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">Učitel</div>
                  <div class="text-xs text-gray-500">Vytvářím a spravuji skupiny</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              @click="form.role = 'student'"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                form.role === 'student'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
              :disabled="isLoading"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold">Student</div>
                  <div class="text-xs text-gray-500">Připojuji se ke skupinám</div>
                </div>
              </div>
            </button>
          </div>
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

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading || !form.fullName || !form.role"
          class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          <div v-if="isLoading" class="flex items-center justify-center space-x-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Vytváří se profil...</span>
          </div>
          <span v-else>Dokončit registraci</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/lib/database/types'

interface Props {
  user: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'profile-created': [user: any]
  'error': [error: string]
}>()

// Form state
const form = reactive({
  fullName: props.user?.user_metadata?.full_name || '',
  role: 'teacher' as UserRole
})

const isLoading = ref(false)
const error = ref('')

// Handle form submission
const handleSubmit = async () => {
  if (!form.fullName || !form.role) {
    error.value = 'Vyplňte prosím všechna povinná pole'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Get the user session to extract access token
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('No access token available')
    }

    const response = await $fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: {
        fullName: form.fullName,
        role: form.role,
        email: props.user?.email, // Pass the OAuth email
        avatarUrl: props.user?.user_metadata?.avatar_url
      }
    }) as { user: any }

    emit('profile-created', response.user)
  } catch (err: any) {
    console.error('Profile creation error:', err)
    error.value = err?.data?.message || 'Nastala chyba při vytváření profilu'
    emit('error', error.value)
  } finally {
    isLoading.value = false
  }
}
</script>