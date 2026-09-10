---
name: "Sign In Checklist"
about: "QA checklist covering functional, validation, API, security, accessibility, and UI test scenarios for Sign In"
title: "[QA CHECKLIST] Sign In"
labels: qa-checklist, auth
---

# Sign In QA Checklist

- **Bold = High priority**
- Regular = Medium priority
- _Italic = Low priority_

## 1. Authentication Flow

### Authentication Gateway

- [ ] **Verify that Sign In is available as the default/selected authentication state**

### Sign In State & Context Switching

- [ ] **Verify that only Email and Password fields are displayed in Sign In state**
- [ ] Verify that user can switch between Sign In and Sign Up states
- [ ] Verify switching to Sign Up changes the authentication state correctly
- [ ] Verify switching back to Sign In displays only Sign In fields
- [ ] Verify Sign In does not retain irrelevant Sign Up fields or values

### Happy Path

- [ ] **Verify successful Sign In with valid credentials**
  - Valid registered email + valid password -> user is authenticated and redirected to Training Mode Dashboard

### Authentication Failures

- [ ] **Verify non-existing user cannot sign in**
- [ ] **Verify existing user cannot sign in with an incorrect password**

---

## 2. Input Validation

### Required Fields

- [ ] **Verify Email is required when the field is empty**
- [ ] **Verify Password is required when the field is empty**
- [ ] **Verify both Email and Password are required when both fields are empty**

### Email

#### Basic Behavior & Length

- [ ] _Verify the Email field displays the correct placeholder text_
- [ ] Verify minimum email length is 1 character
- [ ] Verify maximum email length is 254 characters
- [ ] Verify email longer than 254 characters is rejected
- [ ] **Verify valid email format is accepted**

#### Email Format Validation

- [ ] **Verify email without @ is rejected**
- [ ] **Verify email without a local part is rejected**
- [ ] **Verify email without a domain is rejected**
- [ ] **Verify invalid email format is rejected**
- [ ] Verify consecutive dots are rejected
- [ ] Verify email cannot start/end with a dot in the local part
- [ ] Verify whitespace inside the email address is rejected
- [ ] Verify an email containing only whitespace is treated as empty
- [ ] Verify Sign In accepts email addresses regardless of letter case
- [ ] Verify allowed characters in the local part
- [ ] Verify invalid characters are rejected
- [ ] Verify leading and trailing whitespace is trimmed before authentication
- [ ] Verify a domain label cannot start or end with a hyphen
- [ ] Verify invalid domain structure is rejected
- [ ] **Verify potentially malicious email input is safely handled**

### Password

#### Basic Behavior & Visibility

- [ ] _Verify the Password field displays the correct placeholder text "Enter your password"_
- [ ] Verify password is masked by default
- [ ] Verify password visibility can be toggled
- [ ] Verify password can be masked again after being revealed

#### Length Validation

- [ ] Verify minimum password length is 4 characters
- [ ] **Verify password shorter than 4 characters is rejected**
- [ ] Verify maximum password length is 64 characters
- [ ] **Verify password longer than 64 characters is rejected**

#### Password Content Rules

- [ ] **Verify Sign In accepts a valid password containing letters, numbers and special characters**
- [ ] **Verify password is case-sensitive**
- [ ] Verify password cannot start with a space
- [ ] Verify password cannot end with a space
- [ ] Verify password cannot contain spaces
- [ ] Verify password containing emoji is rejected
- [ ] Verify password containing dashes is rejected

---

## 3. Keyboard Navigation & Accessibility

### Keyboard Navigation

- [ ] Verify all interactive elements can be accessed using keyboard
- [ ] Verify keyboard focus follows a logical order
- [ ] Verify Sign In button can be activated using Enter
- [ ] Verify Sign In button can be activated using Space
- [ ] Verify Shift + Tab moves focus to the previous interactive element

### Accessibility

- [ ] Verify visible focus indication is present on interactive elements

### Validation Feedback

- [ ] Verify validation errors disappear/update after correcting the input

---

## 4. API Authentication & JWT

