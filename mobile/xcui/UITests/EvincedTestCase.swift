import XCTest
import EvincedXCUISDK

/// Shared base class. Credentials are read from environment variables set in
/// the Xcode scheme (Product > Scheme > Edit Scheme > Test > Environment Variables)
/// or passed via xcodebuild's -testenv flag.
class EvincedTestCase: XCTestCase {
    let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
        EvincedEngine.testCase = self
        try EvincedEngine.setupCredentials(
            serviceAccountId: ProcessInfo.processInfo.environment["EVINCED_SERVICE_ID"] ?? "",
            apiKey: ProcessInfo.processInfo.environment["EVINCED_API_KEY"] ?? ""
        )
    }
}
