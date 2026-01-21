import { createSessionClient } from '../utils/appwrite'

export default defineEventHandler(async (event) => {
  const { account } = createSessionClient(event)

  try {
    event.context.user = await account.get()
  } catch {
    // Silently handle unauthorized/no session
  }
})