import time
from evinced_appium_sdk import EvincedAppiumDefaultRunner, InitOptions


def test_analyze_example(driver):
    """
    Simplest scan pattern: a single report() call captures the current
    screen state and generates HTML/JSON output into evinced-reports/.
    """
    init_options = InitOptions()

    time.sleep(3)

    with EvincedAppiumDefaultRunner(driver, init_options) as runner:
        report = runner.report()

    assert not report.has_issues(), (
        "Accessibility issues were found. "
        "See the generated Evinced report for details."
    )
