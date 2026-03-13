# Playwright E2E & API Test Automation

This project leverages **Playwright** for end-to-end (E2E) UI testing of the Ubiquiti Store and provides a custom **Node.js Express API** for library management with a dedicated automated test suite.

## 🛠 Tech Stack

- **Languages:** TypeScript (Tests), JavaScript (Server)
    
- **UI & API Testing:** [Playwright](https://playwright.dev/ "null")
    
- **Backend:** Node.js (v24 recommended) + Express
    
- **Package Manager:** [Yarn 4](https://yarnpkg.com/ "null") (Workspaces)
    
- **Linter/Formatter:** [BiomeJS](https://biomejs.dev/ "null")
    

## 🚀 Getting Started

Note: The installation and launch instructions are optimized for MacOS.

### Prerequisites

1. **Install Node.js & NVM (Node Version Manager):**
    
    ```
    curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh) | bash
    source ~/.nvm/nvm.sh
    nvm install 24
    ```
    
2. **Install Yarn Package Manager:**
    
    ```
    npm install --global yarn
    ```
    

### Installation

1. **Clone the repository:**
    
    ```
    git clone <your-repo-url>
    cd ubiquiti-assignment-network
    ```
    
2. **Install dependencies:** This command installs dependencies for both the root project and the API server workspace:
    
    ```
    yarn install
    ```
    
3. **Install Playwright browsers:**
    
    ```
    yarn playwright install --with-deps
    ```
    

## 🧪 Running Tests

The project is configured to **automatically launch the API server** using Playwright's `webServer` feature. You don't need to start the server manually before running tests.

### Local Execution

```
# Run all tests (UI & API) across all configured browsers
yarn run-tests

# Run tests and open the detailed HTML report
yarn run-tests-with-report

# Run specific test suites
npx playwright test tests/apiTest.spec.ts  # API tests only
npx playwright test tests/cart.spec.ts     # UI Store tests only
```

### Reporting

- **View last report:** `yarn show-report`
    
- **Clean results:** `yarn clean-results`
    

## 🖥 Development & API Server

If you need to interact with the Library API independently (e.g., for manual debugging with Postman):

- **Start Server:** `yarn server:start`
    
- **Dev Mode (with auto-reload):** `yarn server:dev`
    
- **API Endpoint:** `http://localhost:3000`
    

## 📂 Project Structure

- **`pages/`** → Page Object Model (POM) classes inheriting from `BasePage`
    
- **`tests/`** → E2E UI and REST API test suites
    
- **`server/`** → Backend API implementation (Node.js/Express) using a local file-based database (`db.json`)
    
- **`utils/`** → Shared utility functions, constants, types, and test data
    
- **`ci/`** → Jenkins CI/CD pipeline configurations
    
- **`playwright.config.ts`** → Main configuration (includes `webServer`, global teardown, and project settings)
    

## 🧹 Linting & Formatting

This project uses **BiomeJS** for linting and formatting to maintain a clean codebase.

```
# Run linter
yarn biome-lint

# Apply formatting and fix linting issues
yarn biome-format-apply
```
