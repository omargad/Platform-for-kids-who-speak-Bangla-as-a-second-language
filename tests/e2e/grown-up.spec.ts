import { test, expect } from "@playwright/test";

// A unique email per run so repeated runs don't collide on the account table.
function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

test("visiting a guarded page redirects to grown-up sign in", async ({ page }) => {
  await page.goto("/family");
  await expect(page).toHaveURL(/\/grown-ups/);
  await expect(page.getByRole("tab", { name: /Sign in/ })).toBeVisible();
});

test("a grown-up can create an account and reach the dashboard", async ({ page }) => {
  await page.goto("/grown-ups");
  await page.getByRole("tab", { name: /Create account/ }).click();
  await page.getByLabel(/Your name/).fill("E2E Parent");
  await page.getByLabel("Email").fill(uniqueEmail());
  await page.getByLabel(/Password/).fill("e2e-strong-password");
  await page.getByRole("button", { name: /Create account/ }).click();

  // Sign-up shows the one-time recovery codes before continuing.
  await expect(page.getByText(/recovery codes|Save your recovery/i)).toBeVisible();
  await page.getByRole("button", { name: /saved them|continue/i }).click();

  await expect(page).toHaveURL(/\/family/);
  await expect(page.getByRole("heading", { name: /learner|account/i }).first()).toBeVisible();
});

test("health endpoint responds ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe("ok");
});
