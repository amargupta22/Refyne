# Cypress API Testing Design Document

## 1. Overview
This document outlines the minimum required components for an API testing framework using Cypress. The framework is designed for efficient testing of third-party APIs, including authentication handling, request validation, and reporting.

## 2. High-Level Architecture

**Component Diagram:**
```
+--------------------+       +---------------------+       +--------------------+
|  Test Runner      | ----> |  Request Manager   | ----> |  Third-Party APIs  |
+--------------------+       +---------------------+       +--------------------+
        |                           |                           |
        v                           v                           v
+--------------------+       +---------------------+       +--------------------+
|  Authentication   |       |  Fixtures & Data    |       |  Reporting Module  |
|      Manager      |       |     Management     |       |                    |
+--------------------+       +---------------------+       +--------------------+
```

### **Key Components:**
1. **Test Runner:** Executes Cypress tests.
2. **Request Manager:** Handles API requests, response validation, and error handling.
3. **Authentication Manager:** Manages OAuth 2.0 tokens and API key-based authentication.
4. **Fixtures & Data Management:** Provides external test data and configurations.
5. **Reporting Module:** Generates test reports with execution details.

---

## 3. Authentication Manager

- The **Authentication Manager** handles API authentication via OAuth 2.0 and API keys.
- Tokens are fetched before test execution and stored dynamically.
- **Implementation (`cypress/support/utils/auth.js`):**
  ```js
  class AuthManager {
      static fetchAccessToken() {
          return cy.request({
              method: 'POST',
              url: 'https://api.example.com/auth/token',
              body: {
                  clientId: Cypress.env('CLIENT_ID'),
                  clientSecret: Cypress.env('CLIENT_SECRET')
              }
          }).then((response) => {
              expect(response.status).to.eq(200);
              Cypress.env('accessToken', response.body.accessToken);
              return response.body.accessToken;
          });
      }
  }
  export default AuthManager;
  ```
- **Usage in tests:**
  ```js
  import AuthManager from '../support/utils/auth';
  
  before(() => {
      AuthManager.fetchAccessToken();
  });
  ```

---

## 4. Request Manager

- The **Request Manager** simplifies API requests by providing a reusable function to handle authentication and headers.
- **Implementation (`cypress/support/utils/requestManager.js`):**
  ```js
  class RequestManager {
      static sendRequest(method, endpoint, body = {}, headers = {}) {
          return cy.request({
              method: method,
              url: `https://api.example.com${endpoint}`,
              headers: {
                  Authorization: `Bearer ${Cypress.env('accessToken')}`,
                  ...headers
              },
              body: body
          });
      }
  }
  export default RequestManager;
  ```
- **Usage in tests:**
  ```js
  import RequestManager from '../support/utils/requestManager';
  
  it('Verifies PAN using Request Manager', () => {
      const requestData = {
          panNumber: 'ABCDE1234F',
          fullName: 'John Doe',
          dateOfBirth: '1990-01-01'
      };
  
      RequestManager.sendRequest('POST', '/pan/verify', requestData).then((response) => {
          expect(response.status).to.eq(200);
      });
  });
  ```

---

## 5. Fixtures & Test Data Management

- **Fixtures** store static test data like API requests and responses.
- **Example fixture file (`cypress/fixtures/pan_verify.json`)**:
  ```json
  {
    "panNumber": "ABCDE1234F",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01"
  }
  ```
- Usage in tests:
  ```js
  cy.fixture('pan_verify').then((data) => {
      RequestManager.sendRequest('POST', '/pan/verify', data).then((response) => {
          expect(response.status).to.eq(200);
      });
  });
  ```

---

## 6. Reporting

- **Cypress generates reports using Mochawesome**.
- Install the plugin:
  ```sh
  npm install --save-dev mochawesome
  ```
- Update `cypress.config.js`:
  ```js
  const { defineConfig } = require('cypress');
  module.exports = defineConfig({
      reporter: 'mochawesome',
      reporterOptions: {
          reportDir: 'cypress/reports',
          overwrite: false,
          html: true,
          json: true
      }
  });
  ```
- Run tests and generate reports:
  ```sh
  npx cypress run
  ```

---

## 7. Conclusion
This document provides the necessary components for a Cypress-based API testing framework, focusing on authentication handling, request management, fixtures, and reporting. The framework is scalable and can be extended to support additional API tests and integrations.

