import { test, expect } from "@playwright/test";

test("deve abrir a página inicial", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/MetricsFlow/i);
});
