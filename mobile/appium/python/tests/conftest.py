# conftest.py
import pytest
import os
from appium import webdriver
from dotenv import load_dotenv

from appium.options.android import UiAutomator2Options
from evinced_appium_sdk import LicenseManager

SERVICE_ID = os.environ["EVINCED_SERVICE_ID"]
API_KEY = os.environ["EVINCED_API_KEY"]

@pytest.fixture(scope="module")
def driver():
    # Setup Evinced license
    LicenseManager().setup_credentials(service_id=SERVICE_ID, api_key=API_KEY)


    # Prepare the target options for Android
    caps = UiAutomator2Options()
    caps.platform_name = "Android"
    caps.device_name = "API_36"
    caps.app = os.path.join(os.path.dirname(__file__), "..", "com.evinced.demoapp-MK.apk")

    driver = webdriver.Remote("http://127.0.0.1:4723", options=caps)
    yield driver
    try:
        driver.quit()
    except Exception:
        pass