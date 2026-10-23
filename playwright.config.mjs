import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./test/browser",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4178",
    headless: true,
    launchOptions: process.env.CHROME_BIN
      ? { executablePath: process.env.CHROME_BIN }
      : {},
  },
  webServer: {
    command: "npm run dev -- --port 4178 --strictPort",
    url: "http://127.0.0.1:4178",
    reuseExistingServer: false,
  },
});
