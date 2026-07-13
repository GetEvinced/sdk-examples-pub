"""Shared pytest fixtures for the Evinced Selenium Python examples.

Credentials are read from environment variables (offline token, matching the
Java and .NET Selenium examples in this repo):

    export EVINCED_SERVICE_ID=your_service_id
    export EVINCED_WEB_OFFLINE_TOKEN=your_offline_token

Set HEADED=true to watch the browser run.
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from evinced_selenium_sdk import EvincedWebDriver, set_offline_credentials


def _require_credentials() -> tuple[str, str]:
    service_id = os.environ.get("EVINCED_SERVICE_ID")
    token = os.environ.get("EVINCED_WEB_OFFLINE_TOKEN")
    missing = [
        name
        for name, value in (
            ("EVINCED_SERVICE_ID", service_id),
            ("EVINCED_WEB_OFFLINE_TOKEN", token),
        )
        if not value
    ]
    if missing:
        pytest.skip(f"{' / '.join(missing)} not set — export Evinced credentials to run this example")
    return service_id, token


def _chrome_options() -> Options:
    options = Options()
    if not os.environ.get("HEADED"):
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1280,1024")
    return options


@pytest.fixture(scope="session")
def credentials() -> tuple[str, str]:
    """Service ID and offline token, or skip the test if they are not set."""
    return _require_credentials()


@pytest.fixture
def reports_dir() -> Path:
    """Directory where example tests write their HTML/JSON reports."""
    path = Path(__file__).resolve().parents[1] / "reports"
    path.mkdir(exist_ok=True)
    return path


@pytest.fixture
def driver():
    """A plain headless Chrome WebDriver (ChromeDriver resolved by Selenium Manager)."""
    raw = webdriver.Chrome(options=_chrome_options())
    try:
        yield raw
    finally:
        try:
            raw.quit()
        except Exception:  # noqa: BLE001 — session may already be closed
            pass


@pytest.fixture
def evinced_driver(credentials, driver):
    """Chrome wrapped by the Evinced SDK, authenticated with offline credentials."""
    service_id, token = credentials
    set_offline_credentials(service_id=service_id, token=token)
    wrapper = EvincedWebDriver(driver)
    yield wrapper
