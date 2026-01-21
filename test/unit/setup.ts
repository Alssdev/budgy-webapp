import { vi, beforeEach } from 'vitest'
import './mocks/appwrite'

// Mock global runtime config
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      appwriteEndpoint: 'http://localhost:8080/v1',
      appwriteProjectId: 'test-project',
    }
  })
}))

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      appwriteEndpoint: 'http://localhost:8080/v1',
      appwriteProjectId: 'test-project',
    }
  }),
  navigateTo: vi.fn(),
}))

// Setup global test environment
beforeEach(() => {
  vi.clearAllMocks()
})