# Evinced XCUITest SDK Examples

## Prerequisites

- macOS 11.3+
- Xcode 13+
- [XcodeGen](https://github.com/yonaskolb/XcodeGen) (`brew install xcodegen`)
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)

## Setup

### 1. Generate the Xcode project

```bash
cd mobile/xcui
xcodegen generate
open EvincedXCUIExamples.xcodeproj
```

Xcode will resolve the `EvincedXCUISDK` Swift Package dependency automatically on first open.

### 2. Set credentials

In Xcode: **Product → Scheme → Edit Scheme → Test → Environment Variables**

| Name | Value |
|------|-------|
| `EVINCED_SERVICE_ID` | your service account ID |
| `EVINCED_API_KEY` | your API key |

### 3. Run tests

From Xcode press **⌘ U**, or from the command line:

```bash
xcodebuild test \
  -project EvincedXCUIExamples.xcodeproj \
  -scheme EvincedXCUIExamples \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  -testenv EVINCED_SERVICE_ID=$EVINCED_SERVICE_ID \
  -testenv EVINCED_API_KEY=$EVINCED_API_KEY
```

Run a single test class:

```bash
xcodebuild test \
  -project EvincedXCUIExamples.xcodeproj \
  -scheme EvincedXCUIExamples \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  -only-testing:EvincedXCUIExamplesUITests/EvincedExampleTests \
  -testenv EVINCED_SERVICE_ID=$EVINCED_SERVICE_ID \
  -testenv EVINCED_API_KEY=$EVINCED_API_KEY
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedExampleTests.swift` | One-shot scan | Calls `app.evReport()` to scan the current screen immediately. |
| `EvincedMultiScreenTests.swift` | Multi-screen | `app.evAnalyze()` per screen; `reportStored()` in `tearDown` collects one `Report` per state. |
| `EvincedContinuousTests.swift` | Continuous | `startAnalyze()` begins automatic scanning; `stopAnalyze()` ends the session and returns all reports. |
| `EvincedConfiguredTests.swift` | Config + metadata | `IssueFilter` to exclude Critical severity; `testCaseMetadata` to attach custom labels. |
| `EvincedPlatformUploadTests.swift` | Platform upload | `enabledByDefault` uploads all reports automatically; `evReport(upload: .enabled)` uploads per-call. |

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedEngine.setupCredentials(serviceAccountId:apiKey:)` | Authenticate (call in `setUpWithError`) |
| `EvincedEngine.testCase = self` | Wire up the test case reference |
| `app.evReport(assert:)` | One-shot scan; returns `Report` |
| `app.evReport(assert:upload:)` | One-shot scan with platform upload |
| `app.evAnalyze()` | Capture current screen without generating a report |
| `EvincedEngine.reportStored(assert:)` | Generate reports from all stored `evAnalyze()` calls; returns `[Report]` |
| `EvincedEngine.startAnalyze()` | Begin continuous automatic scanning |
| `EvincedEngine.stopAnalyze()` | End continuous session; returns `[Report]` |
| `EvincedEngine.options` | Global configuration (`config`, `platformConfig`, `screenshotOptions`, etc.) |
| `EvincedEngine.testCaseMetadata` | Custom metadata labels applied to all reports in the test class |

## Platform upload

```swift
// All scans upload automatically
EvincedEngine.options.platformConfig = PlatformConfig(uploadOption: .enabledByDefault)
try app.evReport(assert: false)

// Or upload only a specific scan
try app.evReport(assert: false, upload: .enabled)
```

## Filtering issues

```swift
let filter = IssueFilter(severities: .critical)
EvincedEngine.options.config = EvincedConfig(excludeFilters: [filter])

// Filter by issue type
let typeFilter = IssueFilter(issueTypes: .tappableArea)
EvincedEngine.options.config = EvincedConfig(excludeFilters: [typeFilter])
```

## Why XcodeGen

iOS Xcode projects (`.xcodeproj`) are complex XML files that are hard to maintain
in source control. XcodeGen generates them from the human-readable `project.yml`
spec in this directory. Re-run `xcodegen generate` any time `project.yml` changes.
Add `.xcodeproj` to `.gitignore` so only the spec is committed.
