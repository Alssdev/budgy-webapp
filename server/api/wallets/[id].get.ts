 
import { defineEventHandler, createError } from 'h3'
import { Client, Databases } from 'appwrite'
import { getCurrentUser } from '../utils/auth'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {}
  const user = await getCurrentUser(event)
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    // @ts-expect-error: setKey not in TS defs, required for server SDK API key
    .setKey(config.private.appwriteApiKey)
  const db = new Databases(client)
  let wallet
  try {
    wallet = await db.getDocument('Budgy', 'wallets', id)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  return wallet
})
