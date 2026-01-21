# Section 6 – Validation & Tests Plan

## Goals
- Build a scalable, maintainable test system for the wallet feature covering stores, composables, components, and full user flows
- Ensure test isolation with mocked Appwrite services and authentication states
- Provide both unit tests (fast feedback) and E2E tests (full user journey validation)

## Current Project Status ✅
- **Vitest** (v3.2.4) - Already installed and configured with dual environment setup
- **@nuxt/test-utils** (v3.23.0) - Already installed with proper nuxt.config.ts integration
- **@vue/test-utils** (v2.4.6) - Already installed for Vue component testing
- **vitest.config.ts** - Properly configured for unit and nuxt environments
- **Test directory structure** - Created but empty (`test/unit/` exists)
- **Well-structured codebase** - 8 wallet components, 2 stores, 2 composables ready for testing

## Testing Strategy & Architecture

### 1. Test Environment Setup
- **Vitest** for unit/integration tests ✅ (already configured)
- **Playwright** for E2E tests ❌ (needs installation and configuration)
- **@nuxt/test-utils** for Nuxt-specific testing utilities ✅ (already installed)
- **@vue/test-utils** for Vue component testing ✅ (already installed)
- **Pinia testing utilities** ❌ (needs installation for store mocking)
- Test isolation using separate test databases/collections in Appwrite

### 2. Authentication & Appwrite Mocking Strategy
- Create `test/mocks/appwrite.ts` with mock client mimicking existing `useAppwrite.ts` composable
- Mock authentication states leveraging existing `stores/auth.ts` patterns
- Use environment variables for test database/collection IDs
- Implement test user creation/cleanup utilities
- Mock server-side API endpoints (existing `server/api/wallets/` structure)

### 3. Unit Testing Structure

#### **Store Tests** (`test/stores/`) - Target Existing Stores
- `useWalletStore.test.ts`: Test existing CRUD operations, state management, error handling
- `useTransactionStore.test.ts`: Test existing transaction creation, listing, balance updates
- `auth.test.ts`: Test existing authentication store with Appwrite integration
- Mock Appwrite calls, verify state changes and API interactions
- Test edge cases: network errors, invalid data, concurrent operations

#### **Composable Tests** (`test/composables/`) - Target Existing Composables
- `useAppwrite.test.ts`: Test existing Appwrite client initialization and error handling
- `useWalletAccent.test.ts`: Test existing color palette logic and accent management
- Mock external dependencies (stores, Appwrite)
- Verify reactive behavior and error states
- Test data transformation and validation logic

#### **Component Tests** (`test/components/wallet/`) - Target Existing 8 Components
- `WalletCard.test.ts`: Test wallet display and formatting
- `WalletDetails.test.ts`: Test detailed wallet view interactions
- `WalletList.test.ts`: Test wallet list rendering and selection
- `TransactionItem.test.ts`: Test individual transaction display
- `TransactionList.test.ts`: Test transaction list rendering
- `NewTransactionForm.test.ts`: Test form validation and submission
- `ColorPalettePicker.test.ts`: Test color selection UI
- `IconGridSelector.test.ts`: Test icon selection functionality
- Mock store dependencies using Pinia testing utilities
- Test accessibility attributes and keyboard navigation
- Use `renderSuspended` from `@nuxt/test-utils` for Nuxt context

### 4. Integration Testing
- Test store + composable + API integration with mocked Appwrite
- Verify atomic operations (transaction creation + balance updates)
- Test error propagation through the stack
- Validate data consistency across multiple operations

### 5. End-to-End Testing

#### **Test Scenarios** (`e2e/wallet/`)
- `wallet-management.spec.ts`: Create, edit, delete wallets
- `transaction-flow.spec.ts`: Add income/expense transactions
- `wallet-navigation.spec.ts`: Navigate between wallet list and details
- `visual-identity.spec.ts`: Color/icon picker functionality

#### **E2E Infrastructure**
- Dedicated test Appwrite project/database
- Test user management (create/cleanup between tests)
- Page Object Model for maintainable test code
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing

## Implementation Steps

