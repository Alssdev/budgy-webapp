import { defineEventHandler, readBody, createError } from 'h3'
import { Permission, Role } from 'node-appwrite'
import { createAdminClient } from '~/server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const { id: walletId } = event.context.params || {}
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const { type, amount, description } = await readBody<{ type: 'in' | 'out'; amount: number; description?: string }>(event)
  if (!type || typeof amount !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid transaction payload' })
  }
  
  const { databases } = createAdminClient()
  // Fetch and verify wallet
  let wallet
  try {
    wallet = await databases.getDocument('Budgy', 'wallets', walletId)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const currentBalance = wallet.balance as number
  const newBalance = type === 'in' ? currentBalance + amount : currentBalance - amount
  // Start transaction
  const tx = await databases.createTransaction()
  try {
    const now = new Date().toISOString()
    // Create transaction record
    const record = await databases.createDocument(
      'Budgy',
      'transactions',
      user.$id,
      { walletId, type, amount, description: description || '', timestamp: now, resultingBalance: newBalance },
      [Permission.read(Role.user(user.$id))],
      tx.$id
    )
    // Update wallet balance
    await databases.updateDocument(
      'Budgy',
      'wallets',
      walletId,
      { balance: newBalance },
      [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))],
      tx.$id
    )
    // Commit transaction
    await databases.updateTransaction(tx.$id, true)
    return record
  } catch {
    // Rollback on error
    await databases.updateTransaction(tx.$id, false)
    throw createError({ statusCode: 500, statusMessage: 'Transaction failed' })
  }
})