# Cypress API Automation

## Overview
This project automates API testing for third-party integrations using Cypress. It includes test cases for Aadhaar and PAN verification APIs, ensuring robust validation, authentication handling, and error handling.

## Prerequisites
- Node.js (>= 14.x)
- npm (>= 6.x) or yarn
- Git
- Jenkins (for CI/CD integration)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/amargupta22/Refyne.git
   cd Refyne
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running Tests
### Run all tests in headless mode:
```sh
npx cypress run
```

### Run specific test file:
```sh
npx cypress run --spec "cypress/e2e/apiTests/aadhaar_api_spec.cy.js"
```

### Open Cypress UI:
```sh
npx cypress open
```

## Project Structure
```
Refyne/
├── cypress/
│   ├── e2e/
│   │   ├── apiTests/
│   │   │   ├── aadhaar_api_spec.cy.js
│   │   │   ├── pan_api_spec.cy.js
│   ├── fixtures/
│   ├── support/
├── cypress.config.js
├── package.json
├── .gitignore
└── README.md
```

## Authentication Handling
- The framework fetches an OAuth 2.0 access token before making API requests.
- The token is stored dynamically in the test lifecycle.

## Environment Variables
- Set sensitive credentials in a `.env` file (not committed to Git).
- Example `.env`:
  ```ini
  CLIENT_ID=your-client-id
  CLIENT_SECRET=your-client-secret
  API_KEY=your-api-key
  ```

## Reporting
- Cypress generates reports in `cypress/reports`.
- Can be integrated with **Mochawesome** for enhanced reporting:
  ```sh
  npm install --save-dev mochawesome
  ```

## CI/CD Integration
### Example Jenkinsfile pipeline:
```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/amargupta22/Refyne.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                sh 'npx cypress run'
            }
        }
    }
}
```



