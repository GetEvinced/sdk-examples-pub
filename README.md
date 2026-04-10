# Evinced Appium Python SDK Example

A working example of the Evinced Appium Python SDK integrated with pytest for Android accessibility testing.

## Prerequisites

- Python 3.7+
- Node.js v22+
- Android Studio with an emulator configured
- Evinced service account credentials (service ID and API key)
- A valid Android APK

## Setup

### 1. Install Appium

```bash
npm install -g appium
appium driver install uiautomator2
```

### 2. Install Python evinced-appium-sdk

```bash
pip3 install evinced-appium-sdk --extra-index-url https://evinced.jfrog.io/artifactory/api/pypi/public-python/simple/
```

### 3. Configure environment variables

Add the following to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
export APP_PATH=/path/to/your/app.apk
```


## The Fixture

Using `conftest.py` fixture that defines a shared `driver`.

The fixture handles:
- Authenticating with Evinced credentials
- Creating the Appium driver session before all tests `scope="module"`
- Passes driver with `yield`
- Quitting the session after tests complete