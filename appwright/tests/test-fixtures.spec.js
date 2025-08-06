import { test, expect } from 'appwright';

import { PerformanceTracker } from '../reporters/PerformanceTracker';
import { AddAccountModal } from '../components/AddAccountModal';
import { AccountListComponent } from '../components/AccountListComponent';
import FixtureBuilder from '../../e2e/framework/fixtures/FixtureBuilder';

import { LoginScreen } from '../screens/LoginView';
import TimerHelper from '../utils/TimersHelper';
import { WalletAccountScreen } from '../screens/WalletAccountScreen';
import { withFixtures } from '../../e2e/framework/fixtures/FixtureHelper';

test.only('Test Fixture', async ({ device }, testInfo) => {
  await withFixtures(
    'appwright', // Specifying the framework as a parameter
    {
      fixture: new FixtureBuilder()
        .withGanacheNetwork()
        .withChainPermission()
        .build(),
    },
    async () => {
      // await device.terminateApp('io.metamask.MetaMask-QA');
      // await device.activateApp('io.metamask.MetaMask-QA');

            // await device.activateApp('io.metamask.MetaMask');

      // await device.terminateApp('io.metamask.MetaMask');
      // await device.activateApp('io.metamask.MetaMask');

      const getStartedScreenTimer = new TimerHelper('loginTimer');
      getStartedScreenTimer.start();

      // const commonScreen = new CommonScreen(device);
      const loginScreen = new LoginScreen(device);
      await loginScreen.typePassword('123123123');
      await loginScreen.tapUnlockButton();

      const walletAccountScreen = new WalletAccountScreen(device);
      expect(
        await walletAccountScreen.isAccountNameLabelEqualTo('Account 1'),
      ).toBe(true);

      getStartedScreenTimer.stop();
    },
  );
});
