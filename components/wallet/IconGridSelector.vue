<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-slate-900">Wallet icon</p>
        <p class="text-xs text-slate-500">Search and pick a symbol.</p>
      </div>
      <span class="text-xs text-slate-400">{{ selectedLabel }}</span>
    </div>
    <label
      class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-200"
    >
      <i class="pi pi-search text-slate-400" aria-hidden="true" />
      <input
        v-model.trim="search"
        type="text"
        placeholder="Search icons"
        class="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
        aria-label="Search icons"
      >
    </label>
    <div class="grid grid-cols-4 gap-3 sm:grid-cols-6">
      <button
        v-for="icon in filteredIcons"
        :key="icon.key"
        type="button"
        class="flex h-14 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        :class="
          selectedIcon === icon.class
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
        "
        :aria-pressed="selectedIcon === icon.class"
        :aria-label="`Select ${icon.label} icon`"
        @click="selectIcon(icon.class)"
      >
        <i :class="[icon.class, 'text-lg']" aria-hidden="true" />
        <span class="sr-only">{{ icon.label }}</span>
      </button>
    </div>
    <p v-if="!filteredIcons.length" class="text-xs text-slate-500">
      No icons match "{{ search }}".
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  selectedIcon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:selectedIcon'])

const search = ref('')

const icons = [
  { key: 'wallet', label: 'Wallet', class: 'pi pi-wallet' },
  { key: 'credit-card', label: 'Card', class: 'pi pi-credit-card' },
  { key: 'bag', label: 'Shopping', class: 'pi pi-shopping-bag' },
  { key: 'gift', label: 'Gift', class: 'pi pi-gift' },
  { key: 'car', label: 'Car', class: 'pi pi-car' },
  { key: 'home', label: 'Home', class: 'pi pi-home' },
  { key: 'bolt', label: 'Energy', class: 'pi pi-bolt' },
  { key: 'bell', label: 'Alert', class: 'pi pi-bell' },
  { key: 'heart', label: 'Health', class: 'pi pi-heart' },
  { key: 'leaf', label: 'Leaf', class: 'pi pi-leaf' },
  { key: 'calendar', label: 'Calendar', class: 'pi pi-calendar' },
  { key: 'star', label: 'Star', class: 'pi pi-star' }
]

const filteredIcons = computed(() => {
  if (!search.value) return icons
  const term = search.value.toLowerCase()
  return icons.filter((icon) => icon.label.toLowerCase().includes(term))
})

const selectedLabel = computed(() => {
  return icons.find((icon) => icon.class === props.selectedIcon)?.label || 'Pick'
})

const selectIcon = (iconClass) => {
  emit('update:selectedIcon', iconClass)
}
</script>
