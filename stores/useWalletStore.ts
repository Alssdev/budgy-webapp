import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Wallet } from '../types/wallet'

declare const $fetch: typeof import('ofetch').$fetch

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref<Wallet[]>([])
  const activeWallet = ref<Wallet | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const walletCount = computed(() => wallets.value.length)
  
  const getWalletById = computed(() => (id: string) => {
    return wallets.value.find(wallet => wallet.$id === id)
  })
  
  const fetchWallets = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Wallet[]>('/api/wallets')
      wallets.value = data || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch wallets'
      console.error('Failed to fetch wallets:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchWallet = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const wallet = await $fetch<Wallet>(`/api/wallets/${id}`)
      // Update or add the wallet to the list
      const index = wallets.value.findIndex(w => w.$id === id)
      if (index >= 0) {
        wallets.value[index] = wallet
      } else {
        wallets.value.push(wallet)
      }
      return wallet
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch wallet'
      console.error('Failed to fetch wallet:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createWallet = async (data: Omit<Wallet, '$id' | '$createdAt' | '$updatedAt' | 'userId' | 'isDeleted' | 'balance'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const wallet = await $fetch<Wallet>('/api/wallets', {
        method: 'POST',
        body: data
      })
      wallets.value.push(wallet)
      return wallet
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create wallet'
      console.error('Failed to create wallet:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateWallet = async (id: string, data: Partial<Omit<Wallet, '$id' | '$createdAt' | '$updatedAt' | 'userId' | 'isDeleted'>>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const wallet = await $fetch<Wallet>(`/api/wallets/${id}`, {
        method: 'PUT',
        body: data
      })
      // Update the wallet in the list
      const index = wallets.value.findIndex(w => w.$id === id)
      if (index >= 0) {
        wallets.value[index] = wallet
      }
      return wallet
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to update wallet'
      console.error('Failed to update wallet:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteWallet = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await $fetch(`/api/wallets/${id}`, {
        method: 'DELETE'
      })
      // Remove the wallet from the list
      wallets.value = wallets.value.filter(wallet => wallet.$id !== id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete wallet'
      console.error('Failed to delete wallet:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const setActiveWallet = (wallet: Wallet | null) => {
    activeWallet.value = wallet
  }
  
  return {
    // State
    wallets,
    activeWallet,
    isLoading,
    error,
    
    // Getters
    walletCount,
    getWalletById,
    
    // Actions
    fetchWallets,
    fetchWallet,
    createWallet,
    updateWallet,
    deleteWallet,
    setActiveWallet
  }
})