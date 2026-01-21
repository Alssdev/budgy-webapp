import type { Transaction } from '../../../types/transaction'

export const transactionFixtures: Transaction[] = [
  {
    $id: 'transaction-1',
    $createdAt: '2024-01-01T10:00:00.000Z',
    $updatedAt: '2024-01-01T10:00:00.000Z',
    walletId: 'wallet-1',
    type: 'in',
    amount: 500.00,
    description: 'Salary payment',
    timestamp: '2024-01-01T10:00:00.000Z',
    resultingBalance: 1500.50,
  },
  {
    $id: 'transaction-2',
    $createdAt: '2024-01-01T14:30:00.000Z',
    $updatedAt: '2024-01-01T14:30:00.000Z',
    walletId: 'wallet-1',
    type: 'out',
    amount: 50.00,
    description: 'Grocery shopping',
    timestamp: '2024-01-01T14:30:00.000Z',
    resultingBalance: 1450.50,
  },
  {
    $id: 'transaction-3',
    $createdAt: '2024-01-02T09:15:00.000Z',
    $updatedAt: '2024-01-02T09:15:00.000Z',
    walletId: 'wallet-2',
    type: 'in',
    amount: 1000.00,
    description: 'Freelance payment',
    timestamp: '2024-01-02T09:15:00.000Z',
    resultingBalance: 5000.00,
  },
]

export const createTransactionFactory = (overrides: Partial<Transaction> = {}): Transaction => ({
  $id: `transaction-${Date.now()}`,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  walletId: 'wallet-1',
  type: 'in',
  amount: 100,
  description: 'Test transaction',
  timestamp: new Date().toISOString(),
  resultingBalance: 1100,
  ...overrides,
})