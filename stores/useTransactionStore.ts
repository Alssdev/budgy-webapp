import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction } from '../types/transaction'

declare const $fetch: typeof import('ofetch').$fetch

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const transactionCount = computed(() => transactions.value.length)
  
  const getRecentTransactions = computed(() => (limit: number) => {
    return [...transactions.value]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  })
  
  const fetchTransactions = async (walletId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Transaction[]>(`/api/wallets/${walletId}/transactions`)
      transactions.value = data || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transactions'
      console.error('Failed to fetch transactions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const addTransaction = async (walletId: string, data: Omit<Transaction, '$id' | '$createdAt' | '$updatedAt' | 'walletId' | 'timestamp' | 'resultingBalance'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const transaction = await $fetch<Transaction>(`/api/wallets/${walletId}/transactions`, {
        method: 'POST',
        body: data
      })
      transactions.value.push(transaction)
      return transaction
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to add transaction'
      console.error('Failed to add transaction:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    // State
    transactions,
    isLoading,
    error,
    
    // Getters
    transactionCount,
    getRecentTransactions,
    
    // Actions
    fetchTransactions,
    addTransaction
  }
})