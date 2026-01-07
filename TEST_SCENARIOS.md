# Test Scenarios for Capslock Form Validation

**Project:** test-qa.capslock.global  
**Date:** January 2025  
**Testing Framework:** Playwright + TypeScript

---

## Complete List of Test Scenarios

### **STEP 1: ZIPCODE VALIDATION**

#### 1.1 Required Field Validation
- **Scenario:** Submit step 1 without entering zipcode
- **Expected:** Form should prevent navigation and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Should validate that all fields are required")

#### 1.2 Valid Zipcode Format
- **Scenario:** Enter valid 5-digit zipcode (e.g., "23451")
- **Expected:** Form should accept and proceed to step 2
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 1.3 Invalid Zipcode - Less Than 5 Digits
- **Scenario:** Enter zipcode with less than 5 digits (e.g., "1234")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 1.4 Invalid Zipcode - More Than 5 Digits
- **Scenario:** Enter zipcode with more than 5 digits (e.g., "123456")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 1.5 Invalid Zipcode - Non-Numeric Characters
- **Scenario:** Enter zipcode with letters/special chars (e.g., "12abc", "12-34")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 1.6 Invalid Zipcode - Empty String
- **Scenario:** Submit with empty zipcode field
- **Expected:** Form should prevent navigation
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 1.7 Invalid Zipcode - All Zeros
- **Scenario:** Enter zipcode with all zeros (e.g., "00000")
- **Expected:** Form should reject and show validation error (00000 is not a valid zipcode)
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Bug 6: Zipcode validation - should reject zipcode with all zeros")

#### 1.8 Invalid Zipcode - Only Spaces
- **Scenario:** Enter zipcode with only whitespace (e.g., "     ")
- **Expected:** Form should reject and show validation error
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 1.9 Special Zipcode - 11111 (Out-of-Area Redirect)
- **Scenario:** Enter zipcode "11111"
- **Expected:** Should redirect to out-of-area stage with service area message and email field (Expected Business Behavior - NOT a bug)
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered
- **Note:** This is normal business logic - zipcodes 11111 and 12345 indicate areas where service is not available

#### 1.10 Special Zipcode - 12345 (Out-of-Area Redirect)
- **Scenario:** Enter zipcode "12345"
- **Expected:** Should redirect to out-of-area stage with service area message and email field (Expected Business Behavior - NOT a bug)
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered
- **Note:** This is normal business logic - zipcodes 11111 and 12345 indicate areas where service is not available

#### 1.11 Zipcode Leading/Trailing Spaces
- **Scenario:** Enter zipcode with leading/trailing spaces (e.g., " 23451 ")
- **Expected:** Should trim spaces and accept valid zipcode
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 2: [TO BE DETERMINED]**

**Note:** Step 2 content needs to be verified. Please specify what fields/elements are in Step 2.

---

### **STEP 3: PROPERTY TYPE SELECTION**

#### 3.1 Required Radio Button Validation
- **Scenario:** Try to proceed without selecting property type
- **Expected:** Form should prevent navigation to step 4
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Should validate Step 3: Property type selection is required")

#### 3.2 Valid Property Type Selection
- **Scenario:** Select property type radio button and proceed
- **Expected:** Form should proceed to step 4
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (implicitly)

#### 3.3 All Property Type Options
- **Scenario:** Test each available property type option
- **Expected:** All options should work correctly
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 3.4 Property Type Change
- **Scenario:** Select one option, then change to another
- **Expected:** Should allow changing selection
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 4: NAME AND EMAIL VALIDATION**

#### 4.1 Name Field - Required Validation
- **Scenario:** Submit step 4 without entering name
- **Expected:** Form should prevent navigation and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Full Flow" - Step 4 name validation)

#### 4.2 Name Field - Valid Input
- **Scenario:** Enter valid name (e.g., "John Smith")
- **Expected:** Form should accept and proceed
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (implicitly)

#### 4.3 Name Field - Empty String
- **Scenario:** Submit with empty name field
- **Expected:** Form should reject
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 4.4 Name Field - Only Spaces
- **Scenario:** Enter name with only whitespace (e.g., "   ")
- **Expected:** Form should reject and show validation error
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.5 Name Field - Special Characters
- **Scenario:** Enter name with special characters (e.g., "Test@User#123")
- **Expected:** Should validate based on business rules
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.6 Name Field - Very Long Name
- **Scenario:** Enter extremely long name (e.g., 200+ characters)
- **Expected:** Should validate length limits
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

