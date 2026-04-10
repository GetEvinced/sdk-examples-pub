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

## Instrumented test example 
There are some useful test structures in the [ExampleEvincedTest][4] file, namely `clickTabAndVerifyScreen` which does not require developers to add syntactic sugar to production code in order to test clicking and waiting for a Tab. This pattern could be extended to other accessibility tests. 

[0]: https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk
[1]: https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk#setup
[2]: https://github.com/junit-team/junit4/wiki/test-runners
[3]: https://github.com/junit-team/junit4/wiki/test-runners
[4]: /app/src/androidTest/java/com/evinced/sampleapp/ExampleEvincedTest.kt
[5]: /app/build.gradle.kts
[6]: /app/src/debug/AndroidManifest.xml