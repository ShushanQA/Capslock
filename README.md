# Capslock QA Testing Project

This project contains automated tests for the test-qa.capslock.global website using Playwright and TypeScript with Page Object Model (POM) pattern.

## Project Structure

```
Capslock/
├── pages/                          # Page Object Model (POM) files
│   └── FormPage.ts                # Form page with all locators and methods
├── tests/                          # Test files
│   └── form-validation-pom.spec.ts # Main form validation tests (POM)
├── screenshots/                    # Screenshots captured during testing
├── test-results/                   # Playwright test results
├── BUGS.md                         # Bug documentation report
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in UI mode:
```bash
npm run test:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run specific test file:
```bash
npx playwright test tests/form-validation-pom.spec.ts
```

## Architecture

### Page Object Model (POM)
The project uses Page Object Model pattern for better code organization and maintainability:
- **`pages/FormPage.ts`**: Contains all form locators and reusable methods
- All form interactions are centralized in the POM class
- Makes tests more readable and maintainable

## Test Coverage

The test suite covers:

1. **Required Field Validation**
   - Empty form submission
   - Missing required fields on each step

2. **Zipcode Validation**
   - Exactly 5 digits requirement
   - Invalid formats (4 digits, 6 digits, non-numeric)

3. **Name Field Validation**
   - Required field validation
   - Format validation (special characters, spaces only)

4. **Email Validation**
   - Required field validation
   - Email format validation (invalid formats, missing @, missing domain)
   - Duplicate email checking

5. **Phone Number Validation**
   - Exactly 10 digits requirement
   - Invalid formats (9 digits, 11 digits, with formatting)

6. **Form Submission**
   - Successful submission flow
   - Redirect to Thank you page

## Bug Documentation

All bugs found during testing are documented in `BUGS.md` with:
- Bug description
- Steps to reproduce
- Expected result
- Actual result
- Screenshots

## Configuration

- **Base URL**: https://test-qa.capslock.global
- **Browser**: Chromium
- **Timeout**: 30 seconds (default), 60 seconds for complex tests
- **Screenshots**: Captured on failure and for bug documentation

