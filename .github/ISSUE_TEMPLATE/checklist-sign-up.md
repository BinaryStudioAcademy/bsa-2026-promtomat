---
name: "Sign Up Checklist"
about: "QA checklist covering functional, validation, API, security, accessibility, and UI test scenarios for Sign Up"
title: "[QA CHECKLIST] Sign Up"
labels: qa-checklist, auth
---

Priority convention:

- **Bold = High priority**
- Regular = Medium priority
- _Italic = Low priority_

# Sign Up Test Suite

## General Form Behavior

- [ ] **Verify successful account creation with valid registration data**
- [ ] Verify the Sign Up form contains Nickname, Email, Password, and Submit controls
- [ ] **Verify validation errors are displayed under the corresponding fields**
- [ ] **Verify the form is not submitted when any required field is invalid**
- [ ] **Verify repeated submission is prevented while the Sign Up request is processing**
- [ ] **Verify only one account is created when the Submit action is triggered multiple times quickly**
- [ ] Verify the Submit button is re-enabled and the loading state is cleared after a failed Sign Up request
- [ ] Verify the user can retry registration after correcting validation errors
- [ ] Verify entered valid values remain intact after a server-side registration error where applicable

## Email Field

### Required Validation

- [ ] **Verify an empty Email field is rejected on form submission. Error: `Email is required`**
- [ ] _Verify a value containing only spaces is treated as empty after trimming and `Email is required` is displayed on blur_
- [ ] **Verify a value containing only spaces is treated as empty after trimming and `Email is required` is displayed on submission**
- [ ] **Verify the Sign Up form is not submitted when Email is empty**
- [ ] Verify the user can successfully resubmit the form after correcting the Email error

### Format Validation

- [ ] **Verify a valid standard Email is accepted**
  - `user@example.com`
- [ ] **Verify an Email without `@` is rejected**
- [ ] Verify an Email without a local part is rejected
  - `@example.com`
- [ ] Verify an Email without a domain is rejected
  - `user@`
- [ ] Verify an Email containing spaces inside the address is rejected
- [ ] **Verify `Email is invalid` is displayed for an invalid Email format**
- [ ] Verify multiple `@` characters are rejected
- [ ] _Verify an invalid domain structure is rejected according to the shared Email schema_
  - user@.com
  - user@example.
  - user@-example.com
  - user@example..com
- [ ] _Verify potentially malicious input is safely handled and rejected according to Email format validation without executing._
  - `<script>`
  - SQL-like strings
  - ...

### Length Validation

- [ ] **Verify a valid Email with exactly 254 characters is accepted**
- [ ] **Verify an Email with a valid format but 255 characters is rejected with `Email must be at most 254 characters`**
- [ ] Verify trimming occurs before the 254-character length validation
- [ ] Verify an Email exceeding 254 characters before trimming but containing exactly 254 characters after trimming is accepted

### Trimming & Normalization

- [ ] Verify leading spaces are trimmed
- [ ] Verify trailing spaces are trimmed
- [ ] Verify both leading and trailing spaces are trimmed
- [ ] **Verify an otherwise valid Email surrounded by spaces is accepted after trimming**
- [ ] **Verify spaces inside the Email address are not removed and the resulting invalid Email is rejected**
- [ ] **Verify mixed-case Email is normalized correctly**
  - `User@Mail.COM` -> `user@mail.com`
- [ ] Verify an Email entered with uppercase letters and surrounding spaces is stored and returned in normalized form
  - `   User@Mail.COM  ` -> `user@mail.com`

### Uniqueness

- [ ] **Verify an unused Email can be registered**
- [ ] **Verify the account is not created when the Email already exists**
- [ ] **Verify duplicate Email produces the expected server error**
- [ ] **Verify uniqueness is checked using the normalized Email value**
  - Existing `user@mail.com` vs entered `User@Mail.COM`
- [ ] **Verify duplicate registration does not create a second database row**
- [ ] Verify other entered form values remain available after a duplicate Email error

## Password Field

### Required Validation

- [ ] _Verify an empty Password field is rejected on blur after the field has been interacted with. Error: `Password is required`_
- [ ] **Verify an empty Password field is rejected on form submission. Error: `Password is required`**
- [ ] **Verify the Sign Up form is not submitted when Password is empty**
- [ ] Verify the user can successfully resubmit the form after correcting the Password error

### Length Validation

- [ ] **Verify a Password with exactly 4 characters is accepted**
- [ ] **Verify a Password with 3 characters is rejected with `Password must be at least 4 characters`**
- [ ] **Verify a Password with exactly 64 characters is accepted**
- [ ] **Verify a Password with 65 characters is rejected with `Password must be at most 64 characters`**

