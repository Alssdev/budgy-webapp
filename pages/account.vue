<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account
        </h2>
      </div>
      <div v-if="authStore.user" class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <div class="mt-1 text-sm text-gray-900">{{ authStore.user.name }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1 text-sm text-gray-900">{{ authStore.user.email }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <div class="mt-1 text-sm text-gray-900">
              {{ authStore.user.emailVerification ? 'Verified' : 'Not verified' }}
            </div>
          </div>
        </div>
        <div class="mt-6">
          <Button
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="handleLogout"
          >
            Logout
          </Button>
        </div>
      </div>
      <div v-else class="text-center">
        <p class="text-gray-600">You are not logged in.</p>
        <NuxtLink to="/signin" class="text-indigo-600 hover:text-indigo-500">
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/')
}
</script>