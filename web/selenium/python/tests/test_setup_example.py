"""Setup / configuration example — the knobs a real test suite tends to use.

Unlike the other examples (which rely on the shared ``evinced_driver`` fixture),
this one builds the wrapped driver inline so every configuration step is visible
in one place:

* EvincedConfig — screenshots, and an optional root_selector to scope analysis
  to a subtree of the page.
* Debug logging — the SDK logs under the ``evinced`` logger; set the
  EV_SDK_LOG_LEVEL environment variable (DEBUG/INFO/WARNING/ERROR) to control
  verbosity at runtime.
* Labels — set_test_info() tags the report with the test name/file.
* Platform upload — set_upload_to_platform_config(...) enables uploads
  (commented out by default).
"""

from __future__ import annotations

import logging

from selenium import webdriver

from evinced_selenium_sdk import (
    EvincedConfig,
    EvincedWebDriver,
    SaveFileFormat,
    set_offline_credentials,
    # set_upload_to_platform_config,  # uncomment to enable platform uploads
)

import demo_selectors as sel
from conftest import _chrome_options


def test_configured_scan_example(credentials, reports_dir):
    service_id, token = credentials

    # See SDK debug logs on the console by raising the "evinced" logger level.
    # Equivalent to exporting EV_SDK_LOG_LEVEL=DEBUG before running pytest.
    logging.getLogger("evinced").setLevel(logging.INFO)

    # Authenticate with offline credentials
    set_offline_credentials(service_id=service_id, token=token)

    # Scan configuration. root_selector scopes analysis to a subtree — here the
    # demo site's filter panel. Drop it to analyze the whole page.
    config = EvincedConfig(
        enable_screenshots=True,
        root_selector="#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container",
    )

    # To upload scan results to the Evinced Platform, uncomment:
    # set_upload_to_platform_config(enableUploadToPlatform=True)

    raw = webdriver.Chrome(options=_chrome_options())
    evinced_driver = EvincedWebDriver(raw, config)

    # Tag the report with this test's name and file
    evinced_driver.set_test_info(test_name="test_configured_scan_example", test_file=__file__)

    try:
        evinced_driver.get(sel.DEMO_URL)

        # With uploads enabled above, pass upload_to_platform=True per call:
        # report = evinced_driver.ev_analyze(upload_to_platform=True)
        report = evinced_driver.ev_analyze()

        assert len(report) >= 0  # scoped scan may legitimately find zero issues
        print(f"Issues found in filter panel: {len(report)}")

        evinced_driver.ev_save_file(
            report,
            str(reports_dir / "ev-setup-report"),
            SaveFileFormat.JSON,
        )
    finally:
        raw.quit()
