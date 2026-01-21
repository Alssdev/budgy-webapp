# Server Logic Plan

**Authenticate via Appwrite session cookie at the top of every route before any business logic.**

## 2.1 Backend Hosting
- Use Nuxt 3 server routes under `server/api/...` for all wallet/transaction logic.

**Auth Helper:**
- Create `getCurrentUser(event)` helper to read the Appwrite session cookie, call `account.get()`, and return the authenticated `userId`, throwing 401 if unauthenticated.

## 2.2 Wallet CRUD Endpoints
| Method   | Path                   | Action                                                                    |
| -------- | ---------------------- | ------------------------------------------------------------------------- |
| POST     | `/api/wallets`         | Create wallet (set `createdAt`, `userId`, grant per-row permissions)      |
| GET      | `/api/wallets`         | List user’s non–soft‑deleted wallets                                      |
| GET      | `/api/wallets/:id`     | Fetch one wallet (404 if not found or soft‑deleted)                       |
| PUT      | `/api/wallets/:id`     | Update name/color/icon                                                    |
| DELETE   | `/api/wallets/:id`     | Soft‑delete wallet: set `isDeleted = true` (don’t remove row)             |

**Details:**
- Add boolean `isDeleted` attribute to `wallets` (default `false`).
- Enforce owner checks (`wallet.userId === auth.userId`).
- Return proper HTTP codes (400/403/404).

## 2.3 Atomic Transaction Recording
**Route:** `POST /api/wallets/:id/transactions`
**Payload:** `{ type: "in"|"out", amount: number, description?: string }`

**Flow (atomic):**
1. Read `wallet.balance`.
2. Compute `newBalance = balance + amount` (negative allowed).
3. Begin Appwrite DB transaction.
4. Within transaction:
   - Insert `transactions` with `{ walletId, type, amount, description, timestamp: now(), resultingBalance: newBalance }` + per-row read permission only.
   - Update `wallets.balance = newBalance`.
5. Commit transaction.

**Error Handling:** rollback on failure; allow negative `newBalance`.

## 2.4 Index Creation
- Create an index on `transactions` for `timestamp` to optimize history queries.

## 2.5 Row‑Level Permissions
- **Wallets:** grant `read`, `update`, `delete` to `Role.user(auth.userId)` on create.
- **Transactions:** grant `read` only to creator; omit update/delete (append‑only).
