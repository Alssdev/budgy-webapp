<template>
  <div class="p-9">
    <h1 class="text-2xl font-semibold">
      {{ authStore.isAuthenticated ? `Hello ${authStore.user?.name || 'User'}!` : 'Hello world!' }}
    </h1>
    <div v-if="!authStore.isAuthenticated" class="mt-4 space-x-4">
      <NuxtLink to="/signin" class="text-indigo-600 hover:text-indigo-500">Sign in</NuxtLink>
      <NuxtLink to="/signup" class="text-indigo-600 hover:text-indigo-500">Sign up</NuxtLink>
    </div>
    <div v-else class="mt-4">
      <NuxtLink to="/account" class="text-indigo-600 hover:text-indigo-500">Account</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>
