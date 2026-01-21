import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppwrite } from '../../../composables/useAppwrite'
import { MockClient, MockAccount } from '../mocks/appwrite'

// Mock the runtime config
const mockRuntimeConfig = {
  public: {
    appwriteEndpoint: 'http://localhost:8080/v1',
    appwriteProjectId: 'test-project-id',
  }
}

vi.mock('#app', () => ({
  useRuntimeConfig: () => mockRuntimeConfig,
}))

describe('useAppwrite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('client initialization', () => {
    it('should create client and account services', () => {
      const { client, account } = useAppwrite()

      expect(client).toBeInstanceOf(MockClient)
      expect(account).toBeInstanceOf(MockAccount)
    })

    it('should return new instances on each call', () => {
      const appwrite1 = useAppwrite()
      const appwrite2 = useAppwrite()

      // Should create new instances each time (not singleton)
      expect(appwrite1.client).not.toBe(appwrite2.client)
      expect(appwrite1.account).not.toBe(appwrite2.account)
    })
  })

  describe('return value structure', () => {
    it('should return correct structure', () => {
      const appwrite = useAppwrite()

      expect(appwrite).toHaveProperty('client')
      expect(appwrite).toHaveProperty('account')
      expect(Object.keys(appwrite)).toHaveLength(2)
    })

    it('should have client methods available', () => {
      const { client } = useAppwrite()

      expect(typeof client.setEndpoint).toBe('function')
      expect(typeof client.setProject).toBe('function')
    })

    it('should have account methods available', () => {
      const { account } = useAppwrite()

      expect(typeof account.get).toBe('function')
      expect(typeof account.createSession).toBe('function')
      expect(typeof account.deleteSession).toBe('function')
      expect(typeof account.deleteSessions).toBe('function')
    })
  })

  describe('configuration usage', () => {
    it('should use runtime config for initialization', () => {
      const mockUseRuntimeConfig = vi.mocked(useRuntimeConfig)
      
      useAppwrite()

      expect(mockUseRuntimeConfig).toHaveBeenCalled()
    })

    it('should handle configuration access', () => {
      // Test that the composable doesn't throw when accessing config
      expect(() => useAppwrite()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle runtime config errors', () => {
      vi.mocked(useRuntimeConfig).mockImplementationOnce(() => {
        throw new Error('Runtime config not available')
      })

      expect(() => useAppwrite()).toThrow('Runtime config not available')
    })
  })

  describe('type safety', () => {
    it('should maintain type consistency', () => {
      const { client, account } = useAppwrite()

      // These should not throw TypeScript errors
      expect(client).toBeDefined()
      expect(account).toBeDefined()
      
      // Client methods should be callable
      expect(() => client.setEndpoint('test')).not.toThrow()
      expect(() => client.setProject('test')).not.toThrow()
      
      // Account methods should be available
      expect(account.get).toBeDefined()
      expect(account.createSession).toBeDefined()
    })
  })

  describe('service integration', () => {
    it('should properly chain client configuration', () => {
      const { client } = useAppwrite()

      // Test method chaining (Appwrite Client supports this)
      const result1 = client.setEndpoint('test-endpoint')
      expect(result1).toBe(client)

      const result2 = client.setProject('test-project')
      expect(result2).toBe(client)
    })

    it('should provide working account service', async () => {
      const { account } = useAppwrite()

      // Test that account methods return promises (they should)
      const getUserPromise = account.get()
      expect(getUserPromise).toBeInstanceOf(Promise)
      
      // Should resolve to mock user data
      const user = await getUserPromise
      expect(user).toHaveProperty('$id')
      expect(user).toHaveProperty('email')
    })
  })
})