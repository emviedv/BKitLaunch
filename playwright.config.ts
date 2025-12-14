import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/e2e',
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:9990',
    headless: true,
    trace: 'off',
    ignoreHTTPSErrors: true,
  },
  reporter: 'line',
  timeout: 30000,
});


