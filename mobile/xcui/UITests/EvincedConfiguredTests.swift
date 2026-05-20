import XCTest
import EvincedXCUISDK

/// Demonstrates filtering issues by severity and attaching custom metadata
/// to the report for grouping/labelling results in the Evinced Platform.
final class EvincedConfiguredTests: EvincedTestCase {

    override func setUpWithError() throws {
        try super.setUpWithError()

        let severityFilter = IssueFilter(severities: .critical)
        EvincedEngine.options.config = EvincedConfig(excludeFilters: [severityFilter])
        EvincedEngine.testCaseMetadata = ["team": "mobile-qa", "sprint": "2026-Q2"]
    }

    override func tearDownWithError() throws {
        try EvincedEngine.reportStored(assert: false)
    }

    func testConfigured() throws {
        let report = try app.evReport(assert: false)
        XCTAssertNotNil(report, "Report should not be nil")
        print("Issues found (excluding Critical): \(report.issues?.count ?? 0)")
    }
}
