import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import os from "node:os";

const PORT = 3210;
const stateDir = path.join(os.tmpdir(), `bangla-e2e-${process.pid}`);

/**
 * E2E config: builds and starts the real production server against a throwaway
 * database, then drives it in headless Chromium. Uses the pre-installed
 * browser (PLAYWRIGHT_BROWSERS_PATH) — never downloads.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Use the environment's pre-installed Chromium rather than the build
        // Playwright would otherwise download (blocked here, and versions differ).
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -H 127.0.0.1 -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      DATABASE_PATH: path.join(stateDir, "e2e.db"),
      MEDIA_ROOT: path.join(stateDir, "media"),
      NODE_ENV: "production",
    },
  },
});
