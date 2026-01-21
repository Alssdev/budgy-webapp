<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)] p-8">
        <h1 class="text-3xl font-semibold text-slate-900">Create account</h1>
        <p class="text-sm text-slate-500 mb-6">Fill in your details below to join Budgy.</p>

        <form class="space-y-5" @submit.prevent="handleSignup">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Full name (optional)</label>
            <InputText v-model="name" placeholder="Jane Doe" fluid />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Email address</label>
            <InputText v-model="email" type="email" placeholder="you@example.com" required fluid />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Password</label>
            <Password v-model="password" placeholder="••••••••••" toggle-mask feedback fluid required />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Confirm password</label>
            <Password v-model="confirmPassword" placeholder="••••••••••" toggle-mask :feedback="false" fluid required />
          </div>

          <div v-if="formError" class="text-sm text-red-600">
            {{ formError }}
          </div>

          <div v-if="authStore.error" class="text-sm text-red-600">
            {{ authStore.error }}
          </div>

          <Button
            type="submit"
            :loading="authStore.isLoading"
            fluid
          >
            Sign up
          </Button>

          <div class="text-center text-sm text-slate-500">
            Already have an account?
            <NuxtLink to="/signin" class="font-semibold text-emerald-600 hover:text-emerald-500">Sign in</NuxtLink>
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
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref('')

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match'
    return
  }

  formError.value = ''
  try {
    await authStore.signup(email.value, password.value, name.value || undefined)
    await navigateTo('/')
  } catch {
    // Error is handled in store
  }
}
</script>
