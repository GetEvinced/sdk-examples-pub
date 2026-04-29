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
import org.junit.After
import org.junit.AfterClass
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Evinced example test using continuous scan mode.
 *
 * [startAnalyze] is called in [Before] so that Evinced begins tracking view-hierarchy
 * changes as soon as each test starts. [stopAnalyze] is called in [After] to flush a
 * per-test report. This means every test gets its own accessibility report covering
 * every screen state visited during that test, without needing a manual [analyze] call
 * at each navigation step.
 *
 * Because [createAndroidComposeRule] restarts the activity between tests, the engine
 * is shared as a lazy companion-object singleton (same pattern as [ExampleEvincedTest]).
 *
 * See [Continuous mode docs](https://developer.evinced.com/sdks-for-mobile-apps/espresso-sdk#continuous-scan)
 */
@RunWith(AndroidJUnit4::class)
class ContinuousEvincedTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    // -------------------------------------------------------------------------
    // Lifecycle hooks
    // -------------------------------------------------------------------------

    @Before
    fun startScan() {
        evincedEngine.startAnalyze()
    }

    /**
     * [stopAnalyze] stops continuous tracking and internally calls [reportStored],
     * producing one HTML/JSON report that covers all screen states visited during
     * the test. Passing [false] prevents the test from failing on accessibility
     * issues — remove the argument (or pass [true]) to enforce zero violations.
     */
    @After
    fun stopScan() {
        evincedEngine.stopAnalyze(false)
    }

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

    @Test
    fun textScreenIsAccessible() {
        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()
        clickTabAndVerify("Text", hasText("Text Screen"))
        // No manual analyze() call needed — continuous mode tracks all state changes
    }

    @Test
    fun imageScreenIsAccessible() {
        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()
        clickTabAndVerify("Images", hasText("Image Screen"))
    }

    @Test
    fun buttonScreenIsAccessible() {
        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()
        clickTabAndVerify("Buttons", hasText("Button Screen"))
    }

    /**
     * A single test can navigate through multiple screens.
     * Continuous mode captures every intermediate state automatically.
     */
    @Test
    fun fullFlowIsAccessible() {
        composeTestRule.onNodeWithText("Evinced Test Demo").assertIsDisplayed()
        clickTabAndVerify("Text", hasText("Text Screen"))
        clickTabAndVerify("Images", hasText("Image Screen"))
        clickTabAndVerify("Buttons", hasText("Button Screen"))
    }

    // -------------------------------------------------------------------------
    // Shared engine (lazy, initialised once per test run)
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
         * [AfterClass] is not strictly required here because [stopAnalyze] already
         * calls [reportStored] after each test. It is included as a safety net to
         * write a report for any residual stored data if a test is interrupted before
         * [After] runs.
         */
        @AfterClass
        @JvmStatic
        fun tearDown() {
            evincedEngine.reportStored()
        }
    }
}
