import { Client, Account } from 'appwrite'

export const useAppwrite = () => {
  const config = useRuntimeConfig()

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint as string)
    .setProject(config.public.appwriteProjectId as string)

  const account = new Account(client)

  return {
    client,
    account
  }
}