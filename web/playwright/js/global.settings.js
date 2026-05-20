const { setCredentials } = require("@evinced/js-playwright-sdk");

// If using this approach, make sure you import the file into playwright.config.js/ts

async function globalSetup(config) {
  try {
    await setCredentials({
      serviceId: process.env.EVINCED_SERVICE_ID,
      secret: process.env.EVINCED_API_KEY,
    });
  } catch (error) {
    throw new Error("Evinced SDK authorization failure.");
  }
}
module.exports = globalSetup;
