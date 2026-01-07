/**
 * Centralized test data for form validation tests
 * All test values should be defined here to maintain consistency and ease updates
 */

export const TestData = {
  // Valid test data
  valid: {
    zipcode: '23451',
    name: 'John Smith',
    email: {
      base: 'testuser',
      domain: 'example.com',
    },
    phone: '1234567890',
  },

  // Invalid zipcode test cases
  invalidZipcodes: {
    lessThan5Digits: '1234',
    moreThan5Digits: '123456',
    nonNumeric: '12abc',
    empty: '',
    // Special zipcodes that redirect to out-of-area stage (expected business behavior, NOT bugs)
    specialZipcodes: {
      outOfArea1: '11111', // Redirects to out-of-area stage
      outOfArea2: '12345', // Redirects to out-of-area stage
    },
  },

  // Invalid email test cases
  invalidEmails: {
    noDomain: 'test@test',
    invalidFormat: 'invalid-email-format',
    noAtSymbol: 'testtest.com',
    noDomainExtension: 'test@test',
  },

  // Invalid phone test cases
  invalidPhones: {
    lessThan10Digits: '123456789',
    moreThan10Digits: '12345678901',
    allZeros: '0000000000',
    withDashes: '123-456-7890',
    nonNumeric: '123-456-789a',
  },

  // Test user data
  users: {
    default: {
      name: 'Test User',
      email: 'test@test.test',
      phone: '1234567890',
    },
    johnDoe: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1111111111',
    },
    janeSmith: {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '2222222222',
    },
  },

  // URLs
  urls: {
    base: 'https://test-qa.capslock.global',
    thankYou: 'https://test-qa.capslock.global/thankyou',
  },

  // Timeouts (in milliseconds)
  timeouts: {
    short: 1000,
    medium: 2000,
    long: 5000,
    stepTransition: 3000,
    formSubmission: 5000,
  },

  // Generate unique email with timestamp
  generateUniqueEmail(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}@${this.valid.email.domain}`;
  },

  // Generate unique email for duplicate testing
  generateDuplicateTestEmail(): string {
    return `duplicate-test-${Date.now()}@${this.valid.email.domain}`;
  },
} as const;

