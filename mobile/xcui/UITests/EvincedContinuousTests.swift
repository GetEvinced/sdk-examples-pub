import XCTest
import EvincedXCUISDK

/// Continuous mode: startAnalyze() begins automatic scanning in the background.
/// Every screen transition is captured automatically. stopAnalyze() ends the
/// session and returns one Report per captured state.
final class EvincedContinuousTests: EvincedTestCase {

    func testContinuousScan() throws {
        EvincedEngine.startAnalyze()

        let showDetailButton = app.buttons["Show Detail"]
        if showDetailButton.waitForExistence(timeout: 2) {
            showDetailButton.tap()
        }

        let reports = try EvincedEngine.stopAnalyze()
        XCTAssertNotNil(reports, "stopAnalyze should return reports")
        for (index, report) in reports.enumerated() {
            print("Report \(index + 1) issues: \(report.issues?.count ?? 0)")
        }
    }
}
