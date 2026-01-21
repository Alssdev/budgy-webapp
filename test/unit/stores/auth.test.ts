import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest'
import { useAuthStore } from '../../../stores/auth'
import { setupPinia, mockConsole } from '../utils/test-helpers'
import { mockUseAppwrite, createMockUser } from '../mocks/appwrite'

// Mock the useAppwrite composable
vi.mock('../../../composables/useAppwrite', () => ({
  useAppwrite: mockUseAppwrite,
}))

describe('useAuthStore', () => {
  let store: ReturnType<typeof useAuthStore>
  let mockAccount: any
  let consoleRestore: ReturnType<typeof mockConsole>

  beforeEach(() => {
    setupPinia()
    consoleRestore = mockConsole()
    
    // Get fresh mock account for each test
    const { account } = mockUseAppwrite()
    mockAccount = account
    
    // Reset all mocks
    vi.clearAllMocks()
    
    store = useAuthStore()
  })

  afterEach(() => {
    consoleRestore.restore()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const testUser = createMockUser()
      mockAccount.createEmailPasswordSession = vi.fn().mockResolvedValue({ 
        $id: 'session-id',
        userId: testUser.$id 
      })
      mockAccount.get = vi.fn().mockResolvedValue(testUser)

      await store.login('test@example.com', 'password123')

      expect(mockAccount.createEmailPasswordSession).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(mockAccount.get).toHaveBeenCalled()
      expect(store.user).toEqual(testUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials'
      mockAccount.createEmailPasswordSession = vi.fn().mockRejectedValue(new Error(errorMessage))

      await expect(store.login('test@example.com', 'wrong-password'))
        .rejects.toThrow(errorMessage)

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('should set loading state correctly', async () => {
      mockAccount.createEmailPasswordSession = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ $id: 'session' }), 100))
      )
      mockAccount.get = vi.fn().mockResolvedValue(createMockUser())

      const loginPromise = store.login('test@example.com', 'password123')
      expect(store.isLoading).toBe(true)

      await loginPromise
      expect(store.isLoading).toBe(false)
    })

    it('should handle account not initialized error', async () => {
      // Create store with no account
      vi.mocked(mockUseAppwrite).mockReturnValueOnce({
        client: mockUseAppwrite().client,
        account: null as any
      })
      
      const freshStore = useAuthStore()

      await expect(freshStore.login('test@example.com', 'password123'))
        .rejects.toThrow('Account not initialized')
    })

    it('should handle unknown error types', async () => {
      mockAccount.createEmailPasswordSession = vi.fn().mockRejectedValue('String error')

      await expect(store.login('test@example.com', 'password123'))
        .rejects.toBe('String error')

      expect(store.error).toBe('Login failed')
    })
  })

  describe('signup', () => {
    it('should signup successfully', async () => {
      const testUser = createMockUser({ name: 'John Doe' })
      mockAccount.create = vi.fn().mockResolvedValue({ $id: 'user-id' })
      mockAccount.createEmailPasswordSession = vi.fn().mockResolvedValue({ 
        $id: 'session-id' 
      })
      mockAccount.get = vi.fn().mockResolvedValue(testUser)

      await store.signup('test@example.com', 'password123', 'John Doe')

      expect(mockAccount.create).toHaveBeenCalledWith({
        userId: 'unique()',
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe'
      })
      expect(mockAccount.createEmailPasswordSession).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(store.user).toEqual(testUser)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should signup without name', async () => {
      const testUser = createMockUser()
      mockAccount.create = vi.fn().mockResolvedValue({ $id: 'user-id' })
      mockAccount.createEmailPasswordSession = vi.fn().mockResolvedValue({ 
        $id: 'session-id' 
      })
      mockAccount.get = vi.fn().mockResolvedValue(testUser)

      await store.signup('test@example.com', 'password123')

      expect(mockAccount.create).toHaveBeenCalledWith({
        userId: 'unique()',
        email: 'test@example.com',
        password: 'password123',
        name: undefined
      })
    })

    it('should handle signup error', async () => {
      const errorMessage = 'Email already exists'
      mockAccount.create = vi.fn().mockRejectedValue(new Error(errorMessage))

      await expect(store.signup('test@example.com', 'password123'))
        .rejects.toThrow(errorMessage)

      expect(store.user).toBeNull()
      expect(store.error).toBe(errorMessage)
    })

    it('should handle login error after successful signup', async () => {
      mockAccount.create = vi.fn().mockResolvedValue({ $id: 'user-id' })
      mockAccount.createEmailPasswordSession = vi.fn().mockRejectedValue(
        new Error('Session creation failed')
      )

      await expect(store.signup('test@example.com', 'password123'))
        .rejects.toThrow('Session creation failed')

      expect(mockAccount.create).toHaveBeenCalled()
      expect(store.error).toBe('Session creation failed')
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      store.user = createMockUser() as any
    })

    it('should logout successfully', async () => {
      mockAccount.deleteSession = vi.fn().mockResolvedValue(true)

      await store.logout()

      expect(mockAccount.deleteSession).toHaveBeenCalledWith({ 
        sessionId: 'current' 
      })
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle logout error gracefully', async () => {
      mockAccount.deleteSession = vi.fn().mockRejectedValue(new Error('Logout failed'))

      await store.logout()

      expect(console.error).toHaveBeenCalledWith('Logout error:', expect.any(Error))
      // User should still be cleared even if API call fails
      expect(store.user).toBeNull()
    })

    it('should handle missing account gracefully', async () => {
      vi.mocked(mockUseAppwrite).mockReturnValueOnce({
        client: mockUseAppwrite().client,
        account: null as any
      })
      
      const freshStore = useAuthStore()
      freshStore.user = createMockUser() as any

      await freshStore.logout()

      // Should not throw error, just return early
      expect(freshStore.user).toEqual(createMockUser()) // User remains unchanged
    })
  })

  describe('fetchUser', () => {
    it('should fetch user successfully', async () => {
      const testUser = createMockUser()
      mockAccount.get = vi.fn().mockResolvedValue(testUser)

      await store.fetchUser()

      expect(mockAccount.get).toHaveBeenCalled()
      expect(store.user).toEqual(testUser)
    })

    it('should handle fetch user error', async () => {
      mockAccount.get = vi.fn().mockRejectedValue(new Error('Unauthorized'))

      await store.fetchUser()

      expect(store.user).toBeNull()
    })

    it('should handle missing account gracefully', async () => {
      vi.mocked(mockUseAppwrite).mockReturnValueOnce({
        client: mockUseAppwrite().client,
        account: null as any
      })
      
      const freshStore = useAuthStore()

      await freshStore.fetchUser()

      // Should not throw error, just return early
      expect(freshStore.user).toBeNull()
    })
  })

  describe('computed properties', () => {
    it('should update isAuthenticated when user changes', () => {
      expect(store.isAuthenticated).toBe(false)

      store.user = createMockUser() as any
      expect(store.isAuthenticated).toBe(true)

      store.user = null
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should clear error on successful operations', async () => {
      // Set initial error
      store.error = 'Previous error'
      
      const testUser = createMockUser()
      mockAccount.createEmailPasswordSession = vi.fn().mockResolvedValue({ 
        $id: 'session-id' 
      })
      mockAccount.get = vi.fn().mockResolvedValue(testUser)

      await store.login('test@example.com', 'password123')

      expect(store.error).toBeNull()
    })

    it('should preserve loading state during errors', async () => {
      mockAccount.createEmailPasswordSession = vi.fn().mockRejectedValue(new Error('Login failed'))

      await expect(store.login('test@example.com', 'wrong-password'))
        .rejects.toThrow('Login failed')

      expect(store.isLoading).toBe(false)
    })
  })
})