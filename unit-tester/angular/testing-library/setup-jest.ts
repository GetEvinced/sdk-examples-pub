import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { configure } from '@evinced/unit-tester';

setupZoneTestEnv();

configure({
  serviceAccountId: process.env['EVINCED_SERVICE_ID'],
  serviceAccountSecret: process.env['EVINCED_API_KEY'],
});