### Whitespace Validation

- [ ] **Verify a Password starting with one/multiple spaces is rejected with `Password must not start or end with a space`**
- [ ] **Verify a Password ending with one/multiple spaces is rejected with `Password must not start or end with a space`**
- [ ] Verify tabs/newlines or other whitespace characters at the beginning/end are rejected
- [ ] **Verify internal whitespace does not trigger the leading/trailing whitespace error**
- [ ] **Verify a value containing only spaces is rejected**

### Allowed Characters & Security

- [ ] **Verify a Password containing a combination of letters, digits, internal spaces, and special characters is accepted**
- [ ] Verify special characters are accepted
- [ ] _Verify `<`, `>`, `'`, `"`, and similar characters are treated as literal Password characters_
- [ ] _Verify SQL-like strings are treated as literal Password characters_
- [ ] _Verify script-like strings are treated as literal Password characters without execution_
- [ ] **Verify the Password is masked while entered**
- [ ] **Verify Password is not included in validation or server error messages**

## Nickname Field

### Required Validation

- [ ] _Verify an empty Nickname field is rejected on blur after the field has been interacted with. Error: `Nickname is required`_
- [ ] **Verify an empty Nickname field is rejected on form submission. Error: `Nickname is required`**
- [ ] **Verify the Sign Up form is not submitted when Nickname is empty**
- [ ] **Verify a whitespace-only Nickname is rejected**
- [ ] Verify the user can successfully resubmit the form after correcting the Nickname error

### Length Validation

- [ ] **Verify a Nickname with exactly 3 characters is accepted**
- [ ] **Verify a Nickname with 2 characters is rejected with `Nickname must be at least 3 characters`**
- [ ] **Verify a Nickname with exactly 25 characters is accepted**
- [ ] **Verify a Nickname with 26 characters is rejected with `Nickname must not exceed 25 characters`**

### Allowed Characters

- [ ] **Verify a Nickname containing a valid combination of Latin letters, numbers, and underscores is accepted**
- [ ] **Verify a Nickname containing spaces is rejected with `Nickname can contain only latin letters, numbers, and underscores`**
- [ ] **Verify a Nickname containing special characters other than `_` is rejected with the expected validation error**
- [ ] Verify Cyrillic characters are rejected
- [ ] Verify emoji are rejected
- [ ] _Verify potentially malicious input is safely handled and rejected without execution_
  - `<script>`
  - SQL-like strings

### Uniqueness

- [ ] **Verify a Nickname not used by another account is accepted**
- [ ] **Verify a Nickname already used by another account is rejected with `This nickname is already taken`**
- [ ] **Verify the account is not created when the Nickname is already taken**
- [ ] **Verify Nickname uniqueness comparison is case-sensitive**
- [ ] Verify `testuser` can be registered when `TestUser` already exists
- [ ] Verify exact `TestUser` is rejected when `TestUser` already exists
- [ ] **Verify failed duplicate Nickname registration does not create a partial account**

## Account Creation & API Response

- [ ] **Verify valid Nickname, Email, and Password create exactly one account**
- [ ] **Verify `POST /auth/sign-up` returns `201 Created`**
- [ ] **Verify the response contains public User data**
- [ ] **Verify the returned User corresponds to the created account**
- [ ] **Verify the returned Nickname matches the registered Nickname**
- [ ] Verify the returned Email matches the normalized registered Email where Email is included in the public User DTO
- [ ] **Verify the user is authenticated immediately after successful registration**
- [ ] **Verify no additional Sign In request is required**
- [ ] **Verify the user is redirected away from `/sign-up` after successful registration**

## Password Storage & Sensitive Data (+ API)

- [ ] Verify the plain Password is not included in the Sign Up response
- [ ] Verify Password hash is not included in the Sign Up response
- [ ] Verify Password salt is not included in the Sign Up response
- [ ] Verify the plain Password is not stored in the database
- [ ] Verify Password is stored as a non-reversible hash
- [ ] Verify a unique Password salt is stored for the created account
- [ ] Verify two accounts registered with the same Password have different salts
- [ ] Verify two accounts registered with the same Password have different stored hashes
- [ ] Verify the plain Password does not appear in application logs

## JWT

### Issuance & Storage

- [ ] **Verify JWT is returned after successful Sign Up**
- [ ] **Verify no JWT is returned after failed Sign Up**
- [ ] **Verify the JWT received after successful Sign Up is stored on the client**
- [ ] Verify failed registration does not unexpectedly overwrite an existing authentication token
- [ ] **Verify the stored JWT is used for subsequent authenticated requests**

