import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

export const API_URL = process.env.API_URL ?? "http://localhost:8080";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  outputDir: "test-results",
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: process.env.FRONTEND_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
