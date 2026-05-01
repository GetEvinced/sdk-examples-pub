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

        try:
            runner.driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Next").click()
        except Exception:
            pass

        time.sleep(2)  # allow any animation to settle before final scan
        reports = runner.stop_analyze()

    assert reports is not None
    for i, report in enumerate(reports):
        print(f"Report {i + 1} issues found: {report.total}")
