# Bug Report Summary

**Website:** test-qa.capslock.global  
**Testing Date:** January 2025  
**Testing Framework:** Playwright + TypeScript  
**Test Suite:** Automated Form Validation Tests

---

## Executive Summary

This report documents **6 confirmed bugs** found during automated testing of the form validation system. All bugs have been verified through automated test execution and are reproducible.

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

### Bug 6: ZIP Code Validation - Special Codes Skip Steps
**Severity:** High  
**Status:** CONFIRMED

**Description:**  
Certain ZIP codes (`11111` and `12345`) allow users to skip mandatory registration steps (steps 2 and 3). This bypasses important data collection steps.

**Steps to Reproduce:**

**For ZIP code 11111:**
1. Navigate to test-qa.capslock.global
2. Enter ZIP code: `11111`
3. Click Next
4. Observe if steps 2 and 3 are skipped

**For ZIP code 12345:**
1. Navigate to test-qa.capslock.global
2. Enter ZIP code: `12345`
3. Click Next
4. Observe if steps 2 and 3 are skipped

**Expected Result:**  
All users should complete all mandatory steps regardless of ZIP code.

**Actual Result:**  
ZIP codes `11111` and `12345` skip steps 2 and 3, allowing direct progression to later steps or thank you page.

**Screenshots:**  
- `screenshots/bug6-zipcode-11111-*.png`
- `screenshots/bug6-after-zipcode-11111-next-*.png`
- `screenshots/bug6-zipcode-12345-*.png`
- `screenshots/bug6-after-zipcode-12345-next-*.png`

**Impact:**  
- Incomplete data collection
- Inconsistent user experience
- Potential data quality issues

---

## Test Results Summary

**Total Tests:** 10  
**Passed:** 2  
**Failed (Bug Documentation):** 8

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
- Bug 6: Special ZIP codes skip steps

---

## Recommendations

### Priority 1 (High Severity)
1. **Bug 2 (Duplicate Email):** Implement unique email validation at the database/API level
2. **Bug 5 (Security):** Add server-side validation to prevent direct access to thank you page
3. **Bug 6 (ZIP Code Skip):** Ensure all ZIP codes follow the same validation flow

### Priority 2 (Medium Severity)
4. **Bug 1 (Email Format):** Enhance email validation regex to require proper domain format
5. **Bug 3 (Phone All Zeros):** Add validation to reject phone numbers with all zeros
6. **Bug 4 (Phone First Digit):** Fix phone input formatting to preserve first digit when it's 1

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

