import { chromium } from "@playwright/test";
const OUT = process.argv[2];
const BASE = "http://127.0.0.1:3220";

// teacher account via API
const signUp = await fetch(`${BASE}/api/auth/sign-up`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "demo@teacher.com", displayName: "Ms Rahman", password: "sunny-river-42" }),
});
const setCookie = signUp.headers.getSetCookie().find(c => c.startsWith("ba_adult_session="));
const token = setCookie.split(";")[0].split("=")[1];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addCookies([{ name: "ba_adult_session", value: token, url: BASE }]);
const page = await ctx.newPage();

// teacher: create class
await page.goto(`${BASE}/teach`, { waitUntil: "networkidle" });
await page.getByPlaceholder(/Sunday Level 2/).fill("Sunday Level 2");
await page.getByRole("button", { name: "Create class" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/teach-home.png`, fullPage: true });

// open class, post announcement, create activity
await page.locator(".teach-class-card").first().click();
await page.waitForTimeout(500);
const joinCode = await page.locator(".teach-code-big").innerText();
await page.getByPlaceholder(/This term's theme/).fill("Read the Pohela Boishakh topic before Sunday!");
await page.getByRole("button", { name: "Post" }).click();
await page.waitForTimeout(400);
await page.getByPlaceholder(/Activity title/).fill("Festivals check-in");
await page.getByPlaceholder("The question prompt").fill("Which month starts the Bengali year?");
const opts = page.locator(".teach-option-row input[type=text], .teach-option-row input:not([type=radio])");
await opts.nth(0).fill("Boishakh");
await opts.nth(1).fill("Poush");
await page.locator(".teach-option-row input[type=radio]").first().check();
await page.getByRole("button", { name: "Publish to the class" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/teach-class.png`, fullPage: true });

// student: join in a fresh context
const studentCtx = await browser.newContext({ viewport: { width: 900, height: 900 } });
const student = await studentCtx.newPage();
await student.goto(`${BASE}/classroom`, { waitUntil: "networkidle" });
await student.screenshot({ path: `${OUT}/classroom-join.png`, fullPage: true });
await student.getByPlaceholder("ABC234").fill(joinCode.trim());
await student.getByPlaceholder(/Maya/).fill("Maya");
await student.getByRole("button", { name: /Join my class/ }).click();
await student.waitForTimeout(700);
await student.screenshot({ path: `${OUT}/classroom-feed.png`, fullPage: true });
await student.locator(".topic-card").first().click();
await student.waitForTimeout(400);
await student.locator(".topic-option").first().click();
await student.getByRole("button", { name: /Send to my teacher/ }).click();
await student.waitForTimeout(600);
await student.screenshot({ path: `${OUT}/classroom-result.png`, fullPage: true });

// teacher sees submission
await page.getByRole("button", { name: /1 submissions/ }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/teach-submissions.png`, fullPage: true });

// poems
await student.goto(`${BASE}/poems`, { waitUntil: "networkidle" });
await student.screenshot({ path: `${OUT}/poems.png`, fullPage: true });

console.log("done, code was", joinCode);
await browser.close();
