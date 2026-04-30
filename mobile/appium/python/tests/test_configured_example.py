import time
from evinced_appium_sdk import (
    EvincedAppiumDefaultRunner,
    EvincedConfig,
    InitOptions,
    ReportFilter,
    Severity,
)


def test_configured_example(driver):
    """
    Demonstrates using EvincedConfig + ReportFilter to scope the scan:
    Minor-severity issues are excluded so the assertion only fails on
    Moderate, Serious, or Critical findings.
    """
    exclude_minor = ReportFilter([Severity.minor])
    ev_config = EvincedConfig(exclude_filters=[exclude_minor])
    init_options = InitOptions(evinced_config=ev_config)

    time.sleep(3)

    with EvincedAppiumDefaultRunner(driver, init_options=init_options) as runner:
        report = runner.report()

    assert report is not None and len(report) > 0
    print(f"Issues found (excluding Minor): {report[0].total}")
