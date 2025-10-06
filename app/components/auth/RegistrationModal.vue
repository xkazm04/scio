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

        <!-- Email Field (if not from OAuth) -->
        <div v-if="!user?.email">
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="váš@email.cz"
            :disabled="isLoading"
          >
        </div>

        <!-- Password Field (if not from OAuth) -->
        <div v-if="!user?.email">
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
            Heslo
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Minimálně 6 znaků"
              :disabled="isLoading"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              :disabled="isLoading"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12l6.878-6.878M21 21l-2.122-2.122m0 0L12 12"/>
              </svg>
            </button>
          </div>
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
                <div class="text-xl">👨‍🏫</div>
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
                <div class="text-xl">🎓</div>
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
          :disabled="isLoading || !form.fullName || !form.role || (!user?.email && (!form.email || !form.password))"
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
  email: props.user?.email || '',
  password: '',
  role: 'teacher' as UserRole
})

const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Handle form submission
const handleSubmit = async () => {
  // Validation
  if (!form.fullName || !form.role) {
    error.value = 'Vyplňte prosím všechna povinná pole'
    return
  }

  // If this is email registration (not OAuth), validate email and password
  if (!props.user?.email) {
    if (!form.email || !form.password) {
      error.value = 'Vyplňte prosím email a heslo'
      return
    }
    if (form.password.length < 6) {
      error.value = 'Heslo musí mít minimálně 6 znaků'
      return
    }
  }

  isLoading.value = true
  error.value = ''

  try {
    if (!props.user?.email) {
      // This is a direct email registration
      const { signUpWithEmail } = useAuth()
      
      const result = await signUpWithEmail({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: form.role
      })

      if (result.error) {
        throw new Error((result.error as any).message || 'Registration failed')
      }

      if ((result as any).needsConfirmation) {
        emit('profile-created', {
          email: form.email,
          fullName: form.fullName,
          role: form.role,
          needsConfirmation: true
        })
        return
      }

      // If successful and user is confirmed, they should be automatically logged in
      // The useAuth composable will handle creating their database profile
      emit('profile-created', {
        email: form.email,
        fullName: form.fullName,
        role: form.role,
        confirmed: true
      })
    } else {
      // This is OAuth completion
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
    }
  } catch (err: any) {
    console.error('Profile creation error:', err)
    error.value = err?.data?.message || err.message || 'Nastala chyba při vytváření profilu'
    emit('error', error.value)
  } finally {
    isLoading.value = false
  }
}
</script>