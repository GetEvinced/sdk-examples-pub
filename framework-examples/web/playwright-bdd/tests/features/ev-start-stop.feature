Feature: Evinced evStart / evStop - Continuous Scan

  # evStart begins continuous monitoring. All user interactions between evStart and evStop
  # are captured for accessibility analysis. evStop returns all issues found.
  # Labels add metadata visible on the Evinced Platform.
  # Set enableUploadToPlatform: true (with EVINCED_SERVICE_ID + EVINCED_API_KEY env vars)
  # to upload results to the Evinced Platform dashboard.

  Scenario: Scan the demo site while interacting with filters
    Given I start an Evinced continuous scan with labels
    And I open the Evinced demo site
    When I select the "backyard" property type filter
    And I select the "middle America" location filter
    Then I stop the Evinced scan and save the report
