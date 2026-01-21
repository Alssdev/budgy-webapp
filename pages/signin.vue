<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)] p-8">
        <h1 class="text-3xl font-semibold text-slate-900">Sign in</h1>

        <p class="text-sm text-slate-500 mb-6">Please enter your details.</p>

        <form class="space-y-5" @submit.prevent="handleSignin">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Email address</label>
            <InputText
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              fluid
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Password</label>
            <Password
              v-model="password"
              placeholder="••••••••••"
              toggle-mask
              feedback
              required
              fluid
            />
          </div>

          <div v-if="authStore.error" class="text-sm text-red-600">
            {{ authStore.error }}
          </div>

          <div class="flex items-center justify-between text-sm text-slate-600">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
              Remember me
            </label>
            <NuxtLink to="/forgot-password" class="font-semibold text-emerald-600 hover:text-emerald-500">Forgot password?</NuxtLink>
          </div>

          <Button
            type="submit"
            :loading="authStore.isLoading"
            fluid
          >
            Sign in
          </Button>

          <div class="text-center text-sm text-slate-500">
            Don't have an account?
            <NuxtLink to="/signup" class="font-semibold text-emerald-600 hover:text-emerald-500">Sign up</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleSignin = async () => {
  try {
    await authStore.login(email.value, password.value)
    await navigateTo('/')
  } catch {
    // Error is handled in store
  }
}
</script>
