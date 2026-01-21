<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div
          :class="[
            'flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-sm',
            wallet.color || 'bg-slate-400'
          ]"
        >
          <span v-if="wallet.icon">{{ wallet.icon }}</span>
          <span v-else class="text-base font-semibold">W</span>
        </div>
        <div>
          <p class="text-sm uppercase tracking-wide text-slate-500">Selected wallet</p>
          <h2 class="text-2xl font-semibold text-slate-900">
            {{ wallet.name }}
          </h2>
        </div>
      </div>
      <div class="text-left sm:text-right">
        <p class="text-xs uppercase tracking-wide text-slate-400">Current balance</p>
        <p class="text-2xl font-semibold text-slate-900">
          {{ formattedBalance }}
        </p>
        <slot name="header-extra" />
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Recent activity</h3>
          <slot name="list-actions" />
        </div>
        <TransactionList :transactions="transactions" />
      </div>
      <div>
        <NewTransactionForm @submit="emit('submit', $event)" />
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  wallet: {
    type: Object,
    required: true
  },
  transactions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit'])

const formattedBalance = computed(() => {
  const amount = Number(props.wallet.balance || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
})
</script>
