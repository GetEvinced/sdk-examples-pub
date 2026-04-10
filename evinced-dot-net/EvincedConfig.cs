using System;
using Evinced.SDK;

public static class EvincedConfig
{
    public static void Initialize()
    {
        string serviceId = Environment.GetEnvironmentVariable("EVINCED_SERVICE_ID");
        string authToken = Environment.GetEnvironmentVariable("EVINCED_WEB_OFFLINE_TOKEN");

        EvincedSDK.SetOfflineCredentials(serviceId, authToken);

        EvincedSDK.UploadToPlatform = true;
    }
}
