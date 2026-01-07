# Bug Report Summary

**Website:** test-qa.capslock.global  
**Testing Date:** January 2025  
**Testing Framework:** Playwright + TypeScript  
**Test Suite:** Automated Form Validation Tests

---

## Executive Summary

This report documents **6 confirmed bugs** found during automated testing of the form validation system. All bugs have been verified through automated test execution and are reproducible.

**Note:** ZIP codes 11111 and 12345 behavior has been verified as expected (shows service area message), not a bug.

---

## Confirmed Bugs

### Bug 1: Email Field Validation Issue
**Severity:** Medium  
**Status:** CONFIRMED

**Description:**  
The email field accepts email addresses without proper domain extensions (e.g., `test@test`). The form should reject emails that don't follow the standard email format with a valid domain.

**Steps to Reproduce:**
1. Navigate to test-qa.capslock.global
2. Complete form steps 1-3 (zipcode, checkbox, property type)
3. Enter name: "Test User"
4. Enter email: `test@test` (no domain extension)
5. Complete phone number and submit

**Expected Result:**  
Form should reject the email and show validation error.

**Actual Result:**  
Form accepts the email and redirects to thank you page.

**Screenshots:**  
- `screenshots/bug1-email-test-at-test-*.png`
- `screenshots/bug1-email-test-at-test-submitted-*.png`

---

### Bug 2: Duplicate Email Registration
**Severity:** High  
**Status:** CONFIRMED

**Description:**  
The system allows multiple users to register with the same email address. This violates data integrity and can cause issues with user management and communication.

**Steps to Reproduce:**
1. Complete full form registration with email: `duplicate-test-{timestamp}@example.com`
2. Verify first registration succeeds (redirects to thank you page)
3. Start a new registration
4. Use the same email address from step 1
5. Complete and submit the form

**Expected Result:**  
System should reject the duplicate email and show an error message.

**Actual Result:**  
System accepts the duplicate email and allows second registration to complete successfully.

**Screenshots:**  
- `screenshots/bug2-first-registration-*.png`
- `screenshots/bug2-duplicate-email-before-submit-*.png`
- `screenshots/bug2-duplicate-email-submitted-*.png`

---

### Bug 3: Phone Number Validation - All Zeros
**Severity:** Medium  
**Status:** CONFIRMED

**Description:**  
The phone number field accepts `0000000000` (all zeros) as a valid phone number. This should be rejected as it's not a valid phone number format.

**Steps to Reproduce:**
1. Navigate to test-qa.capslock.global
2. Complete form steps 1-4 (zipcode, checkbox, property type, name/email)
3. Enter phone number: `0000000000`
4. Submit the form

**Expected Result:**  
Form should reject the phone number and show validation error.

**Actual Result:**  
Form accepts the phone number and redirects to thank you page.

**Screenshots:**  
- `screenshots/bug3-phone-all-zeros-*.png`
- `screenshots/bug3-phone-all-zeros-submitted-*.png`

---

### Bug 4: Phone Number Input - First Digit Stripped
**Severity:** High  
**Status:** CONFIRMED

**Description:**  
When entering a phone number that starts with `1`, the first digit is automatically stripped. For example, entering `1234567890` results in `234567890` being stored. This prevents users from entering valid phone numbers starting with 1.

**Steps to Reproduce:**
1. Navigate to test-qa.capslock.global
2. Complete form steps 1-4
3. Enter phone number: `1234567890`
4. Check the actual value in the input field

**Expected Result:**  
Phone number should be stored as `1234567890`.

**Actual Result:**  
Phone number is stored as `234567890` (first digit removed).

**Screenshots:**  
- `screenshots/bug4-phone-starts-with-1-*.png`
- `screenshots/bug4-phone-value-check-*.png`

---

### Bug 5: Security - Thank You Page Direct Access
**Severity:** High  
**Status:** CONFIRMED

**Description:**  
The thank you page is accessible directly via URL (`https://test-qa.capslock.global/thankyou`) without completing the form submission. This is a security issue as users can bypass the registration process.

