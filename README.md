# Evinced SDK Examples

A curated collection of working, maintained examples for every Evinced SDK. Each example follows the same golden-standard patterns so you can copy, adapt, and run them against your own app with minimal changes.

## How to use this repository

Every subdirectory is a self-contained project with its own `README.md` covering prerequisites, setup, and how to run. Start there. This top-level README maps the full structure so you know where to look.

All examples read credentials from environment variables:

```bash
export EVINCED_SERVICE_ID=your_service_account_id
export EVINCED_API_KEY=your_api_key
```

If you use the offline token, please reach out to support [support@evinced.com](mailto:support@evinced.com) if you require help obtaining the token or have questions.

You can obtain these from your [Evinced account](https://app.evinced.com). If you don't have an account yet, contact [support@evinced.com](mailto:support@evinced.com).

---

## Web

Examples for testing web applications. Each example demonstrates the same set of patterns: one-shot scan, continuous scanning across page interactions, configuration and filtering, and platform upload.

| Directory | SDK | Language | Run command |
|-----------|-----|----------|-------------|
| `web/playwright/js` | Playwright Web | JavaScript | `npx playwright test` |
| `web/playwright/ts` | Playwright Web | TypeScript | `npx playwright test` |
| `web/playwright-java/maven` | Playwright Web | Java (Maven) | `mvn test` |
| `web/cypress/js` | Cypress Web | JavaScript | `npx cypress run` |
| `web/cypress/ts` | Cypress Web | TypeScript | `npx cypress run` |
| `web/selenium/js` | Selenium Web | JavaScript | `npm test` |
| `web/selenium/ts` | Selenium Web | TypeScript | `npm test` |
| `web/selenium/java` | Selenium Web | Java (Maven) | `mvn test` |
| `web/selenium/dotnet` | Selenium Web | C# (.NET) | `dotnet test` |
| `web/wdio/js` | WebdriverIO Web | JavaScript | `npm run wdio` |
| `web/wdio/ts` | WebdriverIO Web | TypeScript | `npm run wdio` |
| `web/testcafe` | TestCafe Web | JavaScript | `npm test` |

---

## Mobile

Examples for testing native Android and iOS applications. Tests use a pre-built Evinced demo APK (`com.evinced.demoapp-MK.apk`) so no app source code is required.

### Appium

| Directory | SDK | Language | Run command |
|-----------|-----|----------|-------------|
| `mobile/appium/python` | Appium Mobile | Python | `pytest` |
| `mobile/appium/java` | Appium Mobile | Java (Maven) | `mvn test` |

Both require a running Appium server (`appium`) and a connected Android emulator.

### WebdriverIO Mobile

| Directory | SDK | Language | Run command |
|-----------|-----|----------|-------------|
| `mobile/wdio` | WebdriverIO Mobile | JavaScript | `npm run wdio` |

Requires a running Appium server and Android emulator. See the directory README for Sauce Labs configuration.

### Espresso / UIAutomator

| Directory | SDK | Language | Run command |
|-----------|-----|----------|-------------|
| `mobile/espresso-gradle` | Espresso / UIAutomator | Java (Gradle) | `./gradlew connectedDebugAndroidTest` |

An Android Gradle project. Open in Android Studio — it handles the Gradle wrapper and SDK downloads automatically. Tests use UIAutomator so the demo APK must be installed on the emulator (`adb install`).

### XCUITest (iOS)

| Directory | SDK | Language | Run command |
|-----------|-----|----------|-------------|
| `mobile/xcui` | XCUITest | Swift | `xcodebuild test` |

Requires macOS, Xcode 13+, and [XcodeGen](https://github.com/yonaskolb/XcodeGen). Run `xcodegen generate` first to produce the Xcode project, then open in Xcode or run via `xcodebuild`.

---

## Unit Tester

Examples for accessibility testing at the component level, integrated directly into your unit test suite.

| Directory | SDK | Framework | Run command |
|-----------|-----|-----------|-------------|
| `unit-tester/react` | React Unit Tester | React + Jest | `npm test` |
| `unit-tester/nextjs` | React Unit Tester | Next.js + Jest | `npm test` |
| `unit-tester/angular/testbed` | Angular Unit Tester | Angular Testbed | `npm test` |
| `unit-tester/angular/testing-library` | Angular Unit Tester | Testing Library | `npm test` |
| `unit-tester/vitest-react-unit-tester` | React Unit Tester | Vitest | `npm test` |
| `unit-tester/vitest-browser-unit-tester` | Browser Unit Tester | Vitest Browser | `npm test` |
| `unit-tester/wtr-unit-tester` | Browser Unit Tester | Web Test Runner | `npm test` |

---

## Framework examples

Additional examples covering specific integration patterns and less common frameworks.

| Directory | Description |
|-----------|-------------|
| `framework-examples/web/playwright-bdd` | Playwright with BDD / Cucumber |
| `framework-examples/web/js-selenoid-selenium` | Selenium running on Selenoid grid |
| `framework-examples/web/lit-unit-tester` | Lit component unit testing |
| `framework-examples/mobile/kt-android` | Kotlin Android (Espresso) |

---

## What each example demonstrates

Every example in this repository covers the same core patterns regardless of SDK or language:

| Pattern | Description |
|---------|-------------|
| **One-shot scan** | Scan a single screen or page state and generate a report immediately |
| **Multi-screen / analyze** | Capture multiple screens with `analyze()` checkpoints, then generate reports for each |
| **Continuous mode** | Automatically capture every screen transition without explicit checkpoints |
| **Configuration and filtering** | Exclude issues by severity or type; attach custom metadata for reporting |
| **Platform upload** | Send results to the Evinced Platform automatically or on a per-scan basis |

---

## Questions and support

Contact the Evinced support team at [support@evinced.com](mailto:support@evinced.com).

## Demo: MCP-Driven Cross-Repo A11y Auto-Fix

This repo includes a demo pipeline that:

1. Runs `web/playwright/js/tests/evMcpDemo.spec.js` against `https://demo-fe-orpin.vercel.app/`.
2. Saves the Evinced findings to `test-results/evMcpDemo.json` and uploads them as a CI artifact.
3. Triggers `web-a11y-autofix.yml`, which clones the target Next.js FE repo and invokes Claude (via `claude-code-action` + the Evinced MCP) to open one PR per accessibility finding.

### Architecture

See `MCPREPO.md` at the repo root for the full design spec.

### One-time setup for forkers

1. Fork this repo and a target Next.js FE repo (e.g., `EvincedShane/demo-fe`).
2. Edit `a11y-autofix.config.json` so `target.owner`, `target.repo`, `target.baseUrl` point to your fork.
3. Set the following GitHub Actions secrets in this fork:
   - `EVINCED_SERVICE_ID`, `EVINCED_API_KEY` — your Evinced platform credentials.
   - `ANTHROPIC_API_KEY` — for `claude-code-action`.
   - `DEMO_FE_PAT` — a [fine-grained PAT](https://github.com/settings/personal-access-tokens) scoped to your target FE repo, with `Contents: write` and `Pull requests: write`.
   - `SLACK_WEBHOOK_URL` — optional, for the Slack notification.
4. In the target FE repo, add a `.github/CODEOWNERS` line:
   ```
   /a11y-findings/  @your-github-username
   ```
   and enable branch protection on `main` requiring CODEOWNERS review.

### Running the demo

- **Live**: push to `main`, or wait for the Monday cron. `web-js.yml` runs the test → uploads `evMcpDemo.json` → `web-a11y-autofix.yml` fires automatically.
- **Dry-run** (no PRs opened): trigger `web-js.yml` first so an artifact exists, then dispatch `web-a11y-autofix.yml` with `dry_run = true`. The agent runs end-to-end and logs `[DRY-RUN]` in place of every PR mutation.

### What gets created in the target repo

- One branch per finding: `a11y/fix-<signature>` (idempotent on re-runs).
- One PR per finding, labelled `a11y,automated`.
- One tracking file: `a11y-findings/<signature>.md` summarizing what the agent saw and proposed.

Merging a PR requires CODEOWNERS approval on the tracking file — this is the human verification gate.
