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

            ChromeDriver baseDriver = new ChromeDriver();
            IEvincedDriver driver = EvincedDriverFactory.Create(baseDriver);

            try
            {
                WebDriverWait wait = new WebDriverWait(baseDriver, TimeSpan.FromSeconds(10));

                driver.Navigate().GoToUrl("https://demo.evinced.com/");

                wait.Until(d => d.FindElement(By.CssSelector("main")));

                driver.EvStart();

                var selectDropdown = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p")));
                selectDropdown.Click();

                var treehouseOption = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]")));
                treehouseOption.Click();

                var whereDropdown = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/div[1]/p")));
                whereDropdown.Click();

                var eastCoastOption = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/ul/li[3]")));
                eastCoastOption.Click();

                var searchButton = wait.Until(d => d.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/a")));
                searchButton.Click();

                System.Threading.Thread.Sleep(TimeSpan.FromSeconds(3));
                WebDriverWait shortWait = new WebDriverWait(baseDriver, TimeSpan.FromSeconds(5));
                wait.Until(drv => drv.FindElement(By.XPath("//*[@id='gatsby-focus-wrapper']/main/h1/span")));

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
                driver.Quit();
            }
        }
    }
}
