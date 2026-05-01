import '@testing-library/jest-dom';
import { configure } from "@evinced/unit-tester";

configure({
  serviceAccountId: process.env.EVINCED_SERVICE_ID,
  serviceAccountSecret: process.env.EVINCED_API_KEY,
  // you can use an offline token here as well
  // offlineToken: process.env.EVINCED_OFFLINE_UT_TOKEN
});