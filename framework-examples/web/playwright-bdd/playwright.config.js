import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const bddConfig = defineBddConfig({
  features: ["tests/features/**/*.feature"],
  steps: ["tests/steps/**/*.js"],
  output: ".features-gen",
});

export default defineConfig({
  testDir: bddConfig,
  globalSetup: require.resolve("./global.settings.js"),
  reporter: "html",
});
