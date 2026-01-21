# Auth Integration Plan


## 1. Initialize SDK (Tutorial Step 3)
- Create `server/lib/appwrite.ts` with two factory functions:
  - `createAdminClient()`: sets endpoint, project, and API key for server operations.
  - `createSessionClient(event)`: sets endpoint and project, reads session cookie, and calls `client.setSession()`.
  - Export `account` service from each.

## 2. Runtime Config (Step 3)
- Add `appwriteKey` (private) and `public.appwriteEndpoint`, `public.appwriteProjectId` to `nuxt.config.ts`.

## 3. Server Middleware (Step 4)
- Create `server/middleware/auth.ts`:
  - Call `createSessionClient(event)`, then `event.context.user = await account.get()`.
  - Silence errors if no session.
- Extend H3 context types in `env.d.ts` to include `user?: Models.User<Preferences>`.

## 4. Root Redirect (Step 4)
- Add `server/api/index.get.ts` to redirect:
  - If `event.context.user`, redirect to `/account`; otherwise to `/signup`.

## 5. Sign-up & Sign-in Pages (Steps 5–8)
- Build/adjust `pages/signup.vue` and `pages/signin.vue`:
  - Use `account.create()` / `account.createEmailPasswordSession()` via `createSessionClient`.
  - On success, redirect to `/account`.

## 6. Account Page (Step 6)
- Build `pages/account.vue`:
  - Display `context.user` data server‑side (SSR) and client‑side fallback.
  - Protect route using `server/middleware/auth.ts` or page middleware.

## 7. OAuth Authentication (Step 7)
- Add OAuth2 buttons (Google, GitHub) on sign-in page.
- Use `account.createOAuth2Session()` server-initiated for SSR flows.

## 8. Enable Pages & Middleware (Step 8)
- Ensure auth middleware runs globally for protected routes (account, wallets).
- Adjust Nuxt route config or page `middleware: 'auth'` directive.

## 9. Finalize & Testing (Step 9)
- Verify full SSR flow: sign-up, sign-in, page redirect, SSR user context.
- Add unit tests for `createSessionClient`, middleware, and page redirects.
