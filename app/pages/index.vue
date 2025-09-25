<template>
  <div class="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 min-h-screen relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Hero Section -->
    <div class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center">
          <!-- Logo animation -->
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span class="bg-gradient-to-r from-gray-900 via-blue-900 to-blue-900 bg-clip-text text-transparent">
              Vzděláváme pro
            </span>
            <br>
            <span class="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 bg-clip-text text-transparent">
              budoucnost
            </span>
          </h1>
          <p class="text-xl lg:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Moderní vzdělávací platforma spojující učitele a studenty. Navrženo pro efektivní učení a spolupráci v digitálním věku.
          </p>
          
          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NuxtLink
              to="/auth/login"
              class="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Začít hned</span>
              <div class="ml-2 group-hover:translate-x-1 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </div>
            </NuxtLink>
            
            <button class="group bg-white/80 backdrop-blur-xl text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-white/20">
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Zjistit více</span>
            </button>
          </div>
          
          <!-- Stats section -->
          <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">30+</div>
              <div class="text-gray-600 font-medium">Let zkušeností</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">100k+</div>
              <div class="text-gray-600 font-medium">Spokojených studentů</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div class="text-gray-600 font-medium">Škol v síti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 relative overflow-hidden">
      <!-- Background patterns -->
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-600/90"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div class="text-center">
          <h2 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            Připraveni začít?
          </h2>
          <p class="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Přidejte se k tisícům pedagogů a studentů, kteří již využívají EduPlatform
          </p>          
          <!-- Trust indicators -->
          <div class="mt-12 flex items-center justify-center space-x-8 text-blue-100">
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <span>Bezpečné</span>
            </div>
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Ověřeno</span>
            </div>
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Zdarma začít</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'EduPlatform - Learning Made Simple',
  meta: [
    { name: 'description', content: 'A modern educational platform connecting teachers and students for effective learning and collaboration.' }
  ]
});
</script>