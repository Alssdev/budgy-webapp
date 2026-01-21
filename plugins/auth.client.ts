export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Fetch current user on app load
  await authStore.fetchUser()
})