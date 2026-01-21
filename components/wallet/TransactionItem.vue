<template>
  <div class="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-4">
    <div class="space-y-1">
      <p class="text-sm font-semibold text-slate-900">
        {{ transaction.description || 'Transaction' }}
      </p>
      <p class="text-xs text-slate-500">
        {{ formattedTimestamp }}
      </p>
    </div>
    <div class="text-right">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
          transaction.type === 'income'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-rose-100 text-rose-700'
        ]"
      >
        {{ transaction.type === 'income' ? 'Incoming' : 'Outgoing' }}
      </span>
      <p class="mt-2 text-base font-semibold text-slate-900">
        {{ signedAmount }}
      </p>
      <p class="text-xs text-slate-500">
        Balance {{ formattedResultingBalance }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const formattedTimestamp = computed(() => {
  if (!props.transaction.timestamp) return 'Just now'
  const date = new Date(props.transaction.timestamp)
  if (Number.isNaN(date.getTime())) return 'Just now'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
})

const signedAmount = computed(() => {
  const amount = Number(props.transaction.amount || 0)
  const sign = props.transaction.type === 'income' ? '+' : '-'
  return `${sign}${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(amount))}`
})

const formattedResultingBalance = computed(() => {
  const amount = Number(props.transaction.resultingBalance || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
})
</script>
