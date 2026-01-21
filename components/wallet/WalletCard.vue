<template>
  <button
    type="button"
    class="group w-full rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    @click="emit('select', wallet)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm',
            accent.bgClass,
            accent.textClass
          ]"
        >
          <span v-if="wallet.icon">{{ wallet.icon }}</span>
          <span v-else class="text-sm font-semibold">W</span>
        </div>
        <div>
          <p class="text-sm uppercase tracking-wide text-slate-500">Wallet</p>
          <p class="text-lg font-semibold text-slate-900">
            {{ wallet.name }}
          </p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs uppercase tracking-wide text-slate-400">Balance</p>
        <p class="text-lg font-semibold text-slate-900">
          {{ formattedBalance }}
        </p>
      </div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  wallet: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const accent = computed(() => useWalletAccent(props.wallet?.color))

const formattedBalance = computed(() => {
  const amount = Number(props.wallet.balance || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
})
</script>
