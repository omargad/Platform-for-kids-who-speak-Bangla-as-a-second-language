import { test, expect } from "@playwright/test";

test("learner home loads with the hero call to action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Start|শুরু/ }).first()).toBeVisible();
});

test("the learn hub lists the activity cards and they navigate", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /Bornomala|alphabet/i }).first().click();
  await expect(page).toHaveURL(/\/alphabet/);
  await expect(page.getByText("স্বরবর্ণ").first()).toBeVisible();
});

test("alphabet shows vowels, consonants and conjuncts", async ({ page }) => {
  await page.goto("/alphabet");
  await expect(page.getByRole("heading", { name: /যুক্তবর্ণ/ })).toBeVisible();
  await expect(page.getByText("অজগর").first()).toBeVisible();
});

test("the counting game reveals the answer after a pick", async ({ page }) => {
  await page.goto("/numbers");
  const options = page.locator(".counting-option");
  await expect(options.first()).toBeVisible();
  await options.first().click();
  await expect(page.locator(".counting-result")).toBeVisible();
});

test("a story can be opened and paged to its question", async ({ page }) => {
  await page.goto("/stories");
  await page.locator(".story-card").first().click();
  await expect(page.locator(".story-page")).toBeVisible();
  // Page through to the comprehension question.
  for (let i = 0; i < 5; i += 1) {
    const next = page.getByRole("button", { name: /Next page|Question time|পরের পাতা|প্রশ্নের পালা/ });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    } else {
      break;
    }
  }
  await expect(page.locator(".counting-question")).toBeVisible();
});

test("language toggle switches an activity page to Bangla", async ({ page }) => {
  await page.goto("/phrasebook");
  await page.getByRole("button", { name: "বাংলায় দেখুন" }).click();
  await expect(page.getByRole("button", { name: "View in English" })).toBeVisible();
});

test("topic prototypes disclose their draft review status", async ({ page }) => {
  await page.goto("/topics");
  await expect(page.getByText(/Candidate content — review mode/i)).toBeVisible();
  await page.getByRole("button", { name: /Ekushey — the day a language was defended/i }).click();
  await expect(page.getByText(/Draft for educator review/i)).toBeVisible();
  await expect(page.getByText(/candidate NCTB evidence anchors/i)).toBeVisible();
});
