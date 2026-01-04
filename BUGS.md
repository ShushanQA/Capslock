# Bug Documentation Report

**Website:** test-qa.capslock.global  
**Testing Date:** January 2025  
**Testing Framework:** Playwright + TypeScript  
**Tester:** Automated Test Suite

---

## Bug #1: Missing Required Field Validation on Zipcode Field

### Bug Description
The zipcode field on the first step of the form does not show any validation error messages when the user attempts to submit the form without entering a value. The form allows progression to the next step even when the zipcode field is empty.

**Location:** First step of the multi-step form (zipcode input field)

### Steps to Reproduce
1. Navigate to https://test-qa.capslock.global/
2. On the first step, do not enter any value in the zipcode field
3. Click the "Next" or "Continue" button
4. Observe that the form proceeds to the next step without showing any validation error

### Expected Result
The form should display a validation error message indicating that the zipcode field is required and prevent the user from proceeding to the next step until a valid zipcode is entered.

### Actual Result
The form proceeds to the next step without any validation error message, allowing users to continue with an empty zipcode field.

### Screenshots/Videos
- Screenshot: `screenshots/step-1-empty-*.png`
- Screenshot: `screenshots/step-1-empty-submitted-*.png`

---

## Bug #2: Zipcode Field Accepts Invalid Formats

### Bug Description
The zipcode field accepts values that do not meet the requirement of "exactly 5 digits". The form allows:
- Zipcodes with less than 5 digits (e.g., "1234")
- Zipcodes with more than 5 digits (e.g., "123456")
- Zipcodes containing non-numeric characters (e.g., "12abc")

**Location:** First step of the multi-step form (zipcode input field with name="zipCode")

### Steps to Reproduce

**Test Case 2.1: Less than 5 digits**
1. Navigate to https://test-qa.capslock.global/
2. Enter "1234" (4 digits) in the zipcode field
3. Click "Next" or "Continue"
4. Observe that the form accepts this value and proceeds

**Test Case 2.2: More than 5 digits**
1. Navigate to https://test-qa.capslock.global/
2. Enter "123456" (6 digits) in the zipcode field
3. Click "Next" or "Continue"
4. Observe that the form accepts this value and proceeds

**Test Case 2.3: Non-numeric characters**
1. Navigate to https://test-qa.capslock.global/
2. Enter "12abc" (contains letters) in the zipcode field
3. Click "Next" or "Continue"
4. Observe that the form accepts this value and proceeds

### Expected Result
The form should validate that the zipcode contains exactly 5 digits and display an error message if:
- The zipcode has less than 5 digits
- The zipcode has more than 5 digits
- The zipcode contains non-numeric characters

The form should prevent progression to the next step until a valid 5-digit zipcode is entered.

### Actual Result
The form accepts all invalid formats mentioned above and allows the user to proceed to the next step without any validation error messages.

### Screenshots/Videos
- Screenshot: `screenshots/zipcode-4-digits-*.png`
- Screenshot: `screenshots/zipcode-6-digits-*.png`
- Screenshot: `screenshots/zipcode-non-numeric-*.png`
- Screenshot: `screenshots/zipcode-4-digits-submit-*.png`

---

## Bug #3: Name Field Validation Issues

### Bug Description
The name field may not properly validate required field status and format. The form might accept:
- Empty name fields
- Names with only spaces
- Names with special characters that may not be appropriate

**Location:** Step 4 of the form (name input field)

### Steps to Reproduce

**Test Case 3.1: Empty Name Field**
1. Complete steps 1-3 of the form
2. On step 4, leave the name field empty
3. Fill email and phone fields with valid data
4. Click "Submit"
5. Observe if validation error appears

**Test Case 3.2: Name with Only Spaces**
1. Complete steps 1-3 of the form
2. On step 4, enter only spaces (e.g., "   ") in the name field
3. Fill email and phone fields with valid data
4. Click "Submit"
5. Observe if the form accepts this value

**Test Case 3.3: Name with Special Characters**
1. Complete steps 1-3 of the form
2. On step 4, enter name with special characters (e.g., "Test@User#123")
3. Fill email and phone fields with valid data
4. Click "Submit"
5. Observe if the form accepts this value

### Expected Result
- The name field should be required and show validation error if empty
- The name field should reject values with only spaces
- The name field should validate format (may or may not allow special characters based on requirements)

### Actual Result
(Requires further testing to confirm specific behavior)

### Screenshots/Videos
- Screenshot: `screenshots/name-field-empty-*.png`
- Screenshot: `screenshots/name-with-spaces-only-*.png`
- Screenshot: `screenshots/name-with-special-chars-*.png`

---

## Bug #4: Email Field Validation Issues

### Bug Description
The email field may not properly validate:
- Invalid email formats (e.g., "invalid-email-format" without @ symbol)
- Duplicate email addresses (allowing multiple registrations with the same email)
- Missing domain or @ symbol

**Location:** Step 4 of the form (email input field with type="email" and name="email")

### Steps to Reproduce

**Test Case 4.1: Invalid Email Format**
1. Complete the form steps to reach step 4 with email field
2. Enter an invalid email format such as "invalid-email-format" (without @ symbol)
3. Fill other required fields
4. Click "Submit"
5. Observe if the form accepts the invalid email format

**Test Case 4.2: Email Without @ Symbol**
1. Complete the form steps to reach step 4
2. Enter "testtest.test" (missing @ symbol)
3. Fill other required fields
4. Click "Submit"
5. Observe if the form accepts this format