### JWT Token Lifecycle

- [ ] **Verify appropriate routing/session tokens are set after successful authentication**
- [ ] **Verify that the JWT received after successful Sign In is stored on the client**
- [ ] **Verify tokens are not set after unsuccessful authentication**
- [ ] Verify the JWT consists of three non-empty Base64URL-encoded sections and can be successfully decoded
- [ ] **Verify the token contains the correct user identifier**
- [ ] **Verify the token contains valid issued-at and expiration claims**

### Protected Endpoint Authorization

- [ ] **Verify valid tokens allow access to protected endpoints**
- [ ] **Verify requests without a JWT are rejected with 401 Unauthorized**
- [ ] **Verify malformed or invalid JWTs are rejected with 401 Unauthorized**
- [ ] **Verify expired JWTs are rejected with 401 Unauthorized**
- [ ] **Verify session/token is invalidated after Sign Out**

### JWT Security

- [ ] **Verify JWT does not contain Password**
- [ ] **Verify JWT does not contain unnecessary sensitive User information**
- [ ] **Verify JWT with a tampered Payload is rejected with 401 Unauthorized**
- [ ] **Verify JWT with a tampered Signature is rejected with 401 Unauthorized**
- [ ] **Verify JWT belonging to a deleted/nonexistent User is rejected with 401 Unauthorized**
- [ ] **Verify an invalid JWT does not result in 500 Internal Server Error**

### API Response

- [ ] **Verify successful Sign In returns 200 OK**

---

## 5. Request Processing & Error Handling

### Request Processing

- [ ] Verify the Sign In button is disabled while the authentication request is processing
- [ ] Verify repeated submission is prevented while the Sign In request is processing
- [ ] Verify pressing Enter multiple times quickly does not trigger duplicate Sign In requests

### Loading State

- [ ] Verify a loading state is displayed while the authentication request is processing
- [ ] Verify the Sign In button returns to its normal state after a failed request

### Authentication Error Recovery

- [ ] **Verify the user can retry Sign In after a failed request**
- [ ] **Verify the form does not remain in a loading state after a server error**
- [ ] Verify entered Email remains after a failed Sign In request
- [ ] Verify Password is handled according to the expected behavior after failed authentication

### Network Errors

- [ ] **Verify a network error is handled gracefully**
- [ ] **Verify the user can retry Sign In after a network failure**

---

## 6. Session & Authentication State

### Session Restoration

- [ ] **Verify authentication state survives a full page reload**
- [ ] **Verify stored JWT is validated through /auth/authenticated-user after reload**

### Authentication State

- [ ] **Verify an authenticated User cannot return to /sign-in**
- [ ] **Verify authentication state is cleared after Sign Out**

---

## 7. Figma / Design Conformity

### Required Structure

- [ ] Verify all required Sign In fields and controls from the approved Figma design are present
- [ ] _Verify Sign In implementation matches the approved Figma design_
- [ ] _Verify the order of Sign In fields and controls matches Figma_
- [ ] _Verify Email label and placeholder match the approved Figma design_
- [ ] _Verify Password label and placeholder match the approved Figma design_
- [ ] _Verify Sign In and Sign Up control labels match Figma_

### Layout & Visual Styling

- [ ] _Verify input dimensions and proportions are consistent with Figma_
- [ ] _Verify spacing and padding are consistent with Figma_
- [ ] _Verify typography is consistent with the approved design system_
- [ ] _Verify colors match the approved Figma design_
- [ ] _Verify input borders and border radius match Figma_
- [ ] _Verify Sign In button styling matches Figma_
- [ ] _Verify Password visibility control matches Figma_

### Interaction States

- [ ] _Verify validation/error states match the approved Figma design_
- [ ] _Verify focused input states match Figma_
- [ ] _Verify disabled/loading Sign In state matches Figma_

### Layout Robustness

- [ ] Verify maximum-length Email and Password values do not break the layout
- [ ] Verify the Sign In layout remains consistent across supported screen sizes
- [ ] Verify long validation messages do not break the Sign In layout
