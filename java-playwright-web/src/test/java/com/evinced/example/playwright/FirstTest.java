package com.evinced.example.playwright;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;

import org.junit.jupiter.api.Test;

public class FirstTest {

    @Test
    void shouldNavigateToEvincedDemo() {
        // Manage Playwright context in try block
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            Page page = browser.newPage();
            page.navigate("https://demo.evinced.com");
            page.waitForLoadState(LoadState.NETWORKIDLE);
            System.out.println("Page title: " + page.title());
            System.out.println(page.url());
            browser.close();
        }
    }
}
