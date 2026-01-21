 
import { defineEventHandler, readBody, createError } from 'h3'
import { Permission, Role } from 'node-appwrite'
import { createAdminClient } from '~/server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const { name, color, icon } = await readBody<{ name: string; color: string; icon: string }>(event)
  if (!name || !color || !icon) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wallet fields' })
  }
  const { databases } = createAdminClient()
  const now = new Date().toISOString()
  const wallet = await databases.createDocument(
    'Budgy',
    'wallets',
    user.$id,
    { userId: user.$id, name, balance: 0, color, icon, createdAt: now, isDeleted: false },
    [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id))
    ]
  )
  return wallet
})
