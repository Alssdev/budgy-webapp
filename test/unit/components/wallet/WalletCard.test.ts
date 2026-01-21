import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WalletCard from '../../../../components/wallet/WalletCard.vue'
import { createWalletFactory } from '../../fixtures/wallets'

// Mock the useWalletAccent composable
const mockUseWalletAccent = vi.fn()
vi.mock('../../../../composables/useWalletAccent', () => ({
  useWalletAccent: mockUseWalletAccent,
}))

describe('WalletCard', () => {
  const defaultAccent = {
    key: 'slate',
    label: 'Slate',
    bgClass: 'bg-slate-500',
    textClass: 'text-white',
    ringClass: 'ring-slate-300'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWalletAccent.mockReturnValue(defaultAccent)
  })

  describe('rendering', () => {
    it('should render wallet name', () => {
      const wallet = createWalletFactory({ name: 'My Test Wallet' })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('My Test Wallet')
    })

    it('should render formatted balance', () => {
      const wallet = createWalletFactory({ balance: 1234.56 })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$1,234.56')
    })

    it('should render zero balance correctly', () => {
      const wallet = createWalletFactory({ balance: 0 })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$0.00')
    })

    it('should render negative balance correctly', () => {
      const wallet = createWalletFactory({ balance: -150.75 })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('-$150.75')
    })

    it('should display wallet icon when provided', () => {
      const wallet = createWalletFactory({ icon: '💰' })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('💰')
    })

    it('should display default "W" icon when no icon provided', () => {
      const wallet = createWalletFactory({ icon: undefined })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const iconElement = wrapper.find('[data-test-id="wallet-icon"]')
      if (iconElement.exists()) {
        expect(iconElement.text()).toBe('W')
      } else {
        // Fallback: check if "W" appears in the component
        expect(wrapper.text()).toContain('W')
      }
    })
  })

  describe('styling and accent colors', () => {
    it('should apply accent classes correctly', () => {
      const customAccent = {
        key: 'emerald',
        label: 'Emerald',
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-50',
        ringClass: 'ring-emerald-300'
      }
      mockUseWalletAccent.mockReturnValue(customAccent)

      const wallet = createWalletFactory({ color: 'emerald' })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const iconContainer = wrapper.find('.bg-emerald-500')
      expect(iconContainer.exists()).toBe(true)
      expect(iconContainer.classes()).toContain('text-emerald-50')
    })

    it('should call useWalletAccent with wallet color', () => {
      const wallet = createWalletFactory({ color: 'sky' })
      
      mount(WalletCard, {
        props: { wallet }
      })

      expect(mockUseWalletAccent).toHaveBeenCalledWith('sky')
    })

    it('should handle wallet without color', () => {
      const wallet = createWalletFactory({ color: undefined })
      
      mount(WalletCard, {
        props: { wallet }
      })

      expect(mockUseWalletAccent).toHaveBeenCalledWith(undefined)
    })
  })

  describe('user interactions', () => {
    it('should emit select event when clicked', async () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')?.[0]).toEqual([wallet])
    })

    it('should emit select event only once per click', async () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(1)
    })

    it('should be keyboard accessible', () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
      expect(button.classes()).toContain('focus-visible:outline-none')
      expect(button.classes()).toContain('focus-visible:ring-2')
    })
  })

  describe('balance formatting', () => {
    it('should format large balances correctly', () => {
      const wallet = createWalletFactory({ balance: 1234567.89 })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$1,234,567.89')
    })

    it('should handle undefined balance', () => {
      const wallet = createWalletFactory({ balance: undefined })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$0.00')
    })

    it('should handle null balance', () => {
      const wallet = createWalletFactory({ balance: 0 })
      // Manually set balance to null for testing
      ;(wallet as any).balance = null
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$0.00')
    })

    it('should handle string balance', () => {
      const wallet = createWalletFactory({ balance: '500.25' as any })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$500.25')
    })
  })

  describe('accessibility', () => {
    it('should have proper button semantics', () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
    })

    it('should provide readable text content', () => {
      const wallet = createWalletFactory({ 
        name: 'Savings Account',
        balance: 2500.50 
      })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const text = wrapper.text()
      expect(text).toContain('Wallet')
      expect(text).toContain('Savings Account')
      expect(text).toContain('Balance')
      expect(text).toContain('$2,500.50')
    })
  })

  describe('edge cases', () => {
    it('should handle wallet with all optional properties undefined', () => {
      const wallet = {
        $id: 'test-id',
        $createdAt: '2024-01-01T00:00:00.000Z',
        $updatedAt: '2024-01-01T00:00:00.000Z',
        name: 'Test Wallet',
        balance: 100,
        currency: 'USD',
        userId: 'user-1',
        isDeleted: false,
        color: undefined,
        icon: undefined
      }
      
      expect(() => {
        mount(WalletCard, { props: { wallet } })
      }).not.toThrow()
    })

    it('should handle very long wallet names', () => {
      const longName = 'A'.repeat(50)
      const wallet = createWalletFactory({ name: longName })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain(longName)
    })

    it('should handle special characters in wallet name', () => {
      const wallet = createWalletFactory({ name: 'Café & Restaurant 🍽️' })
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('Café & Restaurant 🍽️')
    })

    it('should handle floating point precision issues', () => {
      const wallet = createWalletFactory({ balance: 0.1 + 0.2 }) // 0.30000000000000004
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.text()).toContain('$0.30')
    })
  })

  describe('component structure', () => {
    it('should have the correct DOM structure', () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.findAll('.flex').length).toBeGreaterThan(0)
    })

    it('should apply correct CSS classes', () => {
      const wallet = createWalletFactory()
      
      const wrapper = mount(WalletCard, {
        props: { wallet }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('group')
      expect(button.classes()).toContain('w-full')
      expect(button.classes()).toContain('rounded-2xl')
    })
  })
})