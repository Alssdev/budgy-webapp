<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-slate-900">Accent color</p>
        <p class="text-xs text-slate-500">Pick a palette for this wallet.</p>
      </div>
      <span class="text-xs text-slate-400">{{ selectedLabel }}</span>
    </div>
    <div class="grid grid-cols-6 gap-3 sm:grid-cols-8">
      <button
        v-for="color in palette"
        :key="color.key"
        type="button"
        class="h-10 w-10 rounded-full ring-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        :class="[
          color.bgClass,
          selectedColor === color.key
            ? `ring-2 ${color.ringClass}`
            : 'ring-1 ring-slate-200'
        ]"
        :aria-pressed="selectedColor === color.key"
        :aria-label="`Select ${color.label} palette`"
        @click="selectColor(color.key)"
      />
    </div>
  </section>
</template>

<script setup>
import { walletAccentPalette } from '~/composables/useWalletAccent'

const props = defineProps({
  selectedColor: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:selectedColor', 'select'])

const palette = walletAccentPalette

const selectedLabel = computed(() => {
  return palette.find((color) => color.key === props.selectedColor)?.label || 'Pick'
})

const selectColor = (key) => {
  emit('update:selectedColor', key)
  emit('select', key)
}
</script>
