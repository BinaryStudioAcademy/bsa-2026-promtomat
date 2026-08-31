---
name: "Example: Auth checklist"
about: Example feature checklist, showing the format to follow for other features
title: "[QA CHECKLIST] Login — Auth"
labels: qa-checklist, auth
---

## Auth checklist

- [ ] Empty email shows a validation error
  <details>
  <summary>Steps</summary>

  **Preconditions:** user is logged out

  1. Open the login page
  2. Leave email blank, enter a valid password
  3. Click Login

  **Test data:** password = `Test1234!`
  **Expected:** red border on the email field + "Email is required"
  </details>
- [ ] Empty password shows a validation error
- [ ] Correct credentials log the user in
- [ ] Wrong password shows an error, doesn't log in
