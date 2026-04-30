import XCTest
import EvincedXCUISDK

/// Two upload approaches:
///   1. enabledByDefault — every evReport() call uploads automatically.
///   2. Per-call — pass upload: .enabled to a single evReport() call.
final class EvincedPlatformUploadTests: EvincedTestCase {

    override func setUpWithError() throws {
        try super.setUpWithError()
        EvincedEngine.options.platformConfig = PlatformConfig(uploadOption: .enabledByDefault)
    }

    override func tearDownWithError() throws {
        try EvincedEngine.reportStored(assert: false)
    }

    func testUploadWithDefaultConfig() throws {
        // Uploads automatically because of enabledByDefault
        let report = try app.evReport(assert: false)
        XCTAssertNotNil(report, "Report should not be nil")
        print("Issues found (auto-uploaded): \(report.issues?.count ?? 0)")
    }

    func testUploadPerCall() throws {
        // Upload only this specific scan
        let report = try app.evReport(assert: false, upload: .enabled)
        XCTAssertNotNil(report, "Report should not be nil")
        print("Issues found (per-call upload): \(report.issues?.count ?? 0)")
    }
}
