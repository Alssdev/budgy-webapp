# Stores & Composables Plan


## Goals
- Centralize data fetching and state management for wallets and transactions
- Expose reactive state, actions, and getters to drive UI components
- Integrate cleanly with server APIs via Nuxt fetch utilities

## 1. Wallet Store (stores/useWalletStore.ts)
- **State**: `wallets`, `activeWallet`, `isLoading`, `error`
- **Actions**:
  - `fetchWallets()`: GET `/api/wallets`
  - `fetchWallet(id)`: GET `/api/wallets/:id`
  - `createWallet(data)`: POST `/api/wallets`
  - `updateWallet(id, data)`: PUT `/api/wallets/:id`
  - `deleteWallet(id)`: DELETE `/api/wallets/:id`
- **Getters**:
  - `walletCount`: number of loaded wallets
  - `getWalletById(id): Wallet | undefined`

## 2. Transaction Store (stores/useTransactionStore.ts)
- **State**: `transactions`, `isLoading`, `error`
- **Actions**:
  - `fetchTransactions(walletId)`: GET `/api/wallets/:id/transactions`
  - `addTransaction(walletId, payload)`: POST `/api/wallets/:id/transactions`
- **Getters**:
  - `transactionCount`: total transactions
  - `getRecentTransactions(limit)`: latest N transactions

## 3. API Integration
- Use Nuxt `useFetch` or `$fetch` for endpoint calls
- Handle HTTP errors and update loading/error flags consistently
- Base endpoint path: `/api`

## 4. Type Definitions
- Define `Wallet` and `Transaction` interfaces in `types/` or alongside stores
- Mirror backend models minimally for type safety

## 5. Scaffolding Steps
1. Create `stores/useWalletStore.ts` and define Pinia store with state, actions, getters
2. Create `stores/useTransactionStore.ts` similarly
3. Add `types/wallet.ts` and `types/transaction.ts` for model definitions
4. Write unit tests (Vitest) for store actions and state transitions
5. Validate store usage in a test page or component
