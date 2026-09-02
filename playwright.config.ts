import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
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
