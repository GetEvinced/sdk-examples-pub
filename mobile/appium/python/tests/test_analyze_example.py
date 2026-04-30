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

    assert report is not None and len(report) > 0
    print(f"Issues found: {report[0].total}")
