package com.evinced.examples;

import android.app.Instrumentation;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.UiDevice;

import com.evinced.test.EvincedEngine;
import com.evinced.test.models.InitOptions;

class TestSetup {

    static final String DEMO_APP_PACKAGE = "com.evinced.demoapp";

    static void setupCredentials() {
        Bundle args = InstrumentationRegistry.getArguments();
        EvincedEngine.setupCredentials(
                args.getString("EVINCED_SERVICE_ID"),
                args.getString("EVINCED_API_KEY")
        );
    }

    static EvincedEngine createEngine() {
        setupCredentials();
        return EvincedEngine.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    static EvincedEngine createEngine(InitOptions options) {
        setupCredentials();
        return EvincedEngine.getInstance(InstrumentationRegistry.getInstrumentation(), options);
    }

    static void launchDemoApp() throws InterruptedException {
        Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();
        Context context = instrumentation.getContext();

        Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(DEMO_APP_PACKAGE);
        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
        UiDevice.getInstance(instrumentation).waitForIdle(3000);
        Thread.sleep(1000);
    }
}