### Phase 1: Testing Infrastructure ⚠️ (Missing Dependencies)
1. **Install missing dependencies:**
   - `playwright` and `@playwright/test` for E2E testing
   - `@pinia/testing` for store mocking utilities
   - `happy-dom` (already configured in vitest.config.ts)
2. **Configure missing files:**
   - Create `playwright.config.ts` (missing)
   - Verify `vitest.config.ts` works with existing setup ✅
3. **Create test infrastructure:**
   - `test/mocks/appwrite.ts` - Mock existing Appwrite client structure
   - `test/fixtures/` - Test data factories for wallets/transactions
   - `test/utils/` - Test helper functions
   - `test/setup.ts` - Global test configuration
4. **Set up test database configuration** - Environment variables for separate Appwrite project

### Phase 2: Unit Tests (Building on Existing Code)
1. **Store tests** - Test existing `useWalletStore.ts` and `useTransactionStore.ts` with mocked Appwrite calls
2. **Composable tests** - Test existing `useAppwrite.ts` and `useWalletAccent.ts` in isolation
3. **Component tests** - Test existing 8 wallet components with Vue Test Utils
4. **Server-side API tests** - Test existing `server/api/wallets/` endpoints

### Phase 3: Integration Tests
1. Store + API integration tests
2. Component + store integration
3. Cross-component data flow validation

### Phase 4: E2E Tests
1. Set up Playwright with test user management
2. Core user journeys (wallet CRUD, transactions)
3. Visual regression testing for UI components
4. Performance testing for large data sets

## Test Organization (Updated for Current Structure)

```
test/
├── unit/                    # ✅ Already exists but empty
│   ├── fixtures/           # Test data and factories
│   ├── mocks/             # Appwrite and external service mocks
│   ├── utils/             # Test utilities and helpers
│   ├── stores/            # Pinia store unit tests (3 existing stores)
│   ├── composables/       # Composable unit tests (2 existing composables)
│   ├── components/        # Vue component tests (8 existing components)
│   │   └── wallet/        # Wallet component tests
│   ├── integration/       # Cross-layer integration tests
│   └── setup.ts          # Global test configuration
├── server/                # Server-side API tests
│   └── api/              # Test existing server/api/wallets/ endpoints
└── e2e/                  # ❌ Needs creation for Playwright
    ├── support/          # Page objects and test utilities
    ├── fixtures/         # E2E test data
    └── wallet/          # Wallet feature E2E tests
```

## Security & Data Considerations
- Never use production Appwrite project for tests
- Implement proper test data cleanup after each test run
- Use separate test user accounts with limited permissions
- Mock sensitive operations (payments, external APIs)
- Environment variable validation for test configurations

## CI/CD Integration
- Fast unit tests on every PR (< 30 seconds)
- Integration tests on main branch merges
- E2E tests on staging deployments
- Parallel test execution for performance
- Test result reporting and coverage metrics

## Success Metrics
- Unit test coverage > 80% for stores and composables (3 stores, 2 composables)
- Component test coverage > 70% (8 wallet components)
- E2E tests cover all critical user paths (wallet CRUD, transactions)
- Test suite runs < 2 minutes for unit/integration (leveraging existing vitest config)
- E2E suite runs < 10 minutes for full browser matrix

## Prerequisites Checklist

### ✅ Already Complete
- [x] Vitest installed and configured (v3.2.4)
- [x] @nuxt/test-utils installed (v3.23.0) 
- [x] @vue/test-utils installed (v2.4.6)
- [x] vitest.config.ts properly configured
- [x] Test directory structure created
- [x] Well-structured codebase ready for testing

### ❌ Needs Implementation Before Starting Tests
- [ ] Install Playwright and @playwright/test
- [ ] Install @pinia/testing for store testing
- [ ] Create playwright.config.ts configuration
- [ ] Create Appwrite mocking infrastructure
- [ ] Set up test fixtures and utilities
- [ ] Configure test environment variables for separate Appwrite project
- [ ] Create test data cleanup utilities

### 🎯 Ready to Test (Once Prerequisites Complete)
- 3 Pinia stores (useWalletStore, useTransactionStore, auth)
- 2 composables (useAppwrite, useWalletAccent)
- 8 wallet components (complete UI suite)
- Server API endpoints (existing wallet CRUD operations)
- Full user authentication flow with Appwrite integration