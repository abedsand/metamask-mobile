// In appwright.config.ts
const dotenv = require('dotenv');
dotenv.config({ path: '.e2e.env' });
import { defineConfig, Platform } from 'appwright';
export default defineConfig({
  testDir: './tests',
  //reporter: [['./reporters/custom-reporter.js']],
  projects: [
    {
      name: 'android',
      use: {
        platform: Platform.ANDROID,
        device: {
          provider: 'emulator', // or 'local-device' or 'browserstack'
        },
        buildPath: './Users/curtisdavid/Downloads/app-qa-release.apk', // Path to your .apk file
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
        buildPath: 'Metamask-QA.ipa', // Path to your .app file
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
          name: 'iPhone 14 Pro Max', // this can changed
          osVersion: '16.0', // this can changed
        },
        buildPath: 'bs://ffbc9a9f506c5d0a94eaf2dfaf39f16d0aff948d', // Path to Browserstack url bs:// link
      },
    },
  ],
});
