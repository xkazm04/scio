<template>
  <div class="relative">
    <!-- User avatar button -->
    <button
      @click="toggleMenu"
      class="group flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      :class="{ 'bg-gray-100/50 ring-2 ring-blue-200': isMenuOpen }"
    >
      <div class="relative">
        <img
          :src="user?.avatarUrl || defaultAvatar"
          :alt="user?.fullName || 'User avatar'"
          class="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200"
        />
        <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
      </div>
      <div class="hidden sm:block text-left min-w-0">
        <p class="text-sm font-semibold text-gray-900 truncate max-w-32">
          {{ user?.fullName || user?.email?.split('@')[0] || 'User' }}
        </p>
        <div class="flex items-center space-x-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="roleClasses">
            {{ getRoleLabel(user?.role) }}
          </span>
        </div>
      </div>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700"
        :class="{ 'rotate-180': isMenuOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 ring-1 ring-black/5"
        @click.stop
      >
        <!-- User info header -->
        <div class="px-4 py-4 border-b border-gray-100/50">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <img 
                :src="user?.avatarUrl || defaultAvatar" 
                :alt="user?.fullName || 'User avatar'"
                class="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
              <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ user?.fullName || user?.email?.split('@')[0] || 'User' }}
              </p>
              <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
              <span class="inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium"
                    :class="roleClasses">
                {{ getRoleLabel(user?.role) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Menu items -->
        <div class="py-2">
          <!-- Teacher-specific menu items -->
          <template v-if="user?.role === 'teacher'">
            <NuxtLink
              to="/teacher/classes"
              class="menu-item"
              @click="closeMenu"
            >
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">Moje třídy</div>
                <div class="text-xs text-gray-500">Spravovat skupiny</div>
              </div>
            </NuxtLink>
            
            <NuxtLink
              to="/teacher/students"
              class="menu-item"
              @click="closeMenu"
            >
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">Studenti</div>
                <div class="text-xs text-gray-500">Zobrazit pokrok</div>
              </div>
            </NuxtLink>
          </template>

          <!-- Groups menu item for all users -->
          <template v-if="user">
            <NuxtLink
              to="/groups"
              class="menu-item"
              @click="closeMenu"
            >
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ user?.role === 'teacher' ? 'Třídy' : 'Moje skupiny' }}</div>
                <div class="text-xs text-gray-500">{{ user?.role === 'teacher' ? 'Spravovat skupiny' : 'Pokračovat v učení' }}</div>
              </div>
            </NuxtLink>
          </template>

          <div class="border-t border-gray-100 my-2"></div>
          
          <button
            @click="signOut"
            :disabled="isSigningOut"
            class="menu-item text-red-600 hover:bg-red-50 disabled:opacity-50 w-full"
          >
            <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <div class="font-medium">
                <span v-if="!isSigningOut">Odhlásit se</span>
                <span v-else>Odhlašuji...</span>
              </div>
              <div class="text-xs text-gray-400">Ukončit relaci</div>
            </div>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { type UserWithProfile } from '~/lib/database/types';

interface Props {
  user: UserWithProfile | null;
}

const props = defineProps<Props>();

const supabase = useSupabaseClient();
const router = useRouter();

// Component state
const isMenuOpen = ref(false);
const isSigningOut = ref(false);

// Default avatar
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDhDOS42NTY4NSA4IDExIDYuNjU2ODUgMTEgNUMxMSAzLjM0MzE1IDkuNjU2ODUgMiA4IDJDNi4zNDMxNSAyIDUgMy4zNDMxNSA1IDVDNSA2LjY1Njg1IDYuMzQzMTUgOCA4IDhaIiBmaWxsPSIjOTE5N0E0Ii8+CjxwYXRoIGQ9Ik04IDEwQzEwLjIwOTEgMTAgMTIgMTEuNzkwOSAxMiAxNEgxNEMxNCAxMC4xMzQwIDEwLjg2NjAgNyA3IDdINi4wMDA0OUMzLjEzNDQ5IDcgMCAxMC4xMzQ0IDAgMTRIMkMwIDExLjc5MDkgMS43OTA5MSAxMCA0IDEwSDhaIiBmaWxsPSIjOTE5N0E0Ii8+Cjwvc3ZnPgo8L3N2Zz4K';

// Computed
const roleClasses = computed(() => {
  switch (props.user?.role) {
    case 'teacher':
      return 'bg-blue-100 text-blue-800';
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'student':
    default:
      return 'bg-green-100 text-green-800';
  }
});

// Methods
const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'teacher':
      return 'Učitel';
    case 'admin':
      return 'Administrátor';
    case 'student':
    default:
      return 'Student';
  }
};
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const signOut = async () => {
  try {
    isSigningOut.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      await router.push('/');
    }
  } catch (err) {
    console.error('Sign out error:', err);
  } finally {
    isSigningOut.value = false;
    closeMenu();
  }
};

// Close menu on route change
watch(() => router.currentRoute.value, () => {
  closeMenu();
});
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  background-color: transparent;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  transition: all 200ms;
}

.menu-item:hover {
  background-color: rgb(249 250 251);
}

.menu-item:hover .w-8 {
  transform: scale(1.05);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
</style>