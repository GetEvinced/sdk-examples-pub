import time
from appium.webdriver.common.appiumby import AppiumBy
from evinced_appium_sdk import EvincedAppiumDefaultRunner, InitOptions


def test_multi_screen_example(driver):
    """
    Demonstrates scanning multiple screens in one test: call analyze() after
    each navigation step, then report_stored() to get one report per snapshot.

    report_stored() returns a list — one Report per analyze() call.
    """
    init_options = InitOptions()

    with EvincedAppiumDefaultRunner(driver, init_options) as runner:
        # Screen 1: app launch / home screen
        time.sleep(3)
        runner.analyze()

        # Screen 2: navigate deeper in the app
        try:
            nav_element = driver.find_element(AppiumBy.ACCESSIBILITY_ID, "Next")
            nav_element.click()
            time.sleep(2)
        except Exception:
            pass
        runner.analyze()

        reports = runner.report_stored()

    assert reports is not None and len(reports) > 0
    for i, report in enumerate(reports):
        print(f"Screen {i + 1} issues found: {report.total}")
