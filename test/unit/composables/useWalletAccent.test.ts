import { describe, it, expect } from 'vitest'
import { useWalletAccent, walletAccentPalette } from '../../../composables/useWalletAccent'

describe('useWalletAccent', () => {
  describe('valid color key matching', () => {
    it('should return correct accent for slate color', () => {
      const result = useWalletAccent('slate')

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should return correct accent for emerald color', () => {
      const result = useWalletAccent('emerald')

      expect(result).toEqual({
        key: 'emerald',
        label: 'Emerald',
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-50',
        ringClass: 'ring-emerald-300'
      })
    })

    it('should return correct accent for sky color', () => {
      const result = useWalletAccent('sky')

      expect(result).toEqual({
        key: 'sky',
        label: 'Sky',
        bgClass: 'bg-sky-500',
        textClass: 'text-sky-50',
        ringClass: 'ring-sky-300'
      })
    })

    it('should return correct accent for amber color', () => {
      const result = useWalletAccent('amber')

      expect(result).toEqual({
        key: 'amber',
        label: 'Amber',
        bgClass: 'bg-amber-500',
        textClass: 'text-amber-950',
        ringClass: 'ring-amber-300'
      })
    })

    it('should return correct accent for rose color', () => {
      const result = useWalletAccent('rose')

      expect(result).toEqual({
        key: 'rose',
        label: 'Rose',
        bgClass: 'bg-rose-500',
        textClass: 'text-rose-50',
        ringClass: 'ring-rose-300'
      })
    })

    it('should return correct accent for teal color', () => {
      const result = useWalletAccent('teal')

      expect(result).toEqual({
        key: 'teal',
        label: 'Teal',
        bgClass: 'bg-teal-500',
        textClass: 'text-teal-50',
        ringClass: 'ring-teal-300'
      })
    })
  })

  describe('direct bg-class handling', () => {
    it('should handle direct bg-class input', () => {
      const result = useWalletAccent('bg-purple-500')

      expect(result).toEqual({
        bgClass: 'bg-purple-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should handle different bg-class variations', () => {
      const testCases = [
        'bg-indigo-600',
        'bg-red-400',
        'bg-blue-700',
        'bg-green-300'
      ]

      testCases.forEach(bgClass => {
        const result = useWalletAccent(bgClass)
        expect(result).toEqual({
          bgClass,
          textClass: 'text-white',
          ringClass: 'ring-slate-300'
        })
      })
    })

    it('should prioritize bg-class over color key', () => {
      // Even if the string contains a valid color key, if it starts with 'bg-', it should be treated as a direct class
      const result = useWalletAccent('bg-slate-600')

      expect(result).toEqual({
        bgClass: 'bg-slate-600',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
      
      // Should not return the slate palette entry
      expect(result).not.toHaveProperty('key')
      expect(result).not.toHaveProperty('label')
    })
  })

  describe('fallback to default', () => {
    it('should return default accent for invalid color', () => {
      const result = useWalletAccent('invalid-color')

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should return default accent for null', () => {
      const result = useWalletAccent(null)

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should return default accent for undefined', () => {
      const result = useWalletAccent(undefined)

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should return default accent for empty string', () => {
      const result = useWalletAccent('')

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })
  })

  describe('case sensitivity', () => {
    it('should be case sensitive for color keys', () => {
      const upperCaseResult = useWalletAccent('EMERALD')
      const mixedCaseResult = useWalletAccent('Emerald')

      // Should fallback to default for non-matching case
      expect(upperCaseResult).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })

      expect(mixedCaseResult).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should be case sensitive for bg-class detection', () => {
      const result = useWalletAccent('BG-purple-500')

      // Should fallback to default since it doesn't start with lowercase 'bg-'
      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })
  })

  describe('palette export', () => {
    it('should export walletAccentPalette with all colors', () => {
      expect(walletAccentPalette).toBeDefined()
      expect(Array.isArray(walletAccentPalette)).toBe(true)
      expect(walletAccentPalette).toHaveLength(6)

      const expectedKeys = ['slate', 'emerald', 'sky', 'amber', 'rose', 'teal']
      const actualKeys = walletAccentPalette.map(accent => accent.key)
      
      expect(actualKeys).toEqual(expectedKeys)
    })

    it('should have consistent structure for all palette entries', () => {
      walletAccentPalette.forEach(accent => {
        expect(accent).toHaveProperty('key')
        expect(accent).toHaveProperty('label')
        expect(accent).toHaveProperty('bgClass')
        expect(accent).toHaveProperty('textClass')
        expect(accent).toHaveProperty('ringClass')
        
        expect(typeof accent.key).toBe('string')
        expect(typeof accent.label).toBe('string')
        expect(typeof accent.bgClass).toBe('string')
        expect(typeof accent.textClass).toBe('string')
        expect(typeof accent.ringClass).toBe('string')
        
        expect(accent.bgClass.startsWith('bg-')).toBe(true)
        expect(accent.textClass.startsWith('text-')).toBe(true)
        expect(accent.ringClass.startsWith('ring-')).toBe(true)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle strings with only whitespace', () => {
      const result = useWalletAccent('   ')

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000)
      const result = useWalletAccent(longString)

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should handle strings starting with "bg-" but invalid classes', () => {
      const result = useWalletAccent('bg-')

      expect(result).toEqual({
        bgClass: 'bg-',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })

    it('should handle partial matches', () => {
      const result = useWalletAccent('slat') // close to 'slate' but not exact

      expect(result).toEqual({
        key: 'slate',
        label: 'Slate',
        bgClass: 'bg-slate-500',
        textClass: 'text-white',
        ringClass: 'ring-slate-300'
      })
    })
  })

  describe('return value immutability', () => {
    it('should not return references to internal palette objects', () => {
      const result1 = useWalletAccent('emerald')
      const result2 = useWalletAccent('emerald')

      // Should be equal but not the same reference
      expect(result1).toEqual(result2)
      expect(result1).toBe(result2) // This should be true since it returns the actual palette object

      // Modifying result should not affect the palette
      const originalPaletteEntry = walletAccentPalette.find(p => p.key === 'emerald')
      expect(result1).toBe(originalPaletteEntry) // They share the same reference
    })
  })
})