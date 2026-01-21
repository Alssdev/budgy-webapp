<!--
Internal TODO: Wallet Feature Execution Steps
-->
# Wallet Feature TODO

This checklist outlines the phases and tasks to implement the multi‑wallet feature.

## 1. Schema Definition
- [x] Create `wallets` collection with: id, userId, name, balance, color, icon, createdAt
- [x] Create `transactions` collection with: id, walletId, type, amount, description, timestamp, resultingBalance
- [x] Configure Appwrite permissions so users can only access their own wallets/transactions

## 2. Server Logic
- [ ] Implement wallet CRUD endpoints/functions (create, update, delete)
- [ ] Implement atomic transaction recording: insert transaction + adjust wallet.balance

## 3. Global Currency Config
- [ ] Add `runtimeConfig.public.currencyCode` (e.g. "USD") for default currency
- [ ] Use this config in transaction/wallet formatting on client side

## 4. Stores & Composables
- [ ] Scaffold `useWalletStore` (list, get, create, update, delete wallets)
- [ ] Scaffold `useTransactionStore` (list, add transactions for a wallet)

## 5. Core UI Components
- [ ] Build `WalletList` / `WalletCard` showing name, balance, color, icon
- [ ] Build `WalletDetails` header + `TransactionList` component
- [ ] Build `TransactionItem` to display amount, type, resultingBalance, timestamp
- [ ] Build `NewTransactionForm` for incoming/outgoing transactions

## 6. Visual Identity Integration
- [ ] Integrate color and icon picker in wallet form
- [ ] Apply Tailwind-driven theming for wallet cards and icons

## 7. Validation & Tests
- [ ] Write unit tests for Pinia stores and composables
- [ ] Add end-to-end or smoke tests for wallet creation and transaction flow

---
_Generated as internal guide—no code yet._