**Steps to Reproduce:**
1. Open browser
2. Navigate directly to: `https://test-qa.capslock.global/thankyou`
3. Observe the page

**Expected Result:**  
User should be redirected to the form or shown an error message.

**Actual Result:**  
Thank you page is displayed without requiring form submission.

**Screenshots:**  
- `screenshots/bug5-direct-thankyou-url-*.png`

**Security Impact:**  
- Users can bypass form validation
- Data integrity issues
- Potential for abuse

---

### Bug 6: Zipcode Validation - All Zeros
**Severity:** Medium  
**Status:** CONFIRMED

**Description:**  
The zipcode field accepts `00000` (all zeros) as a valid zipcode. This should be rejected as it's not a valid zipcode format. Zipcodes cannot be all zeros.

**Steps to Reproduce:**
1. Navigate to test-qa.capslock.global
2. Enter zipcode: `00000` (all zeros)
3. Click "Next" or "Continue"

**Expected Result:**  
Form should reject the zipcode and show validation error.

**Actual Result:**  
Form accepts the zipcode and allows progression to the next step.

**Screenshots:**  
- `screenshots/bug6-zipcode-all-zeros-*.png`
- `screenshots/bug6-zipcode-all-zeros-submitted-*.png`

---

### ~~Special ZIP Codes (11111, 12345) - Service Area Redirect~~ (NOT A BUG)
**Status:** CLOSED - Expected Behavior

**Description:**  
ZIP codes `11111` and `12345` correctly redirect to a service area message page. This is expected behavior, not a bug.

**Expected Behavior:**
1. When ZIP codes `11111` or `12345` are entered, the system correctly shows: "Sorry, unfortunately we don't yet install in your area"
2. The page includes an email input field for users to provide their email
3. After entering a valid email, users should see a thank you message

**Test Coverage:**
- ✅ Verifies service area message appears for zipcodes 11111 and 12345
- ✅ Validates email field on service area screen
- ✅ Verifies invalid email is rejected
- ✅ Verifies valid email shows thank you message

---

## Test Results Summary

**Total Tests:** 11  
**Passed:** 2  
**Failed (Bug Documentation):** 9

### Passed Tests
1. ✅ Should validate that all fields are required
2. ✅ Full Flow: Complete form validation with positive and negative cases

### Bug Documentation Tests
All bug tests are designed to document bugs rather than fail. They pass and log bug status:
- Bug 1: Email validation (test@test)
- Bug 2: Duplicate email registration
- Bug 3: Phone number with all zeros
- Bug 4: Phone number starting with 1
- Bug 5: Thank you page direct access
- Bug 6: Zipcode with all zeros (00000)

---

## Recommendations

### Priority 1 (High Severity)
1. **Bug 2 (Duplicate Email):** Implement unique email validation at the database/API level
2. **Bug 5 (Security):** Add server-side validation to prevent direct access to thank you page

### Priority 2 (Medium Severity)
3. **Bug 1 (Email Format):** Enhance email validation regex to require proper domain format
4. **Bug 3 (Phone All Zeros):** Add validation to reject phone numbers with all zeros
5. **Bug 4 (Phone First Digit):** Fix phone input formatting to preserve first digit when it's 1
6. **Bug 6 (Zipcode All Zeros):** Add validation to reject zipcodes with all zeros (00000)

---

## Test Environment

- **Browser:** Chromium (Playwright)
- **Test Framework:** Playwright + TypeScript
- **Test Execution:** Automated
- **Screenshots:** Available in `screenshots/` directory
- **Videos:** Available in `test-results/` directory

---

## Notes

- All bugs have been verified through automated testing
- Screenshots and videos are captured for each bug
- Tests are designed to document bugs rather than fail, allowing continuous monitoring
- Bug status is logged in test output for tracking fixes

---

**Report Generated:** January 2025  
**Test Suite Version:** 1.0.0

