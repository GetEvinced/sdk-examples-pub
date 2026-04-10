package com.evinced.sampleapp

import androidx.activity.ComponentActivity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasAnyDescendant
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.AndroidComposeTestRule
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry.getInstrumentation
import com.evinced.test.EvincedEngine
import org.junit.AfterClass
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Evinced example test using analyze
 * 
 * Because the test uses the [AndroidComposeTestRule] class, the activity is 
 * reloaded between tests, so app state is going to be a concern to the user
 * of this test. 
 * 
 * If you want to use contiunous mode, you need to use a class rule
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 * See [class rule]()
 */
@RunWith(AndroidJUnit4::class)
class ExampleEvincedTest {
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    private fun hasTabWithText(text: String): SemanticsMatcher {
        return SemanticsMatcher.expectValue(SemanticsProperties.Role, Role.Tab) and
                hasAnyDescendant(hasText(text))
    }

    @OptIn(ExperimentalTestApi::class)
    private fun <A : ComponentActivity> AndroidComposeTestRule<ActivityScenarioRule<A>, A>.clickTabAndVerifyScreen(
        tabName: String,
        screenMatcher: SemanticsMatcher
    ) {
        onNode(hasTabWithText(tabName), useUnmergedTree = true).performClick()
        waitUntilAtLeastOneExists(screenMatcher)
    }
    
    @Test
    fun evincedTest() {
        composeTestRule
            .onNodeWithText("Evinced Test Demo")
            .assertIsDisplayed()
        
        composeTestRule
            .clickTabAndVerifyScreen("Text", hasText("Text Screen"))
        evincedEngine.analyze()
        
        composeTestRule
            .clickTabAndVerifyScreen("Images", hasText("Image Screen"))         
        evincedEngine.analyze()
        
        composeTestRule
            .clickTabAndVerifyScreen("Buttons", hasText("Button Screen"))         
        evincedEngine.analyze()
    }

    companion object {
        val evincedEngine: EvincedEngine by lazy {
            EvincedEngine.setupCredentials(
                BuildConfig.EVINCED_SERVICE_ACCOUNT_ID,
                BuildConfig.EVINCED_API_KEY
            )
            EvincedEngine.getInstance(getInstrumentation())
        }

        @AfterClass
        @JvmStatic
        fun tearDown() {
            evincedEngine.reportStored()
        }
    }
}