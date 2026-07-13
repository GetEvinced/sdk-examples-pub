"""ev_start / ev_stop pattern — continuous scan across multiple interactions.

Calls ev_start() before interacting, performs a search flow on the demo site,
then calls ev_stop() to retrieve the aggregated report and saves it as HTML.

To upload results to the Evinced Platform, enable uploads before creating the
driver — see test_setup_example.py.
"""

from __future__ import annotations

from selenium.webdriver.common.by import By

from evinced_selenium_sdk import SaveFileFormat

import demo_selectors as sel


def test_ev_start_ev_stop_example(evinced_driver, reports_dir):
    # Navigate to the site under test
    evinced_driver.get(sel.DEMO_URL)

    # Begin continuous scan — captures accessibility state across DOM changes
    evinced_driver.ev_start()

    # Perform user interactions under scan (the demo search flow)
    evinced_driver.find_element(By.CSS_SELECTOR, sel.HOUSE_DROPDOWN).click()
    evinced_driver.find_element(By.CSS_SELECTOR, sel.TINY_HOME_OPTION).click()
    evinced_driver.find_element(By.CSS_SELECTOR, sel.LOCATION_DROPDOWN).click()
    evinced_driver.find_element(By.CSS_SELECTOR, sel.EAST_COAST_OPTION).click()
    evinced_driver.find_element(By.CSS_SELECTOR, sel.SEARCH_BUTTON).click()

    # Stop continuous scan and retrieve the aggregated report
    report = evinced_driver.ev_stop()

    # The search flow navigated to the results page
    results = evinced_driver.find_element(By.CSS_SELECTOR, sel.SEARCH_RESULTS).text
    assert "Results for: Tiny House in East Coast" in results

    # Assert that accessibility issues were found across the flow
    assert len(report) > 0, "expected accessibility issues during the demo search flow"
    print(f"Issues found during flow: {len(report)}")

    # Save an HTML report to disk
    evinced_driver.ev_save_file(
        report,
        str(reports_dir / "ev-start-stop-report"),
        SaveFileFormat.HTML,
    )
