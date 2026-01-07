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
│   └── form-validation.spec.ts
├── TEST_SCENARIOS.md   # Comprehensive test scenarios documentation
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

For comprehensive test scenarios documentation, including all 91 scenarios, priorities, coverage status, and detailed bug information, see **[TEST_SCENARIOS.md](./TEST_SCENARIOS.md)**.

The test suite currently covers:
- Required field validations (all steps)
- Format validations (zipcode, email, phone)
- Full form flow (positive and negative cases)
- Bug verification tests

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
- Upload test reports, screenshots

## Test Scenarios Documentation

See **[TEST_SCENARIOS.md](./TEST_SCENARIOS.md)** for:
- Complete list of 91 test scenarios organized by form step
- Priority system and coverage tracking
- Top priority scenarios with detailed explanations
- Framework improvement ideas
- Usage guidelines for test planning and reporting

## Best Practices

### Adding New Tests
1. **Review TEST_SCENARIOS.md** - Check if scenario already exists or add new one
2. Use centralized test data from `test-data/test-data.ts`
3. Use helper functions from `utils/test-helpers.ts` for common flows
4. Add page interactions to `FormPage.ts` if needed
5. Write meaningful assertions that verify behavior, not just visibility
6. **Update TEST_SCENARIOS.md** - Mark scenario as covered after implementing test

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
- Test Scenarios Documentation: See `TEST_SCENARIOS.md` for detailed scenario documentation

## Dependencies

- `@playwright/test` - Testing framework
- `typescript` - Type safety
- `@types/node` - Node.js type definitions

## License

ISC
