<template>
  <div>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

// Redirect if already authenticated
const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard');
  }
});

// SEO
useHead({
  title: 'Sign In',
});

// Define layout
definePageMeta({
  layout: false // Use no layout for login page
});
</script>