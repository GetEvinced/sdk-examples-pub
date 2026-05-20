# Evinced Support Example: Android Mobile Espresso SDK

In the following example, we demonstrate the best mechanism for using the [Android Espresso SDK for Android][0]

## Runners
This example [does not use a runner][1]. The reason for this is that at this point in time the instrumentation for the test will not have internet access.
To debug this issue with a [custom runner][2], you can use the following method in the runner to determine the connectivity status. If the customer insists on using a runner in this fashion, direct them to using an offline token rather.
```kotlin
private fun hasInternetAccess(context: Context): Boolean {
    val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    val network = connectivityManager.activeNetwork ?: return false
    val networkCapabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
    return when {
        networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
        networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
        networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
        else -> false 
    } 
}
```

Instead of using a runner, consider using a [suite][3]. This example, however uses [lazy instantiation in the test class companion object][4]:
```kotlin
companion object {
    val evincedEngine: EvincedEngine by lazy { 
        EvincedEngine.setupCredentials(
            BuildConfig.EVINCED_SERVICE_ACCOUNT_ID,
            BuildConfig.EVINCED_API_KEY
        )
        EvincedEngine.getInstance(getInstrumentation())
    }
  ...
```

## Build config

The [build config parameters are exposed environment variables][5] to prevent them from being stored in source control.
Downloading the report is done as part of the [gradle task][5]. To run `./graldew connectedDebugAndroidTest` and the reports will appear in the directory `app/build/reports/androidTests/evinced_report` and clears the report off the device

## Mainfest file
The [debug manifest][6] has the permission requests for internet and storage as some apps may not want these in their production builds
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Test classes

### [ExampleEvincedTest][4] — one-shot scan
The primary example. Calls `analyze()` manually at each screen state and stores all results, then flushes a single consolidated report via `reportStored()` in `@AfterClass`. Contains the `clickTabAndVerifyScreen` helper that clicks a Compose Tab and waits for the target screen without any production-code changes.

### [ContinuousEvincedTest][7] — continuous scan mode
Calls `startAnalyze()` in `@Before` and `stopAnalyze()` in `@After` so that Evinced automatically tracks every view-hierarchy change during a test without manual `analyze()` calls at each step. Each test produces its own per-test report. Best suited to flows with many intermediate screen states.

### [ConfiguredEvincedTest][8] — custom configuration
Shows how to apply `InitOptions` once in `@BeforeClass` to set global SDK behaviour (compliance mapping to WCAG/Section 508, report naming, CSV and meaningful-labels export). Also demonstrates:
- `addTestCaseMetadata()` for per-test labels visible in the Evinced dashboard
- Passing a per-scan `EvincedConfig` with `excludeFilters` directly to `analyze()` to suppress a known false-positive on a specific screen

[0]: https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk
[1]: https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk#setup
[2]: https://github.com/junit-team/junit4/wiki/test-runners
[3]: https://github.com/junit-team/junit4/wiki/test-runners
[4]: /app/src/androidTest/java/com/evinced/sampleapp/ExampleEvincedTest.kt
[5]: /app/build.gradle.kts
[6]: /app/src/debug/AndroidManifest.xml
[7]: /app/src/androidTest/java/com/evinced/sampleapp/ContinuousEvincedTest.kt
[8]: /app/src/androidTest/java/com/evinced/sampleapp/ConfiguredEvincedTest.kt