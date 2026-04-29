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

    NOTE: The Python mobile SDK does not have a separate "labels" API.
    Attach metadata to your CI/CD environment variables or report name
    via InitOptions if you need to tag test runs.
    """
    # Exclude Minor severity issues from the scan results
    exclude_minor = ReportFilter([Severity.minor])

    # EvincedConfig lets you define include/exclude filters
    ev_config = EvincedConfig(exclude_filters=[exclude_minor])

    # InitOptions bundles the config and can also set a custom output directory
    init_options = InitOptions(evinced_config=ev_config)

    time.sleep(3)

    with EvincedAppiumDefaultRunner(driver, init_options=init_options) as runner:
        runner.analyze()
        report = runner.report()

    assert not report.has_issues(), (
        "Accessibility issues (Moderate or above) were found. "
        "See the generated Evinced report for details."
    )
