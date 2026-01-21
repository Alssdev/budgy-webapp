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
- [x] Implement wallet CRUD endpoints/functions (create, update, delete)
- [x] Implement atomic transaction recording: insert transaction + adjust wallet.balance

## 3. Stores & Composables
- [ ] Scaffold `useWalletStore` (list, get, create, update, delete wallets)
- [ ] Scaffold `useTransactionStore` (list, add transactions for a wallet)

## 4. Core UI Components
- [ ] Build `WalletList` / `WalletCard` showing name, balance, color, icon
- [ ] Build `WalletDetails` header + `TransactionList` component
- [ ] Build `TransactionItem` to display amount, type, resultingBalance, timestamp
- [ ] Build `NewTransactionForm` for incoming/outgoing transactions

## 5. Visual Identity Integration
- [ ] Integrate color and icon picker in wallet form
- [ ] Apply Tailwind-driven theming for wallet cards and icons

## 6. Validation & Tests
- [ ] Write unit tests for Pinia stores and composables
- [ ] Add end-to-end or smoke tests for wallet creation and transaction flow

## 7. App Pages
- [ ] Scaffold wallet overview/list page (cards, selectors, navigation)
- [ ] Create wallet detail page with header, transaction area, and new transaction form
- [ ] Wire routes/navigation so wallets can be created/selected from the main flow

---
_Generated as internal guide—no code yet._
