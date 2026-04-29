import time
from appium.webdriver.common.appiumby import AppiumBy
from evinced_appium_sdk import EvincedAppiumDefaultRunner, InitOptions


def test_multi_screen_example(driver):
    """
    Demonstrates scanning multiple screens in one test by calling analyze()
    after each navigation step, then calling report() to collect all results.

    This is the closest equivalent to web evStart/evStop continuous mode:
    the context manager keeps the runner alive across multiple screens, and
    each analyze() call captures the current screen state.

    NOTE: The Python mobile SDK does not expose a separate startAnalyze /
    stopAnalyze API — use the context manager pattern with multiple analyze()
    calls instead.
    """
    init_options = InitOptions()

    with EvincedAppiumDefaultRunner(driver, init_options=init_options) as runner:
        # --- Screen 1: app launch / home screen ---
        time.sleep(3)
        runner.analyze()

        # --- Screen 2: navigate deeper in the app ---
        # Replace the locator below with one that matches your app under test
        try:
            nav_element = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Next")
            nav_element.click()
            time.sleep(2)
        except Exception:
            # If the element isn't present, skip navigation and still scan
            pass
        runner.analyze()

        # Collect all captured scan results as a single report
        report = runner.report()

    # The report contains issues from both screens; assert none were found
    assert not report.has_issues(), (
        f"Accessibility issues found across screens. "
        f"Total issues: {report.total_issues}. "
        "See the generated Evinced report for details."
    )
