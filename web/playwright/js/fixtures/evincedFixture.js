import { test as base, expect } from "@playwright/test";
import { EvincedSDK } from "@evinced/js-playwright-sdk";

// Extend the base test with Evinced fixtures
export const test = base.extend({
    // Fixture that automatically starts and stops Evinced scanning
    evincedContMode: async ({ page }, use, testInfo) => {
        const evincedService = new EvincedSDK(page);

        // Start continuous scanning
        await evincedService.evStart();

        // Provide the service to the test
        await use(evincedService);

        // Stop scanning and generate report
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const testName = testInfo.title.replace(/\s+/g, "_");
        const evReport = `./test-results/${testName}_${timestamp}.html`;

        try {
            const issues = await evincedService.evStop();
            await evincedService.evSaveFile(issues, "html", evReport);
        } catch (error) {
            console.error("Error during evStop() and evSavefile():", error);
            throw error;
        }
    }
});

// Export expect from the extended test
export { expect };