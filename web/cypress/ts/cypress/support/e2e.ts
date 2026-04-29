import "./commands";
import Evinced from "@evinced/cypress-sdk";

Evinced.init({
  enableScreenshots: true
});

Evinced.setCredentials({
  serviceId: Cypress.env("serviceId"),
  secret: Cypress.env("secret"),
});

// Upload to the Evinced Platform is opt-in.
// Uncomment the block below to enable platform upload globally.
// When enabled, individual tests can still override with uploadToPlatform in cy.evStop().
// Evinced.setUploadToPlatformConfig({
//   enableUploadToPlatform: true,
//   setUploadToPlatformDefault: true,
// });

// ONLY USED OFFLINE CREDENTIALS IF YOU NEED TO ISOLATE AN ISSUE

// Evinced.setOfflineCredentials({
//     serviceId: Cypress.env("EVINCED_SERVICE_ID"),
//     token: Cypress.env("EVINCED_AUTH_TOKEN"),
// });
