Feature: Evinced Demo Search

  Scenario: Search for Remote Arizona
    Given I am on the demo Evinced site
    When I select "backyard" from the "type" dropdown
    And I select "middle America" from the "where" dropdown
    And I click the "Search" button
    Then I see the option "Remote Arizona"
