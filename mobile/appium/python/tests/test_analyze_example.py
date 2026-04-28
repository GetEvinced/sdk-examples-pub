import pytest
import time
import os
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from evinced_appium_sdk import *

# Define Severity filters to exclude
report_filter_exclude = ReportFilter([Severity.minor])

# Storing Evinced configuration
ev_config = EvincedConfig(include_filters=[report_filter_exclude])

# Passing ev_config into our init_options so the driver can access it
init_options = InitOptions(evinced_config=ev_config)

def test_analyze_example(driver):
    time.sleep(5)
    # Create Evinced Appium default runner and pass the init_options
    with EvincedAppiumDefaultRunner(driver,  init_options=init_options) as runner:
        # Running a scan
        runner.analyze()

        # Generates an accessibility report
        report = runner.report()