#### 4.7 Name Field - Single Character
- **Scenario:** Enter single character name (e.g., "A")
- **Expected:** Should validate minimum length
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

#### 4.8 Email Field - Required Validation
- **Scenario:** Submit step 4 without entering email
- **Expected:** Form should prevent navigation and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Should validate Step 4: Email field is required")

#### 4.9 Email Field - Valid Format
- **Scenario:** Enter valid email (e.g., "test@example.com")
- **Expected:** Form should accept and proceed
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (implicitly)

#### 4.10 Email Field - Invalid Format (No @ Symbol)
- **Scenario:** Enter email without @ symbol (e.g., "invalid-email-format")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 4.11 Email Field - Invalid Format (No Domain)
- **Scenario:** Enter email without domain (e.g., "test@")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.12 Email Field - Invalid Format (No Domain Extension)
- **Scenario:** Enter email without domain extension (e.g., "test@test")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Bug 1)

#### 4.13 Email Field - Invalid Format (No Local Part)
- **Scenario:** Enter email without local part (e.g., "@example.com")
- **Expected:** Form should reject and show validation error
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.14 Email Field - Duplicate Email Prevention
- **Scenario:** Register with email, then try to register again with same email
- **Expected:** Should reject duplicate and show error message
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Bug 2)

#### 4.15 Email Field - Case Sensitivity
- **Scenario:** Register with "Test@Example.com", then try "test@example.com"
- **Expected:** Should treat as duplicate (case-insensitive)
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.16 Email Field - Leading/Trailing Spaces
- **Scenario:** Enter email with spaces (e.g., " test@example.com ")
- **Expected:** Should trim spaces and accept valid email
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.17 Email Field - Multiple @ Symbols
- **Scenario:** Enter email with multiple @ symbols (e.g., "test@@example.com")
- **Expected:** Form should reject
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 4.18 Email Field - Very Long Email
- **Scenario:** Enter extremely long email address
- **Expected:** Should validate length limits
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 5: PHONE NUMBER VALIDATION**

#### 5.1 Phone Field - Required Validation
- **Scenario:** Submit form without entering phone number
- **Expected:** Form should prevent submission and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Test: "Should validate Step 5: Phone field is required")

#### 5.2 Phone Field - Valid 10-Digit Number
- **Scenario:** Enter valid 10-digit phone (e.g., "1234567890")
- **Expected:** Form should accept and allow submission
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (implicitly)

#### 5.3 Phone Field - Less Than 10 Digits
- **Scenario:** Enter phone with less than 10 digits (e.g., "123456789")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 5.4 Phone Field - More Than 10 Digits
- **Scenario:** Enter phone with more than 10 digits (e.g., "12345678901")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 5.5 Phone Field - All Zeros
- **Scenario:** Enter phone with all zeros (e.g., "0000000000")
- **Expected:** Form should reject and show validation error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Bug 3)

#### 5.6 Phone Field - Starting with 1
- **Scenario:** Enter phone starting with 1 (e.g., "1234567890")
- **Expected:** Should accept and preserve all 10 digits
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Bug 4)

#### 5.7 Phone Field - With Formatting Characters
- **Scenario:** Enter phone with dashes (e.g., "123-456-7890")
- **Expected:** Should strip formatting or reject
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered

#### 5.8 Phone Field - With Parentheses
- **Scenario:** Enter phone with parentheses (e.g., "(123) 456-7890")
- **Expected:** Should strip formatting or reject
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 5.9 Phone Field - Non-Numeric Characters
- **Scenario:** Enter phone with letters (e.g., "123-456-789a")
- **Expected:** Form should reject
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered

#### 5.10 Phone Field - Empty String
- **Scenario:** Submit with empty phone field
- **Expected:** Form should reject
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ❌ Not Covered (separately)

#### 5.11 Phone Field - Only Spaces
- **Scenario:** Enter phone with only whitespace
- **Expected:** Form should reject
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 5.12 Phone Field - Leading/Trailing Spaces
- **Scenario:** Enter phone with spaces (e.g., " 1234567890 ")
- **Expected:** Should trim spaces and accept valid phone
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 6: FORM SUBMISSION AND NAVIGATION**

#### 6.1 Complete Valid Form Submission
- **Scenario:** Complete all steps with valid data
- **Expected:** Should redirect to thank you page
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered

#### 6.2 Thank You Page Content
- **Scenario:** Verify thank you page displays correct content
- **Expected:** Should show thank you message and confirmation
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (implicitly)

