import time
from appium.webdriver.common.appiumby import AppiumBy
from evinced_appium_sdk import EvincedAppiumContinuesRunner, InitOptions


def test_continuous_example(driver):
    """
    Demonstrates continuous mode: the SDK automatically scans on Appium
    commands (click, send_keys, etc.) without explicit analyze() calls.

    Use EvincedAppiumContinuesRunner with start_analyze() / stop_analyze().
    Add a small delay before stop_analyze() to avoid capturing mid-animation.
    """
    init_options = InitOptions()

    with EvincedAppiumContinuesRunner(driver, init_options) as runner:
        runner.start_analyze()

        # Interact with the app — the SDK scans automatically on each action
        try:
            runner.driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Next").click()
        except Exception:
            pass

        time.sleep(0.25)  # avoid scanning mid-animation
        reports = runner.stop_analyze()

    for i, report in enumerate(reports):
        assert not report.has_issues(), (
            f"Accessibility issues found in continuous scan (report {i + 1}). "
            "See the generated Evinced report for details."
        )
