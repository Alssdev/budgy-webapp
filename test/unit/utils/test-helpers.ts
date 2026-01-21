import { vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockFetch } from '../mocks/appwrite'

/**
 * Sets up a fresh Pinia instance for each test
 */
export const setupPinia = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Mocks the global $fetch function
 */
export const setupMockFetch = () => {
  // Mock the global $fetch
  global.$fetch = mockFetch as any
  return mockFetch
}

/**
 * Creates a mock fetch response
 */
export const createMockFetchResponse = <T>(data: T, options: { delay?: number; error?: boolean } = {}) => {
  if (options.error) {
    return Promise.reject(new Error('Mock fetch error'))
  }
  
  if (options.delay) {
    return new Promise<T>((resolve) => {
      setTimeout(() => resolve(data), options.delay)
    })
  }
  
  return Promise.resolve(data)
}

/**
 * Waits for the next tick
 */
export const nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

/**
 * Waits for a condition to be true
 */
export const waitFor = async (
  condition: () => boolean | Promise<boolean>,
  timeout = 1000,
  interval = 10
): Promise<void> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  throw new Error(`Condition not met within ${timeout}ms`)
}

/**
 * Mock console methods
 */
export const mockConsole = () => {
  const originalConsole = { ...console }
  
  console.error = vi.fn()
  console.warn = vi.fn()
  console.log = vi.fn()
  console.info = vi.fn()
  
  return {
    restore: () => {
      console.error = originalConsole.error
      console.warn = originalConsole.warn
      console.log = originalConsole.log
      console.info = originalConsole.info
    }
  }
}