<template>
  <header class="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <div class="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">SCIO</span>
              <span class="text-xs text-gray-500 -mt-1">Vzděláváme pro budoucnost</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation (desktop) -->
        <nav v-if="user" class="hidden md:flex items-center space-x-1">
          <NuxtLink
            to="/dashboard"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Přehled
          </NuxtLink>
          
          <!-- Teacher navigation -->
          <template v-if="user.role === 'teacher'">
            <NuxtLink
              to="/teacher/classes"
              class="nav-link"
              active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Třídy
            </NuxtLink>
            <NuxtLink
              to="/teacher/students"
              class="nav-link"
              active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
              Studenti
            </NuxtLink>
          </template>
          
          <!-- Groups navigation for all users -->
          <template v-if="user && hasPermission('view_groups')">
            <NuxtLink
              to="/groups"
              class="nav-link"
              active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Skupiny
            </NuxtLink>
          </template>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-3">          
          <!-- Notifications (if logged in) -->
          <button
            v-if="user"
            class="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a2.999 2.999 0 00-2.121-.879H15M9 17h6m-6 0v-2a6 6 0 1112 0v2m-6 4H9m6-4v4H9v-4z"/>
            </svg>
            <!--  notification badge -->
            <span class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-4 bg-red-500 text-white rounded-full shadow-lg animate-pulse">
              3
            </span>
          </button>

          <!-- User menu or login button -->
          <UserMenu v-if="user" :user="user" />
          <div v-else class="flex items-center space-x-3">
            <NuxtLink
              to="/auth/login"
              class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Přihlášení
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            v-if="user"
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="user && isMobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <!-- Mobile search -->
            <div class="px-3 py-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
            
            <NuxtLink
              to="/dashboard"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="closeMobileMenu"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              Dashboard
            </NuxtLink>
            
            <!-- Teacher mobile navigation -->
            <template v-if="user.role === 'teacher'">
              <NuxtLink
                to="/teacher/classes"
                class="mobile-nav-link"
                active-class="mobile-nav-link-active"
                @click="closeMobileMenu"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Classes
              </NuxtLink>
              <NuxtLink
                to="/teacher/students"
                class="mobile-nav-link"
                active-class="mobile-nav-link-active"
                @click="closeMobileMenu"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                Students
              </NuxtLink>
            </template>
            
            <!-- Groups mobile navigation for all users -->
            <template v-if="user && hasPermission('view_groups')">
              <NuxtLink
                to="/groups"
                class="mobile-nav-link"
                active-class="mobile-nav-link-active"
                @click="closeMobileMenu"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Skupiny
              </NuxtLink>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { type UserWithProfile } from '~/lib/database/types';
import UserMenu from '~/components/auth/UserMenu.vue';

interface Props {
  user: UserWithProfile | null;
}

const props = defineProps<Props>();

// Use auth composable for permissions
const { hasPermission } = useAuth();

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Close mobile menu on route change
const route = useRoute();
watch(() => route.path, () => {
  closeMobileMenu();
});
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(75 85 99);
  background-color: transparent;
  transition: all 200ms;
  position: relative;
}

.nav-link:hover {
  color: rgb(17 24 39);
  background-color: rgb(243 244 246 / 0.5);
}

.nav-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255 / 0.8);
  font-weight: 600;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0.25rem;
  height: 0.25rem;
  background-color: rgb(37 99 235);
  border-radius: 9999px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgb(75 85 99);
  background-color: transparent;
  border-radius: 0.5rem;
  transition: all 200ms;
}

.mobile-nav-link:hover {
  color: rgb(17 24 39);
  background-color: rgb(249 250 251);
}

.mobile-nav-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
  font-weight: 600;
}
</style>