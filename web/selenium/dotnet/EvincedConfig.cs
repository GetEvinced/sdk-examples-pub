using System;
using Evinced.SDK;
using OpenQA.Selenium.Chrome;

public static class EvincedConfig
{
    public static void Initialize()
    {
        string serviceId = Environment.GetEnvironmentVariable("EVINCED_SERVICE_ID");
        string authToken = Environment.GetEnvironmentVariable("EVINCED_WEB_OFFLINE_TOKEN");

        EvincedSDK.SetOfflineCredentials(serviceId, authToken);

        // To upload results to the Evinced Platform, set UploadToPlatform to true:
        // EvincedSDK.UploadToPlatform = true;
    }

    public static ChromeDriver CreateDriver()
    {
        var options = new ChromeOptions();
        options.AddArgument("--headless=new");
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-dev-shm-usage");
        return new ChromeDriver(options);
    }
}
