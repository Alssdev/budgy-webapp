export interface Transaction {
  $id: string
  $createdAt: string
  $updatedAt: string
  walletId: string
  type: 'in' | 'out'
  amount: number
  description: string
  timestamp: string
  resultingBalance: number
}

export interface TransactionFormData {
  type: 'in' | 'out'
  amount: number
  description?: string
}