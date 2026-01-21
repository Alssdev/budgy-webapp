 
import { Client, Account } from 'appwrite'
import { createError } from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * Reads Appwrite session cookie and returns authenticated user.
 * Throws 401 if no valid session exists.
 */
export async function getCurrentUser(_event: import('h3').H3Event) {
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    // @ts-expect-error: setKey not in TS defs, required for server SDK API key
    .setKey(config.private.appwriteApiKey)

  const account = new Account(client)
  try {
    return await account.get()
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
