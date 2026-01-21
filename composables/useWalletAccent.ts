const accentPalette = [
  {
    key: 'slate',
    label: 'Slate',
    bgClass: 'bg-slate-500',
    textClass: 'text-white',
    ringClass: 'ring-slate-300'
  },
  {
    key: 'emerald',
    label: 'Emerald',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-50',
    ringClass: 'ring-emerald-300'
  },
  {
    key: 'sky',
    label: 'Sky',
    bgClass: 'bg-sky-500',
    textClass: 'text-sky-50',
    ringClass: 'ring-sky-300'
  },
  {
    key: 'amber',
    label: 'Amber',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-950',
    ringClass: 'ring-amber-300'
  },
  {
    key: 'rose',
    label: 'Rose',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-50',
    ringClass: 'ring-rose-300'
  },
  {
    key: 'teal',
    label: 'Teal',
    bgClass: 'bg-teal-500',
    textClass: 'text-teal-50',
    ringClass: 'ring-teal-300'
  }
]

const defaultAccent = accentPalette[0]

export const walletAccentPalette = accentPalette

export const useWalletAccent = (color: string | undefined | null) => {
  if (color?.startsWith('bg-')) {
    return {
      bgClass: color,
      textClass: 'text-white',
      ringClass: 'ring-slate-300'
    }
  }

  return accentPalette.find((accent) => accent.key === color) || defaultAccent
}
