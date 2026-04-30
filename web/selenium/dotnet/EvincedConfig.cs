using System;
using Evinced.SDK;

public static class EvincedConfig
{
    public static void Initialize()
    {
        string serviceId = Environment.GetEnvironmentVariable("EVINCED_SERVICE_ID");
        string apiKey = Environment.GetEnvironmentVariable("EVINCED_API_KEY");

        EvincedSDK.SetCredentials(serviceId, apiKey);

        // To upload results to the Evinced Platform, set UploadToPlatform to true:
        // EvincedSDK.UploadToPlatform = true;
    }
}
