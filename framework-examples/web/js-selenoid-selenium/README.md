# Evinced + Selenium (JS) with Selenoid

This project demonstrates how to run the Evinced JS Selenium SDK against a remote Chrome browser running in Selenoid.

It executes an accessibility scan on [https://demo.evinced.com/](https://demo.evinced.com/) and generates an HTML report.

---

## Architecture

```
Mocha Test
    ↓
Selenium WebDriver (JS)
    ↓
Remote WebDriver → Selenoid (Docker)
    ↓
Chrome Container
    ↓
Evinced SDK Injection
```

---

## Prerequisites

- Docker running locally
- Node.js (recommended: Node 20 LTS)
- Valid Evinced credentials:
  - `EVINCED_SERVICE_ID`
  - `EVINCED_API_KEY`

---

## Setup & Usage

### 1. Start Selenoid

If not already running:

```bash
docker run -d \
  --name selenoid \
  -p 4444:4444 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ~/.aerokube/selenoid:/etc/selenoid:ro \
  aerokube/selenoid:latest-release
```

Pull a Chrome image:

```bash
docker pull selenoid/chrome:latest
```

Verify Selenoid is running by navigating to:

```
http://localhost:4444/status
```

You should see a browser availability JSON response.

---

### 2. Install Dependencies

From the project root:

```bash
npm install
```

The project uses:

- `selenium-webdriver`
- `@evinced/js-selenium-sdk`
- `mocha`

---

### 3. Test File Overview

The test:

- Connects to remote Chrome via Selenoid
- Sets Evinced credentials globally
- Navigates to the demo site
- Runs `evAnalyze`
- Saves an HTML report
- Asserts result shape

**Important implementation details:**

- Uses `setCredentials()` — global auth model
- Uses `evAnalyze()` — correct method for `js-selenium-sdk`
- Uses Mocha timeout override (scan takes >2s)
- Always calls `driver.quit()` in `finally`

---

### 4. Create Output Folder (First Time Only)

```bash
mkdir -p test-results
```

---

### 5. Run the Test

```bash
EVINCED_SERVICE_ID=YOUR_SERVICE_ID \
EVINCED_API_KEY=YOUR_SECRET \
npx mocha --timeout 120000 evincedTest.js
```

---

## Expected Output

**Terminal:**

```
Issue count: 6
  ✔ evAnalyze via remote Chrome
```

**Generated report:**

```
test-results/evAnalyze-report.html
```

Open the file in your browser to view the full accessibility report.

---

## Important Notes

### Mocha Timeout

The default Mocha timeout is `2000ms`. Accessibility scans take longer.

The test includes an inline override:

```js
this.timeout(120000);
```

Alternatively, pass the flag at run time:

```bash
--timeout 120000
```