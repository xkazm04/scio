<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtRouteAnnouncer />
    
    <!-- Header Navigation -->
    <Header :user="user" />
    
    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>
    
    <!-- Toast notifications (if you add them later) -->
    <!-- <Notifications /> -->
  </div>
</template>

<script setup lang="ts">
import { type UserWithProfile } from '~/lib/database/types';
import Header from '~/components/layout/Header.vue';

// Use the auth composable to get the properly loaded user with correct role
const { user } = useAuth();

// SEO and meta tags
useHead({
  title: 'SCIO',
  meta: [
    { name: 'description', content: 'A modern educational platform for teachers and students' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
});
</script>
