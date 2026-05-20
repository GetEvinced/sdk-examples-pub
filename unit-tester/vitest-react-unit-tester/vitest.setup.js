import matchers from '@testing-library/jest-dom/matchers';
import { configure } from '@evinced/unit-tester';

globalThis.expect?.extend?.(matchers);

configure({
    // use meta.env with vite as its a browser based environment
    serviceAccountId: import.meta.env.EVINCED_SERVICE_ID,
    serviceAccountSecret: import.meta.env.EVINCED_API_KEY,
    // or offlineToken: import.meta.env.EVINCED_OFFLINE_TOKEN,
  });