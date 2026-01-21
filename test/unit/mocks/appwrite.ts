import { vi } from 'vitest'

// Mock Appwrite Client
export class MockClient {
  private endpoint: string = ''
  private projectId: string = ''

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint
    return this
  }

  setProject(projectId: string) {
    this.projectId = projectId
    return this
  }

  getEndpoint() {
    return this.endpoint
  }

  getProject() {
    return this.projectId
  }
}

// Mock Account service
export class MockAccount {
  constructor(private client: MockClient) {}

  async get() {
    return {
      $id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
    }
  }

  async createSession(email: string, password: string) {
    return {
      $id: 'test-session-id',
      userId: 'test-user-id',
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  async deleteSession(sessionId: string) {
    return true
  }

  async deleteSessions() {
    return true
  }
}

// Mock the entire appwrite module
vi.mock('appwrite', () => ({
  Client: MockClient,
  Account: MockAccount,
}))

// Mock useAppwrite composable
export const mockUseAppwrite = () => ({
  client: new MockClient()
    .setEndpoint('http://localhost:8080/v1')
    .setProject('test-project'),
  account: new MockAccount(new MockClient()),
})

// Mock $fetch for API calls
export const mockFetch = vi.fn()

// Create mock data helpers
export const createMockWallet = (overrides = {}) => ({
  $id: 'wallet-1',
  $createdAt: '2024-01-01T00:00:00.000Z',
  $updatedAt: '2024-01-01T00:00:00.000Z',
  name: 'Test Wallet',
  balance: 1000,
  currency: 'USD',
  userId: 'test-user-id',
  isDeleted: false,
  ...overrides,
})

export const createMockTransaction = (overrides = {}) => ({
  $id: 'transaction-1',
  $createdAt: '2024-01-01T00:00:00.000Z',
  $updatedAt: '2024-01-01T00:00:00.000Z',
  walletId: 'wallet-1',
  type: 'in' as const,
  amount: 100,
  description: 'Test transaction',
  timestamp: '2024-01-01T00:00:00.000Z',
  resultingBalance: 1100,
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  $id: 'test-user-id',
  $createdAt: '2024-01-01T00:00:00.000Z',
  $updatedAt: '2024-01-01T00:00:00.000Z',
  name: 'Test User',
  email: 'test@example.com',
  phone: '',
  emailVerification: true,
  phoneVerification: false,
  prefs: {},
  registration: '2024-01-01T00:00:00.000Z',
  status: true,
  labels: [],
  passwordUpdate: '2024-01-01T00:00:00.000Z',
  mfa: false,
  targets: [],
  accessedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})