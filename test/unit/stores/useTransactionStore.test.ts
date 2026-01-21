import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTransactionStore } from '../../../stores/useTransactionStore'
import { setupPinia, setupMockFetch, createMockFetchResponse } from '../utils/test-helpers'
import { transactionFixtures, createTransactionFactory } from '../fixtures/transactions'

describe('useTransactionStore', () => {
  let store: ReturnType<typeof useTransactionStore>
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    setupPinia()
    mockFetch = setupMockFetch()
    store = useTransactionStore()
  })

  describe('initial state', () => {
    it('should have empty initial state', () => {
      expect(store.transactions).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should have correct computed properties', () => {
      expect(store.transactionCount).toBe(0)
      expect(typeof store.getRecentTransactions).toBe('function')
    })
  })

  describe('fetchTransactions', () => {
    const walletId = 'wallet-1'

    it('should fetch transactions successfully', async () => {
      const testTransactions = transactionFixtures.filter(t => t.walletId === walletId)
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(testTransactions))

      await store.fetchTransactions(walletId)

      expect(mockFetch).toHaveBeenCalledWith(`/api/wallets/${walletId}/transactions`)
      expect(store.transactions).toEqual(testTransactions)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.transactionCount).toBe(testTransactions.length)
    })

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      await store.fetchTransactions(walletId)

      expect(store.transactions).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('should set loading state correctly', async () => {
      mockFetch.mockImplementationOnce(() => 
        createMockFetchResponse(transactionFixtures, { delay: 100 })
      )

      const fetchPromise = store.fetchTransactions(walletId)
      expect(store.isLoading).toBe(true)

      await fetchPromise
      expect(store.isLoading).toBe(false)
    })

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(null))

      await store.fetchTransactions(walletId)

      expect(store.transactions).toEqual([])
    })
  })

  describe('addTransaction', () => {
    const walletId = 'wallet-1'

    it('should add transaction successfully', async () => {
      const newTransactionData = {
        type: 'in' as const,
        amount: 150.50,
        description: 'Test income',
      }
      const createdTransaction = createTransactionFactory({
        ...newTransactionData,
        walletId,
      })
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(createdTransaction))

      const result = await store.addTransaction(walletId, newTransactionData)

      expect(mockFetch).toHaveBeenCalledWith(`/api/wallets/${walletId}/transactions`, {
        method: 'POST',
        body: newTransactionData,
      })
      expect(result).toEqual(createdTransaction)
      expect(store.transactions).toContain(createdTransaction)
    })

    it('should handle add transaction error', async () => {
      const errorMessage = 'Failed to add transaction'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      const newTransactionData = {
        type: 'out' as const,
        amount: 50,
        description: 'Test expense',
      }

      await expect(store.addTransaction(walletId, newTransactionData))
        .rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.transactions).toHaveLength(0)
    })

    it('should set loading state correctly during transaction creation', async () => {
      mockFetch.mockImplementationOnce(() => 
        createMockFetchResponse(createTransactionFactory(), { delay: 100 })
      )

      const newTransactionData = {
        type: 'in' as const,
        amount: 100,
        description: 'Test',
      }

      const addPromise = store.addTransaction(walletId, newTransactionData)
      expect(store.isLoading).toBe(true)

      await addPromise
      expect(store.isLoading).toBe(false)
    })
  })

  describe('getRecentTransactions computed', () => {
    beforeEach(() => {
      // Add transactions with different timestamps
      store.transactions = [
        createTransactionFactory({ 
          $id: 'tx-1', 
          timestamp: '2024-01-01T10:00:00.000Z',
          description: 'Oldest'
        }),
        createTransactionFactory({ 
          $id: 'tx-2', 
          timestamp: '2024-01-03T10:00:00.000Z',
          description: 'Newest'
        }),
        createTransactionFactory({ 
          $id: 'tx-3', 
          timestamp: '2024-01-02T10:00:00.000Z',
          description: 'Middle'
        }),
      ]
    })

    it('should return transactions sorted by timestamp (newest first)', () => {
      const recent = store.getRecentTransactions(3)
      
      expect(recent).toHaveLength(3)
      expect(recent[0].description).toBe('Newest')
      expect(recent[1].description).toBe('Middle')
      expect(recent[2].description).toBe('Oldest')
    })

    it('should limit the number of returned transactions', () => {
      const recent = store.getRecentTransactions(2)
      
      expect(recent).toHaveLength(2)
      expect(recent[0].description).toBe('Newest')
      expect(recent[1].description).toBe('Middle')
    })

    it('should handle limit greater than available transactions', () => {
      const recent = store.getRecentTransactions(10)
      
      expect(recent).toHaveLength(3)
    })

    it('should return empty array when no transactions', () => {
      store.transactions = []
      const recent = store.getRecentTransactions(5)
      
      expect(recent).toEqual([])
    })
  })

  describe('transaction types', () => {
    it('should handle income transactions', async () => {
      const incomeTransaction = createTransactionFactory({
        type: 'in',
        amount: 1000,
        description: 'Salary'
      })
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(incomeTransaction))

      const result = await store.addTransaction('wallet-1', {
        type: 'in',
        amount: 1000,
        description: 'Salary'
      })

      expect(result.type).toBe('in')
      expect(result.amount).toBe(1000)
    })

    it('should handle expense transactions', async () => {
      const expenseTransaction = createTransactionFactory({
        type: 'out',
        amount: 250,
        description: 'Groceries'
      })
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(expenseTransaction))

      const result = await store.addTransaction('wallet-1', {
        type: 'out',
        amount: 250,
        description: 'Groceries'
      })

      expect(result.type).toBe('out')
      expect(result.amount).toBe(250)
    })
  })

  describe('edge cases', () => {
    it('should handle unknown error types', async () => {
      mockFetch.mockRejectedValueOnce('String error')

      await store.fetchTransactions('wallet-1')

      expect(store.error).toBe('Failed to fetch transactions')
    })

    it('should clear error on successful operations', async () => {
      // Set initial error
      store.error = 'Previous error'
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(transactionFixtures))

      await store.fetchTransactions('wallet-1')

      expect(store.error).toBeNull()
    })

    it('should handle concurrent transaction operations', async () => {
      const transaction1 = createTransactionFactory({ $id: 'tx-1' })
      const transaction2 = createTransactionFactory({ $id: 'tx-2' })
      
      mockFetch
        .mockResolvedValueOnce(createMockFetchResponse(transaction1))
        .mockResolvedValueOnce(createMockFetchResponse(transaction2))

      const promises = [
        store.addTransaction('wallet-1', { type: 'in', amount: 100, description: 'Test 1' }),
        store.addTransaction('wallet-1', { type: 'out', amount: 50, description: 'Test 2' }),
      ]

      await Promise.all(promises)

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(store.transactions).toHaveLength(2)
      expect(store.transactions).toContain(transaction1)
      expect(store.transactions).toContain(transaction2)
    })

    it('should handle zero amount transactions', async () => {
      const zeroTransaction = createTransactionFactory({
        amount: 0,
        description: 'Zero amount transaction'
      })
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(zeroTransaction))

      const result = await store.addTransaction('wallet-1', {
        type: 'in',
        amount: 0,
        description: 'Zero amount transaction'
      })

      expect(result.amount).toBe(0)
      expect(store.transactions).toContain(zeroTransaction)
    })

    it('should handle transactions with empty descriptions', async () => {
      const noDescTransaction = createTransactionFactory({
        description: ''
      })
      mockFetch.mockResolvedValueOnce(createMockFetchResponse(noDescTransaction))

      const result = await store.addTransaction('wallet-1', {
        type: 'in',
        amount: 100,
        description: ''
      })

      expect(result.description).toBe('')
    })
  })
})