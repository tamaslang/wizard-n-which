import { defineConfig, devices } from "@playwright/test";

const projects = [
  { name: "chromium", use: devices["Desktop Chrome"] },
  { name: "firefox", use: devices["Desktop Firefox"], testMatch: /render-compat/ },
];
if (!process.env.CI) projects.push({ name: "webkit", use: devices["Desktop Safari"], testMatch: /render-compat/ });

export default defineConfig({
  testDir: "tests",
  projects,
  webServer: {
    command: "python3 -m http.server 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
  use: { baseURL: "http://localhost:4173" },
});
