# Section 4 – Core UI Components Plan

1. **Component placement & scope**
   - Place each piece under `components/wallet/` so files stay focused.
   - Keep components small: `WalletList` (list wrapper), `WalletCard` (single wallet preview), `WalletDetails` (header + extra slots), `TransactionList` (renders list), `TransactionItem` (single row), `NewTransactionForm` (form controls).

2. **Props/contracts**
   - `WalletCard`: takes `wallet` object (name, balance, color, icon) and emits `select`.
   - `WalletList`: receives `wallets` array and emits selection.
   - `WalletDetails`: expects `wallet`, `transactions`, and handles layout for header, list, and form.
   - `TransactionList`: accepts `transactions` array, delegates to `TransactionItem`.
   - `TransactionItem`: accepts `transaction` (amount, type, resultingBalance, timestamp).
   - `NewTransactionForm`: accepts an `onSubmit` callback with amount, type, description; handles incoming/outgoing toggle.

3. **Visual direction & Tailwind**
   - Use Tailwind utility classes for color, layout, and spacing; rely on design tokens or palette variables (no hard-coded colors).
   - Apply purposeful typography (serif or expressive font class if set globally) and subtle gradients/backgrounds using utility classes.
   - Ensure mobile-first layouts with responsive classes (sm/md breakpoints) and purposeful spacing.

4. **Implementation order**
   1. Build `WalletCard`/`WalletList` with placeholder data styling.
   2. Implement `WalletDetails` header and integrate `TransactionList` + placeholder `TransactionItem` entries.
   3. Flesh out `TransactionItem` display and formatting (type badges, timestamp formatting, resulting balance).
   4. Create `NewTransactionForm` input controls, type toggle, validation hints, and emit form payload.

5. **Integration notes**
   - Keep components decoupled so stores/composables can hook up later.
   - Document expected props/events in component comments if needed.
   - Plan for future theming by using existing Tailwind palettes and avoiding inline styles.
