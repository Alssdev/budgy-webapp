import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Models } from 'appwrite'

type User = Models.User<Models.Preferences>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Get account from composable
  const { account } = useAppwrite()

  const login = async (email: string, password: string) => {
    if (!account) throw new Error('Account not initialized')

    isLoading.value = true
    error.value = null
    try {
      await account.createEmailPasswordSession(email, password)
      await fetchUser()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (email: string, password: string, name?: string) => {
    if (!account) throw new Error('Account not initialized')

    isLoading.value = true
    error.value = null
    try {
      await account.create('unique()', email, password, name)
      // Auto login after signup
      await login(email, password)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Signup failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    if (!account) return

    try {
      await account.deleteSession('current')
      user.value = null
    } catch (err: unknown) {
      console.error('Logout error:', err)
    }
  }

  const fetchUser = async () => {
    if (!account) return

    try {
      user.value = await account.get()
    } catch {
      user.value = null
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    fetchUser
  }
})