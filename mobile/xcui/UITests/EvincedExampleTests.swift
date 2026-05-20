import XCTest
import EvincedXCUISDK

/// Simplest pattern: evReport() scans the current screen immediately and
/// returns a Report. tearDown calls reportStored() to flush any stored scans.
final class EvincedExampleTests: EvincedTestCase {

    override func tearDownWithError() throws {
        try EvincedEngine.reportStored(assert: false)
    }

    func testScanLaunchScreen() throws {
        let report = try app.evReport(assert: false)
        XCTAssertNotNil(report, "Report should not be nil")
        print("Issues found: \(report.issues?.count ?? 0)")
    }
}
