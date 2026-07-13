"""ev_analyze pattern — one-shot accessibility scan.

Navigates to a page, calls ev_analyze() once, asserts issues were found,
and saves an HTML report to disk.
"""

from __future__ import annotations

from evinced_selenium_sdk import SaveFileFormat

import demo_selectors as sel


def test_ev_analyze_example(evinced_driver, reports_dir):
    # Navigate to the page under test
    evinced_driver.get(sel.DEMO_URL)

    # Run a one-shot accessibility scan
    report = evinced_driver.ev_analyze()

    # Assert that accessibility issues were found
    assert len(report) > 0, "expected accessibility issues on the demo home page"
    print(f"Issues found: {len(report)}")

    # Save an HTML report to disk
    evinced_driver.ev_save_file(
        report,
        str(reports_dir / "ev-analyze-report"),
        SaveFileFormat.HTML,
    )
