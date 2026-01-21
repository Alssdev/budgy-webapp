<template>
  <form class="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5" @submit.prevent="submitForm">
    <div>
      <p class="text-sm font-semibold text-slate-900">New transaction</p>
      <p class="text-xs text-slate-500">Add money in or record a spend.</p>
    </div>
    <div class="flex items-center gap-2 rounded-full bg-slate-100 p-1">
      <button
        type="button"
        class="flex-1 rounded-full px-3 py-2 text-xs font-semibold transition"
        :class="type === 'income' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
        @click="type = 'income'"
      >
        Incoming
      </button>
      <button
        type="button"
        class="flex-1 rounded-full px-3 py-2 text-xs font-semibold transition"
        :class="type === 'expense' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'"
        @click="type = 'expense'"
      >
        Outgoing
      </button>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="space-y-1 text-sm text-slate-600">
        Amount
        <input
          v-model="amount"
          type="number"
          inputmode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
      </label>
      <label class="space-y-1 text-sm text-slate-600">
        Description
        <input
          v-model.trim="description"
          type="text"
          placeholder="Groceries, paycheck"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
      </label>
    </div>
    <p class="text-xs text-slate-500">
      Tip: use a short description so transactions stay scannable.
    </p>
    <button
      type="submit"
      class="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
    >
      Add transaction
    </button>
  </form>
</template>

<script setup>
const props = defineProps({
  onSubmit: {
    type: Function,
    default: undefined
  }
})

const emit = defineEmits(['submit'])

const amount = ref('')
const description = ref('')
const type = ref('expense')

const submitForm = () => {
  const payload = {
    amount: Number(amount.value || 0),
    description: description.value.trim(),
    type: type.value
  }

  emit('submit', payload)
  if (props.onSubmit) {
    props.onSubmit(payload)
  }

  amount.value = ''
  description.value = ''
  type.value = 'expense'
}
</script>
