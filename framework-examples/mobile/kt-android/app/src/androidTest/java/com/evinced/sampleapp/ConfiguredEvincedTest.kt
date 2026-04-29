package com.evinced.sampleapp

import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.hasAnyDescendant
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry.getInstrumentation
import com.evinced.test.EvincedEngine
import com.evinced.test.configuration.ComplianceMapping
import com.evinced.test.configuration.EvincedConfig
import com.evinced.test.configuration.InitOptions
import com.evinced.test.configuration.IssueFilter
import com.evinced.test.configuration.IssueType
import com.evinced.test.configuration.Severity
import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Evinced example demonstrating custom SDK configuration.
 *
 * This class shows how to:
 *  - Pass [InitOptions] to tailor the engine's global behaviour (compliance mapping,
 *    report name, meaningful-labels export)
 *  - Attach per-test metadata with [EvincedEngine.addTestCaseMetadata]
 *  - Pass a per-scan [EvincedConfig] to [analyze] to exclude specific issues
 *
 * The engine is configured once in [BeforeClass] so that [InitOptions] are applied
 * before the first test runs. [reportStored] is called in [AfterClass] as usual.
 *
 * See [SDK configuration docs](https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk#configuration)
 */
@RunWith(AndroidJUnit4::class)
class ConfiguredEvincedTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private fun hasTabWithText(text: String): SemanticsMatcher =
        SemanticsMatcher.expectValue(SemanticsProperties.Role, Role.Tab) and
                hasAnyDescendant(hasText(text))

    @OptIn(ExperimentalTestApi::class)
    private fun clickTabAndVerify(tabName: String, screenMatcher: SemanticsMatcher) {
        composeTestRule.onNode(hasTabWithText(tabName), useUnmergedTree = true).performClick()
        composeTestRule.waitUntilAtLeastOneExists(screenMatcher)
    }

    // -------------------------------------------------------------------------
    // Tests
    // -------------------------------------------------------------------------

    /**
     * Scans all three screens using the default (global) [EvincedConfig] applied
     * via [InitOptions] in [setup]. Custom metadata is added so that the report
     * dashboard can filter by test name.
     */
    @Test
    fun allScreensWithGlobalConfig() {
        evincedEngine.addTestCaseMetadata("testName", "allScreensWithGlobalConfig")
        evincedEngine.addTestCaseMetadata("testSuite", "ConfiguredEvincedTest")

        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()

        clickTabAndVerify("Text", hasText("Text Screen"))
        evincedEngine.analyze()

        clickTabAndVerify("Images", hasText("Image Screen"))
        evincedEngine.analyze()

        clickTabAndVerify("Buttons", hasText("Button Screen"))
        evincedEngine.analyze()
    }

    /**
     * Demonstrates passing a per-scan [EvincedConfig] directly to [analyze].
     *
     * The per-scan config is merged with the global config set in [InitOptions]:
     * issues excluded here are excluded only for this specific [analyze] call.
     * This is useful when a known false-positive exists on one particular screen.
     */
    @Test
    fun imageScreenWithFilteredConfig() {
        evincedEngine.addTestCaseMetadata("testName", "imageScreenWithFilteredConfig")

        // Build a per-scan config that suppresses a specific known issue type
        val perScanConfig = EvincedConfig()
            .excludeFilters(
                IssueFilter()
                    .issueType(IssueType.IMAGE_ALT)
                    .severity(Severity.CRITICAL)
            )

        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()
        clickTabAndVerify("Images", hasText("Image Screen"))

        // Pass the config directly to this analyze call only
        evincedEngine.analyze(perScanConfig)
    }

    // -------------------------------------------------------------------------
    // Shared engine with InitOptions — configured once before any test runs
    // -------------------------------------------------------------------------

    companion object {

        private val evincedEngine: EvincedEngine by lazy {
            EvincedEngine.setupCredentials(
                BuildConfig.EVINCED_SERVICE_ACCOUNT_ID,
                BuildConfig.EVINCED_API_KEY
            )
            EvincedEngine.getInstance(getInstrumentation())
        }

        /**
         * [BeforeClass] lets us apply [InitOptions] before the first test, ensuring
         * the global configuration (compliance mapping, output naming, CSV export, etc.)
         * is in place for every [analyze] call in this class.
         */
        @BeforeClass
        @JvmStatic
        fun setup() {
            // Build global init options applied to every analyze/report in this class
            val initOptions = InitOptions()
                // Map findings to WCAG 2.1 AA and Section 508 compliance frameworks
                .setComplianceMapping(
                    ComplianceMapping(
                        wcagEnabled = true,
                        section508Enabled = true,
                        eaaEnabled = false
                    )
                )
                // Give the consolidated report a descriptive name
                .setReportName("configured-evinced-test-report")
                // Export a JSON file listing meaningful button/image labels found on screen
                .putAdditionalOption("exportMeaningfulLabels", true)
                // Also export a CSV alongside the default HTML/JSON reports
                .putAdditionalOption("exportCsv", true)

            // InitOptions must be applied before any analyze() call.
            // setOptions() is safe to call immediately after getInstance().
            evincedEngine.setOptions(initOptions)
        }

        @AfterClass
        @JvmStatic
        fun tearDown() {
            evincedEngine.reportStored()
        }
    }
}
