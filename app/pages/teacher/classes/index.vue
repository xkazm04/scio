<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-12">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-blue-100/50 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
          
          <div class="relative">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                  </svg>
                </div>
                <div>
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Moje třídy</h1>
                  <p class="text-gray-600 text-lg">Spravujte své třídy a sledujte pokrok studentů</p>
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div class="text-sm text-gray-500">Aktivních tříd</div>
                  <div class="text-2xl font-bold text-blue-600">{{ classes.filter(c => c.status === 'Active').length }}</div>
                </div>
                
                <NuxtLink
                  to="/teacher/classes/new"
                  class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Vytvořit novou třídu
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Classes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="classItem in classes" :key="classItem.id" class="group">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <!-- Class header with gradient -->
            <div class="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-500"></div>
            
            <div class="p-8">
              <div class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ classItem.name }}</h3>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {{ getStatusText(classItem.status) }}
                  </span>
                </div>
              </div>
              
              <p class="text-gray-600 text-sm mb-6 leading-relaxed">{{ classItem.description }}</p>
              
              <!-- Class statistics -->
              <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span class="text-lg font-bold text-white">{{ classItem.studentCount }}</span>
                  </div>
                  <div class="text-xs text-gray-500 font-medium">Studentů</div>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span class="text-lg font-bold text-white">{{ classItem.assignmentCount }}</span>
                  </div>
                  <div class="text-xs text-gray-500 font-medium">Úkolů</div>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-xs text-gray-500 font-medium">Aktivní</div>
                </div>
              </div>
              
              <!-- Class details -->
              <div class="space-y-3 mb-8">
                <div class="flex items-center text-sm text-gray-600">
                  <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span class="font-medium">{{ classItem.schedule }}</span>
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="flex gap-3">
                <NuxtLink
                  :to="`/teacher/classes/${classItem.id}`"
                  class="flex-1 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Zobrazit třídu
                </NuxtLink>
                <button class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Spravovat
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="classes.length === 0" class="col-span-full">
          <div class="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Žádné třídy zatim</h3>
            <p class="text-lg text-gray-500 mb-8">Začněte vytvořením své první třídy.</p>
            <NuxtLink
              to="/teacher/classes/new"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Vytvořit novou třídu
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock data - replace with real data from your API
const classes = ref([
  {
    id: '1',
    name: 'Advanced Mathematics',
    description: 'Calculus and advanced mathematical concepts for senior students',
    status: 'Active',
    studentCount: 24,
    assignmentCount: 8,
    schedule: 'Mon, Wed, Fri 10:00 AM'
  },
  {
    id: '2',
    name: 'Physics 101',
    description: 'Introduction to fundamental physics principles',
    status: 'Active',
    studentCount: 18,
    assignmentCount: 5,
    schedule: 'Tue, Thu 2:00 PM'
  },
  {
    id: '3',
    name: 'Chemistry Lab',
    description: 'Hands-on chemistry experiments and lab work',
    status: 'Scheduled',
    studentCount: 12,
    assignmentCount: 3,
    schedule: 'Wed 3:00 PM'
  }
]);

// Helper function for Czech status text
const getStatusText = (status) => {
  switch (status) {
    case 'Active':
      return 'Aktivní';
    case 'Scheduled':
      return 'Naplánovaná';
    case 'Completed':
      return 'Dokončená';
    default:
      return status;
  }
};

// SEO
useHead({
  title: 'My Classes',
});

// Protect the route for teachers
definePageMeta({
  middleware: 'teacher'
});
</script>