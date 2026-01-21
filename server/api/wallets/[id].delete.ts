import { defineEventHandler, createError } from 'h3'
import { Permission, Role } from 'node-appwrite'
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
    wallet = await databases.getDocument({
      databaseId: 'Budgy',
      collectionId: 'wallets',
      documentId: id
    })
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const deleted = await databases.updateDocument({
    databaseId: 'Budgy',
    collectionId: 'wallets',
    documentId: id,
    data: { isDeleted: true },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id))
    ]
  })
  return deleted
})
