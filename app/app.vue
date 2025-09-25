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

// Get the user from Supabase
const supabaseUser = useSupabaseUser();
const user = ref<UserWithProfile | null>(null);

// Sync Supabase user with our user type
watchEffect(() => {
  if (supabaseUser.value) {
    // In a real app, you'd fetch the full user profile from your database here
    // For now, we'll create a basic user object from Supabase data
    user.value = {
      id: supabaseUser.value.id,
      email: supabaseUser.value.email || '',
      fullName: supabaseUser.value.user_metadata?.full_name || supabaseUser.value.email?.split('@')[0] || 'User',
      avatarUrl: supabaseUser.value.user_metadata?.avatar_url || null,
      role: 'student', // Default role - you'd determine this from your database
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    user.value = null;
  }
});

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
