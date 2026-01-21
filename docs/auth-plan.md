# Auth Integration Plan


## 1. Initialize SDK (Tutorial Step 3)
- Use the `@appwrite/node` SDK for server utilities.
- Create `server/utils/appwrite.ts` with two factory functions:
  - `createAdminClient()`: sets endpoint, project, and API key for server operations.
  - `createSessionClient(event)`: sets endpoint and project, reads session cookie, and calls `client.setSession()`.
  - Export `account` service from each.

## 2. Runtime Config (Step 3)
- Use existing `appwriteApiKey` (private) and `public.appwriteEndpoint`, `public.appwriteProjectId` in `nuxt.config.ts`.

## 3. Server Middleware (Step 4)
- Create `server/middleware/auth.ts`:
  - Call `createSessionClient(event)`, then `event.context.user = await account.get()`.
  - Silence errors if no session.
- Create a new `env.d.ts` at project root and extend H3 context types to include `user?: Models.User<Preferences<any>>`.

## 4. Finalize & Testing (Step 9)
- Verify full SSR auth flow: session setup, middleware, and protected routes.
- Add unit tests for `createSessionClient`, auth middleware, and redirects.
