using System;
using System.IO;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Evinced.SDK;

namespace EvincedCSharpTests
{
    [TestFixture]
    public class EvDemoInteractionTest
    {
        [Test]
        public void StartStopSimpleTestClass()
        {
            EvincedConfig.Initialize();

            ChromeDriver baseDriver = EvincedConfig.CreateDriver();
            IEvincedDriver driver = EvincedDriverFactory.Create(baseDriver);

            try
            {
                WebDriverWait wait = new WebDriverWait(baseDriver, TimeSpan.FromSeconds(10));

                driver.Navigate().GoToUrl("https://demo.evinced.com/");
                wait.Until(d => d.FindElement(By.CssSelector("main")));

                driver.EvStart();

                // Open the "What type" dropdown and select an option.
                // Only one dropdown is filled so the demo site does not auto-navigate.
                var selectDropdown = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p")));
                selectDropdown.Click();

                var treehouseOption = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]")));
                treehouseOption.Click();

                IReport report = driver.EvStop();

                // Save results
                string timestamp = DateTime.Now.ToString("yyyyMMdd-HHmmss");
                string baseFilename = $"evinced-demo-results-{timestamp}";
                EvincedSDK.EvSaveFile(baseFilename, report, FileFormat.JSON);
                EvincedSDK.EvSaveFile(baseFilename, report, FileFormat.HTML, driver);

                Console.WriteLine("Reports saved to: " + Directory.GetCurrentDirectory());
            }
            finally
            {
                // Use baseDriver.Quit() to avoid a double-stop: the IEvincedDriver proxy's
                // Quit() calls stopAnalysis() internally, which crashes after EvStop() already
                // closed the session.
                baseDriver.Quit();
            }
        }
    }
}