### Structure & Payload

- [ ] Verify JWT consists of three non-empty Base64URL-formatted sections separated by two dots
- [ ] Verify JWT Header can be decoded
- [ ] Verify JWT Payload can be decoded
- [ ] Verify the token contains a non-empty signature
- [ ] **Verify JWT Payload contains the expected `userId`**
- [ ] Verify JWT Payload contains `iat`
- [ ] **Verify JWT Payload contains `exp`**
- [ ] Verify `exp` is later than `iat`
- [ ] **Verify JWT does not contain Password**
- [ ] **Verify JWT does not contain Password hash or salt**
- [ ] **Verify JWT does not contain unnecessary sensitive User information**

### Valid Token

- [ ] **Verify the JWT returned by Sign Up is accepted by a protected endpoint**
- [ ] **Verify the token is accepted before expiration**
- [ ] **Verify the token resolves to the newly registered User**
- [ ] **Verify `/auth/authenticated-user` returns the correct User when called with the Sign Up token**

### Invalid, Expired Token

- [ ] **Verify missing JWT is rejected with `401 Unauthorized`**
- [ ] **Verify an empty Bearer token is rejected with `401 Unauthorized`**
- [ ] **Verify malformed JWT is rejected with `401 Unauthorized`**
- [ ] Verify arbitrary text used as JWT is rejected with `401 Unauthorized`
- [ ] **Verify expired JWT is rejected with `401 Unauthorized`**
- [ ] **Verify JWT with a tampered Payload is rejected with `401 Unauthorized`**
- [ ] **Verify JWT with a tampered Signature is rejected with `401 Unauthorized`**
- [ ] Verify JWT signed with another secret is rejected with `401 Unauthorized`
- [ ] **Verify a token belonging to a nonexistent/deleted User is rejected with `401 Unauthorized`**
- [ ] **Verify invalid JWT does not result in an unhandled `500` error**

## Authentication State After Sign Up

- [ ] Verify authenticated User data is placed into application state after successful registration
- [ ] Verify JWT is persisted using the expected client storage mechanism
- [ ] Verify the newly registered User is considered authenticated immediately
- [ ] Verify authentication state survives a full page reload
- [ ] Verify the stored JWT is validated through /auth/authenticated-user after reload
- [ ] Verify the restored User matches the newly registered User
- [ ] Verify the application does not rely solely on locally cached User information during session restoration
- [ ] Verify a newly registered authenticated User cannot return to /sign-up

## API Validation & Error Handling

- [ ] **Verify a valid Sign Up request returns `201`**
- [ ] **Verify invalid Email returns `422` with field-level validation details**
- [ ] **Verify invalid Password returns `422` with field-level validation details**
- [ ] **Verify invalid Nickname returns the expected field-level validation response**
- [ ] **Verify multiple invalid fields return validation details for all applicable fields**
- [ ] **Verify duplicate Email returns a meaningful `4xx` error instead of `500`**
- [ ] **Verify duplicate Nickname returns a meaningful `4xx` error instead of `500`**
- [ ] **Verify failed registration does not create a partial User record**
- [ ] Verify unexpected backend errors are handled without exposing stack traces
- [ ] **Verify frontend and backend enforce the same validation rules**
- [ ] Verify request and response structures match the shared Sign Up contract

## Accessibility

- [ ] **Verify Enter submits a valid Sign Up form**
- [ ] Verify keyboard Tab navigation reaches all fields and Submit
- [ ] Verify keyboard focus order is logical
- [ ] _Verify Nickname label is associated with the Nickname input_
- [ ] _Verify Email label is associated with the Email input_
- [ ] _Verify Password label is associated with the Password input_
- [ ] _Verify validation errors are associated with their corresponding fields_
- [ ] _Verify visible focus indication is consistent across interactive controls_
- [ ] _Verify loading/disabled Submit state remains understandable to keyboard users_

## Figma / Design Conformity

- [ ] **Verify all required Sign Up fields and controls from the approved Figma design are present**
- [ ] Verify labels and placeholders match the approved design
- [ ] _Verify component dimensions and proportions are consistent with Figma_
- [ ] _Verify spacing, padding, and alignment are consistent with Figma_
- [ ] **Verify typography is consistent with the design system**
- [ ] Verify colors, borders, border radius, and other styling match the approved design
- [ ] Verify validation/error states match Figma
- [ ] Verify loading/disabled state matches Figma
- [ ] Verify layout remains correct when validation messages are displayed
- [ ] Verify maximum-length valid values do not break the layout
- [ ] _Verify minor visual details and pixel-level differences against Figma._
