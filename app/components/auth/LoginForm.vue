<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Main card -->
    <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20">
      <!-- Logo section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Vítejte zpět
        </h1>
        <p class="text-gray-600">Přihlašte se pro pokračování ve vzdělávání</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600 mb-4"></div>
        <p class="text-gray-600 font-medium">Přihlašuji vás...</p>
        <p class="text-sm text-gray-500 mt-1">Prosím počkejte, přesměrovávám vás</p>
      </div>

      <!-- Auth buttons -->
      <div v-else class="space-y-6">
        <!-- Auth Mode Toggle -->
        <div class="flex bg-gray-100 rounded-xl p-1">
          <button
            @click="authMode = 'login'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
              authMode === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            Přihlášení
          </button>
          <button
            @click="authMode = 'signup'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
              authMode === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            Registrace
          </button>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="handleEmailAuth" class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="emailForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="váš@email.cz"
              :disabled="loading"
            >
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Heslo
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="emailForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :minlength="authMode === 'signup' ? 6 : undefined"
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :placeholder="authMode === 'signup' ? 'Minimálně 6 znaků' : 'Vaše heslo'"
                :disabled="loading"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                :disabled="loading"
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

          <!-- Full Name Field (only for signup) -->
          <div v-if="authMode === 'signup'">
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
              Celé jméno
            </label>
            <input
              id="fullName"
              v-model="emailForm.fullName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Jan Novák"
              :disabled="loading"
            >
          </div>

          <!-- Role Selection (only for signup) -->
          <div v-if="authMode === 'signup'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vyberte svou roli
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="emailForm.role = 'teacher'"
                :class="[
                  'p-3 rounded-xl border-2 transition-all duration-200 text-left',
                  emailForm.role === 'teacher'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                ]"
                :disabled="loading"
              >
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-semibold">👨‍🏫 Učitel</div>
                </div>
              </button>
              <button
                type="button"
                @click="emailForm.role = 'student'"
                :class="[
                  'p-3 rounded-xl border-2 transition-all duration-200 text-left',
                  emailForm.role === 'student'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                ]"
                :disabled="loading"
              >
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-semibold">🎓 Student</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !isEmailFormValid"
            class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <div v-if="loading" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ authMode === 'signup' ? 'Vytvářím účet...' : 'Přihlašuji...' }}</span>
            </div>
            <span v-else>{{ authMode === 'signup' ? 'Vytvořit účet' : 'Přihlásit se' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">nebo</span>
          </div>
        </div>

        <!-- Google OAuth Button -->
        <button
          @click="handleGoogleAuth"
          :disabled="loading"
          class="group w-full flex items-center justify-center px-4 py-3.5 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="group-hover:text-gray-900 transition-colors">Pokračovat s Google</span>
        </button>

        <!-- Error message -->
        <div v-if="error" class="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 leading-relaxed">
          Přihlášením souhlasíte s našimi 
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors">Podmínkami použití</a> 
          a 
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors">Zásadami ochrany osobních údajů</a>
        </p>
        
        <!-- Trust indicators -->
        <div class="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-400">
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
            </svg>
            <span>Zabezpečené</span>
          </div>
          <div class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Důvěryhodné</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/lib/database/types'

const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
const user = useSupabaseUser();

// Component state
const loading = ref(false);
const error = ref('');
const authMode = ref<'login' | 'signup'>('login');
const showPassword = ref(false);

// Email form state
const emailForm = reactive({
  email: '',
  password: '',
  fullName: '',
  role: 'teacher' as UserRole
});

// Form validation
const isEmailFormValid = computed(() => {
  if (authMode.value === 'login') {
    return emailForm.email && emailForm.password;
  } else {
    return emailForm.email && emailForm.password && emailForm.fullName && emailForm.role;
  }
});

// Redirect if already authenticated
watchEffect(() => {
  if (user.value) {
    navigateTo('/groups');
  }
});

// Handle email/password authentication
const handleEmailAuth = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    let result;
    
    if (authMode.value === 'login') {
      result = await signInWithEmail(emailForm.email, emailForm.password);
    } else {
      result = await signUpWithEmail({
        email: emailForm.email,
        password: emailForm.password,
        fullName: emailForm.fullName,
        role: emailForm.role
      });
    }
    
    if (result.error) {
      error.value = (result.error as any).message || 'Nastala chyba při autentizaci';
    } else if (authMode.value === 'signup' && (result as any).needsConfirmation) {
      // Show success message for signup
      error.value = '';
      alert('Registrace byla úspěšná! Zkontrolujte svůj email pro potvrzení účtu.');
    }
  } catch (err: any) {
    console.error('Email auth error:', err);
    error.value = err.message || 'Nastala neočekávaná chyba. Zkuste to prosím znovu.';
  } finally {
    loading.value = false;
  }
};

// Google OAuth sign in
const handleGoogleAuth = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const result = await signInWithGoogle();
    
    if (result.error) {
      console.error('Auth error:', result.error);
      error.value = (result.error as any).message || 'Nastala chyba při autentizaci';
    }
  } catch (err: any) {
    console.error('Sign in error:', err);
    error.value = 'Nastala neočekávaná chyba. Zkuste to prosím znovu.';
  } finally {
    loading.value = false;
  }
};

// Clear error when switching modes
watch(authMode, () => {
  error.value = '';
});

// SEO
useHead({
  title: 'Přihlášení',
  meta: [
    { name: 'description', content: 'Přihlaste se do svého SCIO účtu pomocí Google OAuth' }
  ]
});
</script>