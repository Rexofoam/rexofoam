# US-003: Remember Me on Home Page

As a user, I want a "Remember Me" option on the login form, so that my username is saved and pre-filled the next time I visit the site.

- Add a “Remember Me” checkbox to the login form on the home page.
- When checked, store the username (and optionally OCID) in localStorage.
- On page load, pre-fill the username field if data exists in localStorage.
- Use React state to manage the checkbox and input value.
