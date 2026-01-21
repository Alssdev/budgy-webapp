 
import { defineEventHandler, createError } from 'h3'
import { Query } from 'node-appwrite'
import { createAdminClient } from '~/server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const { databases } = createAdminClient()
  try {
    const result = await databases.listDocuments({
      databaseId: 'Budgy',
      collectionId: 'wallets',
      queries: [
        Query.equal('userId', [user.$id]),
        Query.equal('isDeleted', [false])
      ]
    })
    return result.documents
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to list wallets' })
  }
})
