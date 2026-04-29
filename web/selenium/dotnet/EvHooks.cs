using System;
using System.IO;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Evinced.SDK;

namespace EvincedCSharpTests
{
    /// <summary>
    /// evHooks pattern — per-test lifecycle wrapping with [SetUp] / [TearDown].
    ///
    /// Each test gets a fresh driver and scan session. [SetUp] starts the continuous
    /// scan and [TearDown] stops it, saves the report, then tears down the driver —
    /// even when the test throws.
    ///
    /// The .NET Selenium SDK does not currently expose a labels API.
    /// When a labels API becomes available, add label calls inside [SetUp] to tag
    /// each report with the test name.
    ///
    /// To upload results to the Evinced Platform, set EvincedSDK.UploadToPlatform = true
    /// inside EvincedConfig.Initialize() or directly in [SetUp].
    /// </summary>
    [TestFixture]
    public class EvHooksTest
    {
        private ChromeDriver baseDriver = null!;
        private IEvincedDriver driver = null!;

        [SetUp]
        public void SetUp()
        {
            // Reads EVINCED_SERVICE_ID and EVINCED_WEB_OFFLINE_TOKEN from environment variables
            EvincedConfig.Initialize();

            baseDriver = new ChromeDriver();
            driver = EvincedDriverFactory.Create(baseDriver);

            // Begin continuous scan for this test
            driver.EvStart();
        }

        [TearDown]
        public void TearDown()
        {
            try
            {
                if (driver != null)
                {
                    // Stop the scan and retrieve the aggregated report
                    IReport report = driver.EvStop();

                    // Save HTML and JSON reports to disk
                    string timestamp = DateTime.Now.ToString("yyyyMMdd-HHmmss");
                    string baseName = $"ev-hooks-report-{timestamp}";
                    EvincedSDK.EvSaveFile(baseName, report, FileFormat.JSON);
                    EvincedSDK.EvSaveFile(baseName, report, FileFormat.HTML, driver);

                    Console.WriteLine("Reports saved to: " + Directory.GetCurrentDirectory());
                }
            }
            finally
            {
                driver?.Quit();
                baseDriver?.Quit();
            }
        }

        [Test]
        public void LandingPageAccessibility()
        {
            WebDriverWait wait = new WebDriverWait(baseDriver, TimeSpan.FromSeconds(10));

            driver.Navigate().GoToUrl("https://demo.evinced.com/");
            wait.Until(d => d.FindElement(By.CssSelector("main")));

            // [TearDown] will stop the scan and save the report automatically
        }

        [Test]
        public void SearchFlowAccessibility()
        {
            WebDriverWait wait = new WebDriverWait(baseDriver, TimeSpan.FromSeconds(10));

            driver.Navigate().GoToUrl("https://demo.evinced.com/");
            wait.Until(d => d.FindElement(By.CssSelector("main")));

            // Interact with the search form
            var whatDropdown = wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p")));
            whatDropdown.Click();

            var treehouseOption = wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]")));
            treehouseOption.Click();

            var whereDropdown = wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/div[1]/p")));
            whereDropdown.Click();

            var eastCoastOption = wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/ul/li[3]")));
            eastCoastOption.Click();

            var searchButton = wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/a")));
            searchButton.Click();

            wait.Until(d => d.FindElement(
                By.XPath("//*[@id='gatsby-focus-wrapper']/main/h1/span")));

            // [TearDown] will stop the scan and save the report automatically
        }
    }
}
