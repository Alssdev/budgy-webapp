import { Client, Account, Databases } from 'node-appwrite'
import { getCookie } from 'h3'

export const SESSION_COOKIE = 'a_session_console'

export function createAdminClient() {
  const config = useRuntimeConfig()

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)
    .setKey(config.private.appwriteApiKey as string)

  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
    get client() {
      return client
    }
  }
}

export function createSessionClient(event: import('h3').H3Event) {
  const config = useRuntimeConfig(event)

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)

  const session = getCookie(event, SESSION_COOKIE)
  if (session) {
    client.setSession(session)
  }

  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
    get client() {
      return client
    }
  }
}