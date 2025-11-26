# Authentication
Evinced SDKs will always require a **USER ID** and a **SECRET** of some kind. A **SECRET** could be an API key obtained from <https://hub.evinced.com> or a JSON Web Token(JWT) provided by an evinced employee.

>If you are using a API key typically this is referred to as a `secret` in the `setCredentials()` method.
>
>If you are using a JSON Web Token then this is referred to as a `token` in the `setOfflineCredentials()` method, typically used for offline authentication where access to the public internet is restricted. 

Use your local Environment variables or whatever current secret management system your team must conform to.

## NodeJS Environment (JavaScript SDKs)
### Playwright JS/TS
[js-playwright/global.settings.js](https://github.com/GetEvinced/examples/tree/main/js-playwright/global.settings.js)
```javascript
{{#include ../../../js-playwright/global.settings.js:3:15}}
```

### Cypress
[js-cypress/cypress/support/e2e.js](https://github.com/GetEvinced/examples/tree/main/js-cypress/cypress/support/e2e.js)
```javascript
// js-cypress/cypress/support/e2e.js
{{#include ../../../js-cypress/cypress/support/e2e.js:27:30}}
```

### Testcafe
[js-testcafe-web/.testcaferc.js](https://github.com/GetEvinced/examples/tree/main/js-testcafe-web/.testcaferc.js)
```javascript
// js-testcafe-web/.testcaferc.js
{{#include ../../../js-testcafe-web/.testcaferc.js:17:35}}
```

### WDIO Web & Mobile
[js-wdio-web/wdio.conf.js](https://github.com/GetEvinced/examples/tree/main/js-wdio-web/wdio.conf.js)
```javascript
// WEB js-wdio-web/wdio.conf.js
{{#include ../../../js-wdio-web/wdio.conf.js:5:23}}
```

[js-wdio-mobile/test/specs/mobileTest.js](https://github.com/GetEvinced/examples/tree/main/js-wdio-mobile/test/specs/mobileTest.js)
```javascript
// MOBILE js-wdio-mobile/test/specs/mobileTest.js
{{#include ../../../js-wdio-mobile/test/specs/mobileTest.js:8:13}}
```

### Unit Tester
[nextjs-react-unit-tester/jest.setup.js](https://github.com/GetEvinced/examples/tree/main/nextjs-react-unit-tester/jest.setup.js)
```javascript
// nextjs-react-unit-tester/jest.setup.js
{{#include ../../../nextjs-react-unit-tester/jest.setup.js}}
```

## Java
### Selenium
[java-selenium-web/src/test/java/com/krissutherland/EvincedSetupTest.java](https://github.com/GetEvinced/examples/tree/main/java-selenium-web/src/test/java/com/krissutherland/EvincedSetupTest.java)
```java
// java-selenium-web/src/test/java/com/krissutherland/EvincedSetupTest.java
{{#include ../../../java-selenium-web/src/test/java/com/krissutherland/EvincedSetupTest.java:33}}
```


{{#include ./snippets/official_docs.md}}


# Offline Authentication
If there is a strict network or blocked calls then try using Offline Authentication and disabling any outbound Evinced network calls.

## JavaScript frameworks

```javascript
await setOfflineCredentials({
            serviceId: process.env.EVINCED_SERVICE_ID,
            token: process.env.EVINCED_AUTH_TOKEN,
        });```