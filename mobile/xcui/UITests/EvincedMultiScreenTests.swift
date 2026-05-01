import XCTest
import EvincedXCUISDK

/// Multi-screen pattern: evAnalyze() captures a snapshot of each screen
/// without generating a report file. reportStored() in tearDown generates
/// one Report per captured state.
final class EvincedMultiScreenTests: EvincedTestCase {

    override func tearDownWithError() throws {
        let reports = try EvincedEngine.reportStored(assert: false)
        XCTAssertFalse(reports.isEmpty, "reportStored should return at least one report")
        for (index, report) in reports.enumerated() {
            print("Screen \(index + 1) issues: \(report.issues?.count ?? 0)")
        }
    }

    func testMultipleScreens() throws {
        // Screen 1: launch state
        try app.evAnalyze()

        // Screen 2: navigate to detail view
        let showDetailButton = app.buttons["Show Detail"]
        if showDetailButton.waitForExistence(timeout: 2) {
            showDetailButton.tap()
        }
        try app.evAnalyze()
    }
}
