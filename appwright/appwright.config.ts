// In appwright.config.ts
const dotenv = require('dotenv');
dotenv.config({ path: '.e2e.env' });
import { defineConfig, Platform } from 'appwright';
export default defineConfig({
  testDir: './tests',
  workers: 1, // Use only one worker
  //reporter: [['./reporters/custom-reporter.js']],
  projects: [
    {
      name: 'android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator', // or 'local-device' or 'browserstack'
        },
        buildPath: './appwright/metamask-main-e2e-2203-4.apk', // Path to your .apk file
        expectTimeout: 10000,
      },
    },
    {
      name: 'ios',
      use: {
        platform: Platform.IOS,
        device: {
          provider: 'emulator', // or 'local-device' or 'browserstack'
        },
        buildPath: './appwright/metamask-simulator-main-e2e.app', // Path to your .app file
      },
    },
    {
      name: 'browserstack-android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'browserstack',
          name: process.env.BROWSERSTACK_DEVICE || 'Samsung Galaxy S23 Ultra',
          osVersion: process.env.BROWSERSTACK_OS_VERSION || '13.0',
        },
        // buildPath: 'bs://1f15f8c932c7019f6bcd26d5f496c52dd45b12bd',
        buildPath: process.env.BROWSERSTACK_ANDROID_APP_URL, // Path to Browserstack url bs:// link
        // Path to Browserstack url bs:// link
      },
    },
    {
      name: 'browserstack-ios',
      use: {
        platform: Platform.IOS,
        device: {
          provider: 'browserstack',
          name: process.env.BROWSERSTACK_DEVICE || 'iPhone 16 Pro',
          osVersion: process.env.BROWSERSTACK_OS_VERSION || '18.0',
        },
      buildPath: process.env.BROWSERSTACK_IOS_APP_URL, // Path to Browserstack url bs:// link

        // buildPath: 'bs://44544a893ab789cd7bd8dd3a0d8e36973fc95119', // Path to your .app file
        // buildPath: 'bs://7a42bf53dcdf1e51761f4c14a541500656b910bb', // Path to Browserstack url bs:// link
      },
    },
  ],
});
