import pytest
import os
from appium import webdriver
from appium.options.android import UiAutomator2Options
from evinced_appium_sdk import LicenseManager

SERVICE_ID = os.environ["EVINCED_SERVICE_ID"]
API_KEY = os.environ["EVINCED_API_KEY"]

SAUCE_USER = os.environ.get("SAUCE_USER")
SAUCE_ACCESS_KEY = os.environ.get("SAUCE_ACCESS_KEY")


@pytest.fixture(scope="module")
def driver():
    LicenseManager().setup_credentials(service_id=SERVICE_ID, api_key=API_KEY)

    options = UiAutomator2Options()

    if SAUCE_USER and SAUCE_ACCESS_KEY:
        # Use set_capability for Appium-prefixed caps — property setters on
        # UiAutomator2Options don't all serialize into to_capabilities().
        options.set_capability("appium:deviceName", "Android GoogleAPI Emulator")
        options.set_capability("appium:platformVersion", "15.0")
        options.set_capability("appium:app", "storage:filename=com.evinced.demoapp-MK.apk")
        options.set_capability("sauce:options", {
            "username": SAUCE_USER,
            "accessKey": SAUCE_ACCESS_KEY,
            "appiumVersion": "2.11.0",
            "build": "Examples Repository",
            "name": "Python Appium Evinced Tests",
        })
        url = "https://ondemand.us-west-1.saucelabs.com/wd/hub"
    else:
        options.set_capability("appium:deviceName", "API_36")
        options.set_capability("appium:app", os.path.join(os.path.dirname(__file__), "..", "com.evinced.demoapp-MK.apk"))
        url = "http://127.0.0.1:4723"

    d = webdriver.Remote(url, options=options)
    yield d
    try:
        d.quit()
    except Exception:
        pass
