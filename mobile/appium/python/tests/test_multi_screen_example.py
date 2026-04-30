import time
from appium.webdriver.common.appiumby import AppiumBy
from evinced_appium_sdk import EvincedAppiumDefaultRunner, InitOptions


def test_multi_screen_example(driver):
    """
    Demonstrates scanning multiple screens in one test: call analyze() after
    each navigation step, then report_stored() to get one report per snapshot.

    This is the closest equivalent to web evStart/evStop: the context manager
    keeps the runner alive across screens, each analyze() captures that state,
    and report_stored() returns a list — one entry per analyze() call.
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

        # report_stored() returns a list — one report per analyze() call
        reports = runner.report_stored()

    for i, report in enumerate(reports):
        assert not report.has_issues(), (
            f"Accessibility issues found on screen {i + 1}. "
            "See the generated Evinced report for details."
        )
