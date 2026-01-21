import type { Wallet } from '../../../types/wallet'

export const walletFixtures: Wallet[] = [
  {
    $id: 'wallet-1',
    $createdAt: '2024-01-01T00:00:00.000Z',
    $updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Main Wallet',
    balance: 1500.50,
    currency: 'USD',
    userId: 'user-1',
    isDeleted: false,
  },
  {
    $id: 'wallet-2',
    $createdAt: '2024-01-02T00:00:00.000Z',
    $updatedAt: '2024-01-02T00:00:00.000Z',
    name: 'Savings',
    balance: 5000.00,
    currency: 'EUR',
    userId: 'user-1',
    isDeleted: false,
  },
  {
    $id: 'wallet-3',
    $createdAt: '2024-01-03T00:00:00.000Z',
    $updatedAt: '2024-01-03T00:00:00.000Z',
    name: 'Emergency Fund',
    balance: 0.00,
    currency: 'GBP',
    userId: 'user-1',
    isDeleted: false,
  },
]

export const createWalletFactory = (overrides: Partial<Wallet> = {}): Wallet => ({
  $id: `wallet-${Date.now()}`,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  name: 'Test Wallet',
  balance: 1000,
  currency: 'USD',
  userId: 'test-user',
  isDeleted: false,
  ...overrides,
})