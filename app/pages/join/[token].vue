<template>
  <div>
    <!-- This will automatically redirect to the main join page with token as query param -->
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// Get the token from the route parameter
const token = route.params.token as string

// Redirect to the main join page with token as query parameter
if (token) {
  await navigateTo({
    path: '/join',
    query: { token }
  })
} else {
  // No token provided, just go to join page
  await navigateTo('/join')
}
</script>