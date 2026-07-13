"""Hook pattern — wrap every test in a fresh scan session via a fixture.

The ``scanning_driver`` fixture is the pytest equivalent of the Java sample's
JUnit @Before / @After hooks: it starts a continuous scan before each test,
yields the driver to the test body, then stops the scan and saves a report —
even if the test body raises.

Each report is tagged with the test name via set_test_info() so uploads and
saved files are attributable to the test that produced them.
"""

from __future__ import annotations

import pytest
from selenium.webdriver.common.by import By

from evinced_selenium_sdk import SaveFileFormat

import demo_selectors as sel


@pytest.fixture
def scanning_driver(request, evinced_driver, reports_dir):
    test_name = request.node.name

    # Tag this session's report with the test name (parity with a labels API)
    evinced_driver.set_test_info(test_name=test_name, test_file=__file__)

    # @Before — start the continuous scan for this test
    evinced_driver.ev_start()

    yield evinced_driver

    # @After — stop the scan and save the report, whatever the test did
    report = evinced_driver.ev_stop()
    print(f"[{test_name}] issues found: {len(report)}")
    evinced_driver.ev_save_file(
        report,
        str(reports_dir / f"ev-hooks-{test_name}"),
        SaveFileFormat.HTML,
    )


def test_landing_page_accessibility(scanning_driver):
    scanning_driver.get(sel.DEMO_URL)
    # The fixture teardown captures and saves the report automatically.


def test_search_flow_accessibility(scanning_driver):
    scanning_driver.get(sel.DEMO_URL)

    # Interact with the search form
    scanning_driver.find_element(By.CSS_SELECTOR, sel.HOUSE_DROPDOWN).click()
    scanning_driver.find_element(By.CSS_SELECTOR, sel.TINY_HOME_OPTION).click()
    scanning_driver.find_element(By.CSS_SELECTOR, sel.LOCATION_DROPDOWN).click()
    scanning_driver.find_element(By.CSS_SELECTOR, sel.EAST_COAST_OPTION).click()
    scanning_driver.find_element(By.CSS_SELECTOR, sel.SEARCH_BUTTON).click()
    # The fixture teardown captures and saves the report automatically.
