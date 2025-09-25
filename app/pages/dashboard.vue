<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-12 border border-white/20 relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-blue-100/50 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        
        <div class="relative">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3.5M3 16.5h12"/>
                  </svg>
                </div>
                <div>
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Vítejte zpět, {{ user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Uživatel' }}!
                  </h1>
                  <p class="text-gray-600 text-lg">
                    {{ roleMessages[userRole] }}
                  </p>
                </div>
              </div>
              
              <!-- Quick actions for different roles -->
              <div class="flex flex-wrap gap-3 mt-6">
                <template v-if="userRole === 'teacher'">
                  <NuxtLink to="/teacher/classes/new" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Nová třída
                  </NuxtLink>
                  <NuxtLink to="/teacher/assignments/new" class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Nový úkol
                  </NuxtLink>
                </template>
                <template v-else>
                  <NuxtLink to="/groups" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
                    </svg>
                    Prohlédnout kurzy
                  </NuxtLink>
                  <NuxtLink to="/assignments" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    </svg>
                    Moje úkoly
                  </NuxtLink>
                </template>
              </div>
            </div>
            
            <!-- Time and date info -->
            <div class="text-right">
              <div class="text-sm text-gray-500 mb-1">Dnes</div>
              <div class="text-2xl font-bold text-gray-900">{{ new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' }) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="group">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center">
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-3xl font-bold text-gray-900">{{ stats.courses }}</h3>
                <p class="text-gray-600 font-medium">{{ userRole === 'teacher' ? 'Třídy' : 'Kurzy' }}</p>
                <div class="mt-1">
                  <span class="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">+2 tento měsíc</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center">
              <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-3xl font-bold text-gray-900">{{ stats.assignments }}</h3>
                <p class="text-gray-600 font-medium">Úkoly</p>
                <div class="mt-1">
                  <span class="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">8 dokončeno</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center">
              <div class="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-3xl font-bold text-gray-900">{{ stats.pending }}</h3>
                <p class="text-gray-600 font-medium">Vyřizuje se</p>
                <div class="mt-1">
                  <span class="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">Termín blíží se</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center">
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-3xl font-bold text-gray-900">{{ stats.students }}</h3>
                <p class="text-gray-600 font-medium">{{ userRole === 'teacher' ? 'Studenti' : 'Spolužáci' }}</p>
                <div class="mt-1">
                  <span class="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">12 aktivních</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Role-specific content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="xl:col-span-2">
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">Poslední aktivita</h2>
              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Zobrazit vše</button>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4 group">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div class="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 mb-1">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
                <div class="flex-shrink-0">
                  <button class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Overview -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900">Rychlé akce</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <template v-if="userRole === 'teacher'">
                <NuxtLink
                  to="/teacher/classes/new"
                  class="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="font-semibold text-gray-900">Vytvořit novou třídu</div>
                    <div class="text-sm text-gray-600">Začněte nový kurz</div>
                  </div>
                  <div class="group-hover:translate-x-1 transition-transform">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </NuxtLink>
                
                <NuxtLink
                  to="/teacher/assignments/new"
                  class="group flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="font-semibold text-gray-900">Vytvořit úkol</div>
                    <div class="text-sm text-gray-600">Nové zadání pro studenty</div>
                  </div>
                  <div class="group-hover:translate-x-1 transition-transform">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </NuxtLink>
              </template>
              
              <template v-else>
                <NuxtLink
                  to="/groups"
                  class="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
                    </svg>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="font-semibold text-gray-900">Prohlédnout kurzy</div>
                    <div class="text-sm text-gray-600">Najděte nové kurzy</div>
                  </div>
                  <div class="group-hover:translate-x-1 transition-transform">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </NuxtLink>
                
                <NuxtLink
                  to="/student/assignments"
                  class="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    </svg>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="font-semibold text-gray-900">Zobrazit úkoly</div>
                    <div class="text-sm text-gray-600">Nezůstan pozadu</div>
                  </div>
                  <div class="group-hover:translate-x-1 transition-transform">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Progress Overview -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900">Týdenní přehled</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">Dokončeno úkolů</span>
                <span class="text-2xl font-bold text-emerald-600">8/12</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style="width: 67%"></div>
              </div>
              
              <div class="flex items-center justify-between mt-4">
                <span class="text-sm font-medium text-gray-600">Navštíveno tříd</span>
                <span class="text-2xl font-bold text-blue-600">4/5</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style="width: 80%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { UserWithProfile, Role } from '~/lib/database/types';

// Authentication check
const user = useSupabaseUser();
const { userRole } = useAuth(); // Get role from auth composable

// Mock data (replace with real data from your API)
const stats = reactive({
  courses: 5,
  assignments: 12,
  pending: 3,
  students: 45,
});

const recentActivity = ref([
  { id: 1, title: 'New assignment submitted by John Doe', time: '2 minutes ago' },
  { id: 2, title: 'Math class scheduled for tomorrow', time: '1 hour ago' },
  { id: 3, title: 'Science project deadline reminder', time: '3 hours ago' },
  { id: 4, title: 'Welcome to the platform!', time: '1 day ago' },
]);

const roleMessages = {
  student: "Zde je váš studijní dashboard. Zkontrolujte své úkoly a pokrok v kurzech.",
  teacher: "Spravujte své třídy, sledujte pokrok studentů a vytvářejte nové úkoly.",
  admin: "Administrátorský dashboard. Monitorujte uživatele a aktivitu platformy.",
};

// SEO
useHead({
  title: 'Dashboard',
});

// Protect the route
definePageMeta({
  middleware: 'auth'
});
</script>