import {
  setCredentials,
  setOfflineCredentials,
} from "@evinced/js-playwright-sdk";

export default async function globalSetup(config) {
  try {
    await setCredentials({
      serviceId: process.env.EVINCED_SERVICE_ID,
      secret: process.env.EVINCED_API_KEY,
    });

    // await setOfflineCredentials({
    //   serviceId: process.env.EVINCED_SERVICE_ID,
    //   token: process.env.EVINCED_WEB_OFFLINE_TOKEN,
    // });
  } catch (error) {
    throw new Error("Evinced SDK authorization failure.");
  }
}
