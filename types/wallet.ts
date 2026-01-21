export interface Wallet {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  balance: number
  currency: string
  userId: string
  isDeleted: boolean
  color?: string
  icon?: string
}

export interface WalletFormData {
  name: string
  currency: string
}