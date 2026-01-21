<template>
  <div class="space-y-3">
    <TransactionItem
      v-for="transaction in transactions"
      :key="transaction.id || transaction.timestamp || transaction.description"
      :transaction="transaction"
    />
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})
</script>
