# Evinced SDK Examples

A curated collection of working, maintained examples for every Evinced SDK. Each example follows the same golden-standard patterns so you can copy, adapt, and run them against your own app with minimal changes.

## How to use this repository

Every subdirectory is a self-contained project with its own `README.md` covering prerequisites, setup, and how to run. Start there. This top-level README maps the full structure so you know where to look.

All examples read credentials from environment variables:

```bash
export EVINCED_SERVICE_ID=your_service_account_id
export EVINCED_API_KEY=your_api_key
```

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

## Unit

Examples for accessibility testing at the component level, integrated directly into your unit test suite.

| Directory | SDK | Framework | Run command |
|-----------|-----|-----------|-------------|
| `unit/react` | React Unit Tester | React + Jest | `npm test` |
| `unit/nextjs` | React Unit Tester | Next.js + Jest | `npm test` |
| `unit/angular/testbed` | Angular Unit Tester | Angular Testbed | `npm test` |
| `unit/angular/testing-library` | Angular Unit Tester | Testing Library | `npm test` |
| `unit/vitest-react-unit-tester` | React Unit Tester | Vitest | `npm test` |
| `unit/vitest-browser-unit-tester` | Browser Unit Tester | Vitest Browser | `npm test` |
| `unit/wtr-unit-tester` | Browser Unit Tester | Web Test Runner | `npm test` |

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
