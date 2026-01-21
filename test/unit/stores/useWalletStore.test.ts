import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWalletStore } from '../../../stores/useWalletStore'
import { setupPinia, setupMockFetch, createMockFetchResponse } from '../utils/test-helpers'
import { walletFixtures, createWalletFactory } from '../fixtures/wallets'

describe('useWalletStore', () => {
  let store: ReturnType<typeof useWalletStore>
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    setupPinia()
    mockFetch = setupMockFetch()
    store = useWalletStore()
  })

  describe('initial state', () => {
    it('should have empty initial state', () => {
      expect(store.wallets).toEqual([])
      expect(store.activeWallet).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should have correct computed properties', () => {
      expect(store.walletCount).toBe(0)
      expect(typeof store.getWalletById).toBe('function')
    })
  })

  describe('fetchWallets', () => {
    it('should fetch wallets successfully', async () => {
      const testWallets = walletFixtures.slice(0, 2)
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(testWallets))

      await store.fetchWallets()

      expect(mockFetch).toHaveBeenCalledWith('/api/wallets')
      expect(store.wallets).toEqual(testWallets)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.walletCount).toBe(2)
    })

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      await store.fetchWallets()

      expect(store.wallets).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('should set loading state correctly', async () => {
      mockFetch.mockImplementationOnce(() => 
        createMockFetchResponse(walletFixtures, { delay: 100 })
      )

      const fetchPromise = store.fetchWallets()
      expect(store.isLoading).toBe(true)

      await fetchPromise
      expect(store.isLoading).toBe(false)
    })

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(null))

      await store.fetchWallets()

      expect(store.wallets).toEqual([])
    })
  })

  describe('fetchWallet', () => {
    it('should fetch single wallet successfully', async () => {
      const testWallet = walletFixtures[0]
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(testWallet))

      const result = await store.fetchWallet(testWallet.$id)

      expect(mockFetch).toHaveBeenCalledWith(`/api/wallets/${testWallet.$id}`)
      expect(result).toEqual(testWallet)
      expect(store.wallets).toContain(testWallet)
    })

    it('should update existing wallet in the list', async () => {
      // Setup: add wallet to store first
      store.wallets = [walletFixtures[0]]
      
      const updatedWallet = { ...walletFixtures[0], name: 'Updated Wallet' }
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(updatedWallet))

      await store.fetchWallet(walletFixtures[0].$id)

      expect(store.wallets).toHaveLength(1)
      expect(store.wallets[0].name).toBe('Updated Wallet')
    })

    it('should handle fetch wallet error', async () => {
      const errorMessage = 'Wallet not found'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      await expect(store.fetchWallet('non-existent')).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('createWallet', () => {
    it('should create wallet successfully', async () => {
      const newWalletData = {
        name: 'New Wallet',
        currency: 'USD',
      }
      const createdWallet = createWalletFactory(newWalletData)
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(createdWallet))

      const result = await store.createWallet(newWalletData)

      expect(mockFetch).toHaveBeenCalledWith('/api/wallets', {
        method: 'POST',
        body: newWalletData,
      })
      expect(result).toEqual(createdWallet)
      expect(store.wallets).toContain(createdWallet)
    })

    it('should handle create wallet error', async () => {
      const errorMessage = 'Failed to create wallet'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      const newWalletData = { name: 'Test', currency: 'USD' }

      await expect(store.createWallet(newWalletData)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.wallets).toHaveLength(0)
    })
  })

  describe('updateWallet', () => {
    beforeEach(() => {
      store.wallets = [walletFixtures[0]]
    })

    it('should update wallet successfully', async () => {
      const updateData = { name: 'Updated Name' }
      const updatedWallet = { ...walletFixtures[0], ...updateData }
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(updatedWallet))

      const result = await store.updateWallet(walletFixtures[0].$id, updateData)

      expect(mockFetch).toHaveBeenCalledWith(`/api/wallets/${walletFixtures[0].$id}`, {
        method: 'PUT',
        body: updateData,
      })
      expect(result).toEqual(updatedWallet)
      expect(store.wallets[0]).toEqual(updatedWallet)
    })

    it('should handle update wallet error', async () => {
      const errorMessage = 'Failed to update wallet'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      const updateData = { name: 'Updated Name' }

      await expect(store.updateWallet(walletFixtures[0].$id, updateData))
        .rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('deleteWallet', () => {
    beforeEach(() => {
      store.wallets = [...walletFixtures]
    })

    it('should delete wallet successfully', async () => {
      const walletToDelete = walletFixtures[0]
      mockFetch.mockResolvedValueOnce(createMockFetchResponse({}))

      await store.deleteWallet(walletToDelete.$id)

      expect(mockFetch).toHaveBeenCalledWith(`/api/wallets/${walletToDelete.$id}`, {
        method: 'DELETE',
      })
      expect(store.wallets).not.toContain(walletToDelete)
      expect(store.wallets).toHaveLength(walletFixtures.length - 1)
    })

    it('should handle delete wallet error', async () => {
      const errorMessage = 'Failed to delete wallet'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      const originalLength = store.wallets.length

      await expect(store.deleteWallet(walletFixtures[0].$id)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.wallets).toHaveLength(originalLength)
    })
  })

  describe('setActiveWallet', () => {
    it('should set active wallet', () => {
      const testWallet = walletFixtures[0]
      
      store.setActiveWallet(testWallet)
      
      expect(store.activeWallet).toEqual(testWallet)
    })

    it('should set active wallet to null', () => {
      store.activeWallet = walletFixtures[0]
      
      store.setActiveWallet(null)
      
      expect(store.activeWallet).toBeNull()
    })
  })

  describe('getWalletById computed', () => {
    beforeEach(() => {
      store.wallets = walletFixtures
    })

    it('should find wallet by id', () => {
      const wallet = store.getWalletById(walletFixtures[0].$id)
      expect(wallet).toEqual(walletFixtures[0])
    })

    it('should return undefined for non-existent id', () => {
      const wallet = store.getWalletById('non-existent-id')
      expect(wallet).toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('should handle unknown error types', async () => {
      mockFetch.mockRejectedValueOnce('String error')

      await store.fetchWallets()

      expect(store.error).toBe('Failed to fetch wallets')
    })

    it('should clear error on successful operations', async () => {
      // Set initial error
      store.error = 'Previous error'
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(walletFixtures))

      await store.fetchWallets()

      expect(store.error).toBeNull()
    })

    it('should handle concurrent operations correctly', async () => {
      mockFetch.mockResolvedValue(createMockFetchResponse(walletFixtures))

      // Start multiple fetch operations
      const promises = [
        store.fetchWallets(),
        store.fetchWallets(),
        store.fetchWallets(),
      ]

      await Promise.all(promises)

      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(store.wallets).toEqual(walletFixtures)
    })
  })
})