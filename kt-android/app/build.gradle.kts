plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.evinced.sampleapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.evinced.sampleapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        debug {
            android.buildFeatures.buildConfig = true
            buildConfigField(
                "String",
                "EVINCED_SERVICE_ACCOUNT_ID",
                "\"${System.getenv("EVINCED_SERVICE_ACCOUNT_ID")}\""
            )
            buildConfigField(
                "String",
                "EVINCED_API_KEY",
                "\"${System.getenv("EVINCED_API_KEY")}\""
            )
        }
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.runtime.ktx)
    implementation(libs.androidx.navigation.compose)
    testImplementation(libs.junit)

    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)

    // Evinced
    androidTestImplementation(libs.evinced.sdk)

    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}

tasks.register("pullEvincedReport") {
    doLast {
        println("Pulling Evinced report...")
        exec {
            workingDir = file(".")
            commandLine("bash",
                "-c",
                """
            adb logcat -d > logfile.txt;
            EVINCED_REPORT_PATH="evinced_report_path";
            REPORT_PATH="${'$'}(cat logfile.txt | grep ${'$'}EVINCED_REPORT_PATH | awk -F "THSP:" '{ print ${'$'}NF }' | tail -n 1 | grep -o '\/.*[0-9]' )"
            echo ${'$'}{REPORT_PATH};            
            adb pull ${'$'}{REPORT_PATH} build/reports/androidTests/evinced_report;
            zip -r evinced_report.zip build/reports/androidTests/evinced_report;
            adb shell rm -rf ${'$'}{REPORT_PATH};
            rm logfile.txt
            rm evinced_report.zip
        """.trimIndent()
            )
        }
    }
}

tasks.whenTaskAdded {
    if (name == "connectedDebugAndroidTest") {
        finalizedBy("pullEvincedReport")
    }
}