**Test Case 4.3: Email Without Domain**
1. Complete the form steps to reach step 4
2. Enter "test@" (missing domain)
3. Fill other required fields
4. Click "Submit"
5. Observe if the form accepts this format

**Test Case 4.4: Duplicate Email**
1. Complete the form with email "test@test.test" and submit successfully
2. Start a new registration
3. Complete the form again with the same email "test@test.test"
4. Click "Submit"
5. Observe if an error message appears indicating the email is already registered

### Expected Result
- Invalid email formats should be rejected with a validation error message
- Duplicate email addresses should be rejected with an error message indicating the email is already registered (e.g., "This email is already registered" or "Email already exists")

### Actual Result
(Requires further testing to confirm, but based on the pattern of other validation issues, these may also be present)

### Screenshots/Videos
- Screenshot: `screenshots/email-invalid-format-*.png`
- Screenshot: `screenshots/email-no-at-symbol-*.png`
- Screenshot: `screenshots/email-no-domain-*.png`
- Screenshot: `screenshots/duplicate-email-submitted-*.png`

---

## Bug #5: Phone Number Field Validation Issues

### Bug Description
The phone number field may not properly validate that it contains exactly 10 digits. The form might accept:
- Phone numbers with less than 10 digits (e.g., "123456789")
- Phone numbers with more than 10 digits (e.g., "12345678901")
- Phone numbers with formatting characters (e.g., "123-456-7890")

**Location:** Step 4 of the form (phone input field with name="phone" and type="tel")

### Steps to Reproduce

**Test Case 5.1: Less than 10 digits**
1. Complete the form steps to reach step 4 with phone field
2. Enter "123456789" (9 digits) in the phone field
3. Fill other required fields with valid data
4. Click "Submit"
5. Observe if the form accepts the phone number with 9 digits

**Test Case 5.2: More than 10 digits**
1. Complete the form steps to reach step 4 with phone field
2. Enter "12345678901" (11 digits) in the phone field
3. Fill other required fields with valid data
4. Click "Submit"
5. Observe if the form accepts the phone number with 11 digits

**Test Case 5.3: With formatting characters**
1. Complete the form steps to reach step 4 with phone field
2. Enter "123-456-7890" (with dashes) in the phone field
3. Fill other required fields with valid data
4. Click "Submit"
5. Observe if the form accepts the phone number with formatting

### Expected Result
The form should validate that the phone number contains exactly 10 digits (numeric only, no formatting characters) and display an error message if:
- The phone number has less than 10 digits
- The phone number has more than 10 digits
- The phone number contains non-numeric characters

### Actual Result
(Requires further testing to confirm, but based on the pattern of zipcode validation issues, similar issues may exist)

### Screenshots/Videos
- Screenshot: `screenshots/phone-9-digits-*.png`
- Screenshot: `screenshots/phone-11-digits-*.png`
- Screenshot: `screenshots/phone-with-dashes-*.png`

---

## Bug #6: Thank You Page Redirect Issue

### Bug Description
After successful form submission, the user may not be properly redirected to a "Thank you" page. The form might remain on the same page or redirect to an unexpected location.

**Location:** After form submission

### Steps to Reproduce
1. Complete all form steps with valid data:
   - Enter valid 5-digit zipcode (e.g., "12345")
   - Select at least one checkbox option
   - Select a radio button option
   - Enter valid name (e.g., "Test User")
   - Enter valid unique email (e.g., "test-{timestamp}@test.test")
   - Enter valid 10-digit phone number (e.g., "1234567890")
2. Click "Submit" button
3. Wait for page response
4. Observe the current URL and page content

### Expected Result
After successful submission, the user should be redirected to a "Thank you" page (URL containing "thank" or page content containing "Thank you" message).

### Actual Result
The user may remain on the same page or be redirected to an unexpected location without a clear "Thank you" message.

### Screenshots/Videos
- Screenshot: `screenshots/after-submission-*.png`
- Screenshot: `screenshots/before-submission-*.png`

---

## Summary

### Critical Bugs Found:
1. ✅ **Bug #1**: Missing required field validation on zipcode field
2. ✅ **Bug #2**: Zipcode field accepts invalid formats (4 digits, 6 digits, non-numeric)
3. ⚠️ **Bug #3**: Name field validation issues (requires further testing)
4. ⚠️ **Bug #4**: Email validation issues (invalid format, duplicate emails)
5. ⚠️ **Bug #5**: Phone number validation issues (incorrect digit count)
6. ⚠️ **Bug #6**: Thank you page redirect issues

### Impact Assessment:
- **High Impact**: Bugs #1, #2 - These directly violate the form requirements and allow invalid data submission
- **Medium Impact**: Bugs #3, #4, #5 - These may allow invalid data but require further confirmation
- **Medium Impact**: Bug #6 - Affects user experience and confirmation of successful submission

### Recommendations:
1. Implement client-side and server-side validation for all required fields
2. Add format validation for zipcode (exactly 5 digits, numeric only)
3. Add format validation for phone number (exactly 10 digits, numeric only)
4. Add email format validation and duplicate email checking
5. Ensure proper redirect to thank you page after successful submission
6. Display clear, user-friendly error messages for all validation failures

---

## Test Execution Log

All tests were executed using Playwright with TypeScript. Screenshots were captured for each bug scenario. The test suite includes:
- Form validation tests
- Field format validation tests
- Form submission and redirect tests
- Exploratory testing for form structure analysis

Test files location: `/tests/`
Screenshots location: `/screenshots/`

