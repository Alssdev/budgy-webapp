import { defineEventHandler, readBody, createError } from 'h3'
import { Permission, Role } from 'node-appwrite'
import { createAdminClient } from '~/server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {}
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const { name, color, icon } = await readBody<{ name?: string; color?: string; icon?: string }>(event)
  const { databases } = createAdminClient()
  let wallet
  try {
    wallet = await databases.getDocument('Budgy', 'wallets', id)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Wallet not found' })
  }
  if (wallet.userId !== user.$id || wallet.isDeleted) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const updates: Record<string, unknown> = {}
  if (name) updates.name = name
  if (color) updates.color = color
  if (icon) updates.icon = icon
  if (!Object.keys(updates).length) {
    throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })
  }
  const updated = await databases.updateDocument(
    'Budgy',
    'wallets',
    id,
    updates,
    [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id))
    ]
  )
  return updated
})