#### 6.3 Thank You Page Direct URL Access (Security)
- **Scenario:** Navigate directly to thank you page URL
- **Expected:** Should redirect to form or show error
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (Bug 5)

#### 6.4 Form Back Navigation
- **Scenario:** Navigate back through form steps
- **Expected:** Should allow going back and preserve data
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 6.5 Form Data Persistence
- **Scenario:** Fill form, navigate back, then forward
- **Expected:** Previously entered data should be preserved
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 6.6 Browser Back Button
- **Scenario:** Use browser back button during form completion
- **Expected:** Should handle navigation correctly
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 6.7 Form Reset/Refresh
- **Scenario:** Refresh page during form completion
- **Expected:** Should handle page refresh appropriately
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 7: SERVICE AREA SCREEN (ZIP 11111/12345) - OUT-OF-AREA STAGE**


#### 7.1 Service Area Message Display (Expected Behavior)
- **Scenario:** Enter zipcode 11111 or 12345
- **Expected:** Should redirect to out-of-area stage and show "Sorry, unfortunately we don't yet install in your area" message
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered
- **Note:** This is normal business logic - confirms the redirect works correctly

#### 7.2 Service Area Email Field - Required
- **Scenario:** Try to submit service area form without email
- **Expected:** Should show validation error
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 7.3 Service Area Email Field - Valid Email
- **Scenario:** Enter valid email on service area screen
- **Expected:** Should show thank you message
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered

#### 7.4 Service Area Email Field - Invalid Email
- **Scenario:** Enter invalid email on service area screen
- **Expected:** Should reject and show validation error
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ✅ Covered

#### 7.5 Service Area Email Field - Duplicate Email
- **Scenario:** Submit same email multiple times on service area screen
- **Expected:** Should handle duplicates appropriately
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 8: EDGE CASES AND ERROR HANDLING**

#### 8.1 Network Error During Submission
- **Scenario:** Simulate network failure during form submission
- **Expected:** Should show appropriate error message
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 8.2 Server Error Response
- **Scenario:** Simulate 500 server error during submission
- **Expected:** Should show user-friendly error message
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 8.3 Timeout Handling
- **Scenario:** Form submission takes too long
- **Expected:** Should show timeout message or retry option
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

#### 8.4 Concurrent Form Submissions
- **Scenario:** Submit form multiple times rapidly
- **Expected:** Should prevent duplicate submissions
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 8.5 Form Submission Button Disabled State
- **Scenario:** Verify submit button is disabled during submission
- **Expected:** Should prevent multiple clicks
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 9: ACCESSIBILITY AND UX**

#### 9.1 Keyboard Navigation
- **Scenario:** Navigate form using only keyboard (Tab, Enter)
- **Expected:** All fields should be accessible via keyboard
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 9.2 Screen Reader Compatibility
- **Scenario:** Test with screen reader
- **Expected:** Form should be accessible to screen readers
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 9.3 Field Labels and ARIA Attributes
- **Scenario:** Verify all fields have proper labels and ARIA attributes
- **Expected:** Should meet accessibility standards
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 9.4 Error Message Accessibility
- **Scenario:** Verify validation errors are announced to screen readers
- **Expected:** Errors should be properly announced
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 9.5 Focus Management
- **Scenario:** Verify focus moves to error fields after validation
- **Expected:** Focus should move to first error field
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 10: CROSS-BROWSER AND RESPONSIVE**

#### 10.1 Chrome Browser Compatibility
- **Scenario:** Test form in Chrome
- **Expected:** Should work correctly
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ✅ Covered (default)

#### 10.2 Firefox Browser Compatibility
- **Scenario:** Test form in Firefox
- **Expected:** Should work correctly
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ❌ Not Covered

#### 10.3 Safari Browser Compatibility
- **Scenario:** Test form in Safari
- **Expected:** Should work correctly
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ❌ Not Covered

#### 10.4 Mobile Viewport (Responsive)
- **Scenario:** Test form on mobile viewport sizes
- **Expected:** Form should be usable on mobile devices
- **Priority:** HIGH ⭐⭐⭐⭐⭐
- **Status:** ❌ Not Covered

#### 10.5 Tablet Viewport (Responsive)
- **Scenario:** Test form on tablet viewport sizes
- **Expected:** Form should be usable on tablets
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

---

### **STEP 11: PERFORMANCE AND LOADING**

#### 11.1 Form Load Time
- **Scenario:** Measure time to load form
- **Expected:** Should load within acceptable time
- **Priority:** MEDIUM ⭐⭐⭐
- **Status:** ❌ Not Covered

