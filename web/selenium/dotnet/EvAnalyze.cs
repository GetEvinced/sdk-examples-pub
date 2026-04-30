using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Evinced.SDK;

namespace EvincedCSharpTests
{
    [TestFixture]
    public class EvAnalyzeTest
    {
        [Test]
        public void EvAnalyzeEx()
        {
            EvincedConfig.Initialize();

            // Initialize Evinced WebDriver which wraps a ChromeDriver instance
            IEvincedDriver driver = EvincedDriverFactory.Create(EvincedConfig.CreateDriver());

            try
            {
                // Navigate to the site under test
                driver.Navigate().GoToUrl("https://demo.evinced.com/");

                // Run analysis and get the accessibility report
                IReport result = driver.EvAnalyze();

                // Assert that accessibility issues were found
                NUnit.Framework.Assert.That(result.GetIssues(), Has.Count.GreaterThan(0));
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
