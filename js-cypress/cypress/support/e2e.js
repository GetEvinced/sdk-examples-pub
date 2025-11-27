// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Evinced
import Evinced from "@evinced/cypress-sdk";

Evinced.init();

Evinced.setCredentials({
  serviceId: Cypress.env("serviceId"),
  secret: Cypress.env("secret"),
});

Evinced.setUploadToPlatformConfig({
  enableUploadToPlatform: true,
  setUploadToPlatformDefault: true,
});

// ONLY USED OFFLINE CREDENTIALS IF YOU NEED TO ISOLATE AN ISSUE

// Evinced.setOfflineCredentials({
//     serviceId: Cypress.env("EVINCED_SERVICE_ID"),
//     token: Cypress.env("EVINCED_AUTH_TOKEN"),
// });
