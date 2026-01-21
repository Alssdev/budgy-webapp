 
import { defineEventHandler, readBody, createError } from 'h3'
import { Client, Databases, Permission, Role } from 'appwrite'
import { getCurrentUser } from '../../../utils/auth'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { id: walletId } = event.context.params || {}
  const user = await getCurrentUser(event)
  const { type, amount, description } = await readBody<{ type: 'in' | 'out'; amount: number; description?: string }>(event)
  if (!type || typeof amount !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid transaction payload' })
  }
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    // @ts-expect-error: setKey not in TS defs, required for server SDK API key
    .setKey(config.private.appwriteApiKey)
  const db = new Databases(client)
  // Fetch and verify wallet
  let wallet
  try {
    wallet = await db.getDocument('Budgy', 'wallets', walletId)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const currentBalance = wallet.balance as number
  const newBalance = type === 'in' ? currentBalance + amount : currentBalance - amount
  // Start transaction
  const tx = await db.createTransaction()
  try {
    const now = new Date().toISOString()
    // Create transaction record
    const record = await db.createDocument(
      'Budgy',
      'transactions',
      user.$id,
      { walletId, type, amount, description: description || '', timestamp: now, resultingBalance: newBalance },
      [Permission.read(Role.user(user.$id))],
      tx.$id
    )
    // Update wallet balance
    await db.updateDocument(
      'Budgy',
      'wallets',
      walletId,
      { balance: newBalance },
      [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))],
      tx.$id
    )
    // Commit transaction
    await db.updateTransaction(tx.$id, true)
    return record
  } catch {
    // Rollback on error
    await db.updateTransaction(tx.$id, false)
    throw createError({ statusCode: 500, statusMessage: 'Transaction failed' })
  }
})
