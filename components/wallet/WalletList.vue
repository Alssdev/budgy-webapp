<template>
  <section class="space-y-3">
    <WalletCard
      v-for="wallet in wallets"
      :key="wallet.id || wallet.name"
      :wallet="wallet"
      @select="emit('select', $event)"
    />
  </section>
</template>

<script setup>
defineProps({
  wallets: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])
</script>
