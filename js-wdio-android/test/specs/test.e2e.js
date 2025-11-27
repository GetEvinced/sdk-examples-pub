import { expect, browser, $ } from '@wdio/globals'

import {EvincedWdioMobileSdk} from '@evinced/wdio-mobile-sdk';

describe('Evinced Test', () => {
    const options = { outputDir: './evinced-a11y-reports' };
    let evincedWdioSdk;    
    before(async () => {
        evincedWdioSdk = new EvincedWdioMobileSdk(options);
        const isLicenseValid = await evincedWdioSdk.setupCredentials(
            process.env.EVINCED_SERVICE_ACCOUNT_ID,
            process.env.EVINCED_API_KEY
        );
        if (!isLicenseValid) {
            console.error("!! License INVALID !!");
        }
        await browser.activateApp(`com.evinced.demoapp`)
    }); 

    after(async () => {
        await browser.terminateApp(`com.evinced.demoapp`);
    })

    it('test with evinced mobile sdk: android js', async () => {
        const selector = 'new UiSelector().text("Where to?")'
        const demoAppElement = $(`android=${selector}`)
        await (await demoAppElement).waitForDisplayed({ timeout: 20000 }) 
        await evincedWdioSdk.analyze();        

        const buttonSelector = 'new UiSelector().resourceId("com.evinced.demoapp:id/destination_input")'
        const buttonElement = $(`android=${buttonSelector}`)
        await buttonElement.click()
        await evincedWdioSdk.analyze();   
        await evincedWdioSdk.reportStored(true);        
    })
})