 
import { defineEventHandler, readBody, createError } from 'h3'
import { Client, Databases, Permission, Role } from 'appwrite'
import { getCurrentUser } from '../utils/auth'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  const { name, color, icon } = await readBody<{ name: string; color: string; icon: string }>(event)
  if (!name || !color || !icon) {
    throw createError({ statusCode: 400, statusMessage: 'Missing wallet fields' })
  }
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    // @ts-expect-error: setKey not in TS defs, required for server SDK API key
    .setKey(config.private.appwriteApiKey)
  const db = new Databases(client)
  const now = new Date().toISOString()
  const wallet = await db.createDocument(
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
