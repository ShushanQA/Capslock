# Capslock QA Testing - Playwright + TypeScript

Automated testing suite for `test-qa.capslock.global` using Playwright and TypeScript with a focus on maintainability, reliability, and clean architecture.

## Project Structure

```
Capslock/
├── pages/              # Page Object Model (POM) - UI interactions
│   └── FormPage.ts     # Form page object with reliable locators
├── test-data/          # Centralized test data
│   └── test-data.ts    # All test values and constants
├── utils/              # Reusable test utilities
│   └── test-helpers.ts # Common flows and assertion helpers
├── tests/               # Test specifications
│   └── form-validation-pom.spec.ts
├── playwright.config.ts # Playwright configuration
├── tsconfig.json       # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## Architecture Principles

### 1. **Reliable Locators**
- Primary: Data attributes (`data-zip-code-input`, `data-tracking`)
- Fallback: Semantic attributes (`name`, `for`, `type`, `id`)
- Avoids brittle CSS selector chains
- Waits for meaningful UI states instead of arbitrary timeouts

### 2. **Centralized Test Data**
All test values are defined in `test-data/test-data.ts`:
- Valid test data
- Invalid test cases
- URLs and timeouts
- Helper functions for generating unique values

### 3. **Reusable Test Utilities**
Common flows and assertions in `utils/test-helpers.ts`:
- `navigateToStep4()` - Navigate through steps 1-3
- `navigateToStep5()` - Navigate through steps 1-4
- `completeFullForm()` - Complete entire form
- `expectThankYouPage()` - Meaningful assertion for success
- `expectValidationErrors()` - Meaningful assertion for validation

### 4. **Page Object Model (POM)**
- Clear separation between page interactions and test logic
- All locators centralized in `FormPage.ts`
- Methods wait for meaningful UI states
- No hardcoded values in page objects

### 5. **Meaningful Assertions**
- Verify actual behavior, not just element visibility
- Check for thank you page content and URL
- Validate form state transitions
- Assert validation messages and error states

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test
npm test -- --grep "Should validate that all fields are required"
```

## Test Coverage

### Form Validation Tests
1. **Required Field Validation** - Ensures all fields are required
2. **Zipcode Format Validation** - Tests invalid zipcode formats
3. **Full Flow Validation** - Complete form with positive and negative cases
4. **Duplicate Email Prevention** - Ensures unique email registration
5. **Bug Verification Tests** - Tests for 6 specific reported bugs

### Bug Tests
- Bug 1: Email validation (test@test)
- Bug 2: Duplicate email registration
- Bug 3: Phone number with all zeros (0000000000)
- Bug 4: Phone number starting with 1
- Bug 5: Thank you page direct URL access
- Bug 6: Special zipcodes skipping steps (11111, 12345)

## Configuration

### Playwright Config (`playwright.config.ts`)
- Global timeout: 3 minutes
- Expect timeout: 30 seconds
- Action timeout: 30 seconds
- Navigation timeout: 60 seconds
- Base URL: `https://test-qa.capslock.global`

### TypeScript Config (`tsconfig.json`)
- Target: ES2020
- Module: CommonJS
- Includes: tests, pages, test-data, utils

## CI/CD

GitHub Actions workflows:
- `.github/workflows/ci.yml` - Runs on push/PR
- `.github/workflows/deployment-tests.yml` - Runs after deployment

Both workflows:
- Install dependencies
- Run Playwright tests
- Upload test reports, screenshots, and videos as artifacts

## Best Practices

### Adding New Tests
1. Use centralized test data from `test-data/test-data.ts`
2. Use helper functions from `utils/test-helpers.ts` for common flows
3. Add page interactions to `FormPage.ts` if needed
4. Write meaningful assertions that verify behavior, not just visibility

### Adding New Test Data
Add to `test-data/test-data.ts`:
```typescript
export const TestData = {
  newTestValue: 'value',
  // ...
}
```

### Adding New Helper Functions
Add to `utils/test-helpers.ts`:
```typescript
export async function newHelperFunction(page: Page): Promise<void> {
  // Implementation
}
```

## Screenshots and Reports

- Screenshots: `screenshots/` directory (gitignored)
- Test results: `test-results/` directory (gitignored)
- HTML reports: `playwright-report/` directory (gitignored)

## Dependencies

- `@playwright/test` - Testing framework
- `typescript` - Type safety
- `@types/node` - Node.js type definitions

## License

ISC
