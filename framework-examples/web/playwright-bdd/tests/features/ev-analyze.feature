Feature: Evinced evAnalyze - One-Shot Scan

  # evAnalyze performs a single snapshot accessibility scan on the current page state.
  # It does NOT require evStart/evStop — it is a one-off call.
  # Both HTML and JSON reports are saved for each scenario.

  Scenario: Scan the demo home page with evAnalyze
    Given I navigate to the Evinced demo home page
    Then I run an Evinced evAnalyze scan and save reports
