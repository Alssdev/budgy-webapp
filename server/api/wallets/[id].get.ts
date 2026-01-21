 
import { defineEventHandler, createError } from 'h3'
import { createAdminClient } from '~/server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {}
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const { databases } = createAdminClient()
  let wallet
  try {
    wallet = await databases.getDocument('Budgy', 'wallets', id)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  return wallet
})
