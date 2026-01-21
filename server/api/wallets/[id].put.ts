 
import { defineEventHandler, readBody, createError } from 'h3'
import { Client, Databases, Permission, Role } from 'appwrite'
import { getCurrentUser } from '../utils/auth'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {}
  const user = await getCurrentUser(event)
  const { name, color, icon } = await readBody<{ name?: string; color?: string; icon?: string }>(event)
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
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const updates: Record<string, unknown> = {}
  if (name) updates.name = name
  if (color) updates.color = color
  if (icon) updates.icon = icon
  if (!Object.keys(updates).length) {
    throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })
  }
  const updated = await db.updateDocument(
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
