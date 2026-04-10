import "./commands";
import Evinced from "@evinced/cypress-sdk";

Evinced.init({
  enableScreenshots: true
});

Evinced.setCredentials({
  serviceId: Cypress.env("serviceId"),
  secret: Cypress.env("secret"),
});

// ONLY USED OFFLINE CREDENTIALS IF YOU NEED TO ISOLATE AN ISSUE

// Evinced.setOfflineCredentials({
//     serviceId: Cypress.env("EVINCED_SERVICE_ID"),
//     token: Cypress.env("EVINCED_AUTH_TOKEN"),
// });
