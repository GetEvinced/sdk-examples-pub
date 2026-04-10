using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Evinced.SDK;

namespace EvincedCSharpTests
{
    [TestFixture]
    public class EvScreenshotTest
    {
        [Test]
        public void EvAnalyzeTest()
        {
            EvincedConfig.Initialize();

            ChromeDriver baseDriver = new ChromeDriver();
            IEvincedDriver driver = EvincedDriverFactory.Create(baseDriver);

            try
            {
                driver.Navigate().GoToUrl("https://demo.evinced.com/");

                Screenshot screenshot = ((ITakesScreenshot)baseDriver).GetScreenshot();
                string screenshotPath = $"screenshot-{DateTime.Now:yyyyMMdd-HHmmss}.png";

                screenshot.SaveAsFile(screenshotPath);

                Console.WriteLine($"Screenshot saved to {screenshotPath}");

                IReport result = driver.EvAnalyze();

                NUnit.Framework.Assert.That(result.GetIssues(), Has.Count.EqualTo(0));
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
