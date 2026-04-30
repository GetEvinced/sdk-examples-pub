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

    caps = UiAutomator2Options()
    caps.platform_name = "Android"
    caps.automation_name = "UIAutomator2"

    if SAUCE_USER and SAUCE_ACCESS_KEY:
        caps.device_name = "Android GoogleAPI Emulator"
        caps.platform_version = "15.0"
        caps.app = "storage:filename=com.evinced.demoapp-MK.apk"
        caps.set_capability("sauce:options", {
            "appiumVersion": "2.11.0",
            "build": "Examples Repository",
            "name": "Python Appium Evinced Tests",
        })
        url = f"https://{SAUCE_USER}:{SAUCE_ACCESS_KEY}@ondemand.us-west-1.saucelabs.com/wd/hub"
    else:
        caps.device_name = "API_36"
        caps.app = os.path.join(os.path.dirname(__file__), "..", "com.evinced.demoapp-MK.apk")
        url = "http://127.0.0.1:4723"

    d = webdriver.Remote(url, options=caps)
    yield d
    try:
        d.quit()
    except Exception:
        pass
