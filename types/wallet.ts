export interface Wallet {
  $id: string
  $createdAt: string
  $updatedAt: string
  name: string
  balance: number
  currency: string
  userId: string
  isDeleted: boolean
}

export interface WalletFormData {
  name: string
  currency: string
}