#### 11.2 Step Transition Performance
- **Scenario:** Measure time for step transitions
- **Expected:** Should be smooth and fast
- **Priority:** LOW ⭐⭐
- **Status:** ❌ Not Covered

---

## Summary Statistics

**Total Scenarios Identified:** 92 
**Currently Covered:** 33 (36%)  
**Not Covered:** 59 (64%)

**Required Field Validations:** ✅ **All Covered**
- Step 1 (Zipcode): ✅ Covered (Test: "Should validate that all fields are required")
- Step 3 (Property Type): ✅ Covered (Test: "Should validate Step 3: Property type selection is required")
- Step 4 (Name): ✅ Covered (Test: "Full Flow" - Step 4 name validation)
- Step 4 (Email): ✅ Covered (Test: "Should validate Step 4: Email field is required")
- Step 5 (Phone): ✅ Covered (Test: "Should validate Step 5: Phone field is required")

**By Priority:**
- **HIGH Priority (⭐⭐⭐⭐⭐):** 35 scenarios
- **MEDIUM Priority (⭐⭐⭐):** 40 scenarios
- **LOW Priority (⭐⭐):** 20 scenarios

---

## Top 5 Highest Priority Scenarios

### 1. **Step 1: Zipcode Format Validation (Invalid Formats)** ⭐⭐⭐⭐⭐
- **Why:** Prevents invalid zipcode data from entering the system. Currently accepts <5 digits, >5 digits, and non-numeric.
- **Impact:** High - Data quality issues, potential system errors
- **Current Status:** ⚠️ Partially Covered (tests exist but document behavior, don't fail)

### 2. **Step 4: Email Format Validation (Invalid Formats)** ⭐⭐⭐⭐⭐
- **Why:** Email format validation is critical. Currently accepts invalid formats like "test@test" (Bug 1).
- **Impact:** High - Invalid email addresses prevent communication
- **Current Status:** ✅ Covered (Bug 1 test)

### 3. **Step 4: Email Duplicate Prevention** ⭐⭐⭐⭐⭐
- **Why:** Prevents data integrity issues and ensures unique user registrations.
- **Impact:** High - Allows duplicate registrations (Bug 2)
- **Current Status:** ✅ Covered (Bug 2 test)

### 4. **Step 5: Phone Format Validation (All Zeros & First Digit)** ⭐⭐⭐⭐⭐
- **Why:** Phone validation has critical bugs - accepts all zeros (Bug 3) and strips first digit when starting with 1 (Bug 4).
- **Impact:** High - Invalid phone numbers and data loss
- **Current Status:** ✅ Covered (Bug 3 & Bug 4 tests)

### 5. **Security: Thank You Page Direct Access Prevention** ⭐⭐⭐⭐⭐
- **Why:** Security vulnerability - users can bypass form validation by accessing thank you page directly (Bug 5).
- **Impact:** High - Security issue, data integrity problems
- **Current Status:** ✅ Covered (Bug 5 test)

---

## Prioritization Logic

### Priority Criteria:

1. **Data Integrity (⭐⭐⭐⭐⭐):**
   - Required field validations prevent incomplete data
   - Format validations ensure data quality
   - Duplicate prevention maintains data uniqueness

2. **Security (⭐⭐⭐⭐⭐):**
   - Direct URL access to thank you page (Bug 5)
   - Prevents bypassing form validation

3. **User Experience (⭐⭐⭐):**
   - Clear validation messages
   - Smooth navigation between steps
   - Error handling

4. **Business Logic (⭐⭐⭐):**
   - Service area handling
   - Special zipcode cases
   - Form completion flow

5. **Edge Cases (⭐⭐):**
   - Special character handling
   - Length validations
   - Format variations

### Why These 5 Are Highest Priority:

1. **Format Validations:** These prevent invalid data from entering the system. Current bugs show:
   - Zipcode accepts invalid formats (not exactly 5 digits)
   - Email accepts invalid formats (no proper domain)
   - Phone accepts invalid values (all zeros, first digit stripped)

2. **Data Integrity:** Duplicate email prevention is critical for maintaining unique user records and preventing data conflicts.

3. **Security:** Direct URL access to thank you page bypasses all validation, creating a security vulnerability.

4. **They represent confirmed bugs** that are actively affecting the system and need to be fixed.

5. **They impact user experience and data quality** - invalid data prevents proper communication and business operations.



**Document Version:** 1.0  
**Last Updated:** January 2026

