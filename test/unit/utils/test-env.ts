/**
 * Test environment configuration utilities
 */

// Test Appwrite configuration
export const testConfig = {
  appwrite: {
    endpoint: process.env.APPWRITE_ENDPOINT || 'http://localhost:8080/v1',
    projectId: process.env.APPWRITE_PROJECT_ID || 'test-project-id',
    apiKey: process.env.APPWRITE_API_KEY || 'test-api-key',
    databaseId: process.env.APPWRITE_DATABASE_ID || 'test-database-id',
    collections: {
      wallets: process.env.APPWRITE_WALLETS_COLLECTION_ID || 'test-wallets-collection',
      transactions: process.env.APPWRITE_TRANSACTIONS_COLLECTION_ID || 'test-transactions-collection',
    }
  },
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@budgy.test',
    password: process.env.TEST_USER_PASSWORD || 'test123password',
    name: process.env.TEST_USER_NAME || 'Test User',
  },
  e2e: {
    baseUrl: process.env.E2E_BASE_URL || 'http://localhost:3000',
    timeout: parseInt(process.env.E2E_TIMEOUT || '30000'),
  },
  cleanup: process.env.CLEANUP_TEST_DATA === 'true',
}

/**
 * Validates test environment configuration
 */
export const validateTestConfig = () => {
  const errors: string[] = []
  
  if (!testConfig.appwrite.endpoint) {
    errors.push('APPWRITE_ENDPOINT is required')
  }
  
  if (!testConfig.appwrite.projectId) {
    errors.push('APPWRITE_PROJECT_ID is required')
  }
  
  if (errors.length > 0) {
    throw new Error(`Test configuration errors: ${errors.join(', ')}`)
  }
}

/**
 * Creates test-specific collection IDs to avoid conflicts
 */
export const createTestCollectionId = (base: string) => {
  const timestamp = Date.now()
  return `${base}-${timestamp}`
}

export default testConfig