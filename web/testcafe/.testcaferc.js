const { setCredentials, EvincedSDK } = require("@evinced/js-testcafe-sdk");

module.exports = {
  hooks: {
    // Each unique launch of TestCafe constitutes a single test run.
    // Test run hooks cannot access the browser.
    testRun: {
      before: async () => {
        console.log('Global testRun before hook');
      },
      after: async () => {
        console.log('Global testRun after hook');
      },
      // Global fixture hooks run before/after each of the fixtures in your test suite.
      // Fixture hooks cannot access the browser.
    },
    fixture: {
      before: async () => {
        // Set credentials
        try {
          console.log("Accessing Global Credentials");

          await setCredentials({
            serviceId: process.env.EVINCED_SERVICE_ID,
            secret: process.env.EVINCED_API_KEY,
          });
          // To configure Offline Credentials use below example
          // await setOfflineCredentials({
          //   serviceId: process.env.EVINCED_SERVICE_ID,
          //   token: process.env.EVINCED_AUTH_TOKEN,
          // });
        } catch (error) {
          console.log("Error Evinced SDK authorization failure ", error);
        }
      },
      after: async () => {
        console.log("Global Fixture after hook");
      },
    },
  },
  // Global test hooks run before/after each of the tests in your entire test suite.
  // Hooks that run before and after tests can access the browser.
  test: {
  },
};
