 
import { defineEventHandler, createError } from 'h3'
import { Client, Databases, Query } from 'appwrite'
import { getCurrentUser } from '../utils/auth'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    // @ts-expect-error: setKey not in TS defs, required for server SDK API key
    .setKey(config.private.appwriteApiKey)
  const db = new Databases(client)
  try {
    const result = await db.listDocuments('Budgy', 'wallets', [
      Query.equal('userId', [user.$id]),
      Query.equal('isDeleted', [false])
    ])
    return result.documents
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to list wallets' })
  }
})
