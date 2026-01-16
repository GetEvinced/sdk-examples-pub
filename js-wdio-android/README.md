# Evinced Support Example: WDIO Android (JS)

## Installation

### From REPO

You need to get a local version of the [Evinced WebDriverIO Mobile SDK][2]

```bash
npm install -D ../../libs/wdio-mobile-sdk-1.24.0.tgz
npm install
```

### From scratch
1. Install WDIO and make your selections. There is a [guide][0].

```
npm init wdio@latest .
```

If you encounter errors with the runner, you may want to downgrade the runner dependency:

```
`"@wdio/local-runner": "9.7.2"`
```

## App used

The app used in this example is the [Evinced Android Demo app][1]. You'll need to install this on the device.

## Additional documentation

[Evinced WebDriverIO Mobile SDK documentation][3] 

[0]: https://webdriver.io/docs/gettingstarted
[1]: https://github.com/GetEvinced/evinced-android-demo-application
[2]: https://evinced.jfrog.io/ui/native/restricted-npm-local/%40evinced/wdio-mobile-sdk/-/%40evinced/
[3]: https://developer.evinced.com/sdks-for-mobile-apps/wdio-mobile-sdk