package com.evinced.example;

import com.evinced.EvincedReporter;
import com.evinced.report.Report;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class StaticAnalysisTest extends BaseTest {

    @BeforeEach
    void navigateToPage() {
        driver.get(testUrl);
    }

    @Test
    void staticAnalysisScanReturnsReport() {
        Report report = driver.evAnalyze();
        EvincedReporter.evSaveFile(
            REPORTS_DIR + "/static-analysis",
            report,
            EvincedReporter.FileFormat.HTML
        );
    }
}
