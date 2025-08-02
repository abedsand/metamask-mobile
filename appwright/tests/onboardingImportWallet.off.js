import { test, expect } from 'appwright';

import { PerformanceTracker } from '../reporters/PerformanceTracker';
import { AddAccountModal } from '../components/AddAccountModal';
import { AccountListComponent } from '../components/AccountListComponent';
import FixtureBuilder from '../../e2e/framework/fixtures/FixtureBuilder';
import {
  loadFixture,
  startFixtureServer,
  stopFixtureServer
} from '../../e2e/framework/fixtures/FixtureHelper';
import FixtureServer from '../../e2e/framework/fixtures/FixtureServer';
import { LoginScreen } from '../screens/LoginView';
import TimerHelper from "../utils/TimersHelper";

test.only('Test Fixture', async ({ device }, testInfo) => {
  const fixtureServer = new FixtureServer();

  const state = new FixtureBuilder()
    .withPopularNetworks()
    .withChainPermission()
    .build();

  await startFixtureServer(fixtureServer);
  await loadFixture(fixtureServer, { fixture: state });

  const getStartedScreenTimer = new TimerHelper('loginTimer');
  getStartedScreenTimer.start();

  // const commonScreen = new CommonScreen(device);
  const loginScreen = new LoginScreen(device);
  await loginScreen.typePassword('123123123');
  await loginScreen.tapUnlockButton();

  const walletAccountScreen = new WalletAccountScreen(device);
  expect(await walletAccountScreen.isAccountNameLabelEqualTo('Account 1')).toBe(
    true,
  );

  getStartedScreenTimer.stop();
  await stopFixtureServer(fixtureServer);
});
