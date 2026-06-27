import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30000,
  reporter: "html",
  use: {
    baseURL: process.env.WEB_URL || "http://localhost:3000",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
