import { Builder } from "selenium-webdriver";

(async () => {
  const driver = await new Builder()
    .usingServer("http://localhost:4444/wd/hub")
    .withCapabilities({
      browserName: "chrome",
      browserVersion: "latest",
      "selenoid:options": { enableVNC: true, enableVideo: false },
    })
    .build();

  try {
    await driver.get("https://example.com");
    console.log("Title:", await driver.getTitle());
  } finally {
    await driver.quit();
  }
})();
