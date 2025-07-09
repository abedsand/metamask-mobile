/* eslint-disable no-undef */

import { getGanachePort } from './utils';
import { merge } from 'lodash';
import { CustomNetworks, PopularNetworksList } from '../resources/networks.e2e';
import { CHAIN_IDS } from '@metamask/transaction-controller';
import { SolScope } from '@metamask/keyring-api';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
  setEthAccounts,
  setPermittedEthChainIds,
} from '@metamask/chain-agnostic-permission';
import {
  MULTIPLE_ACCOUNTS_ACCOUNTS_CONTROLLER,
  SNAPS_CONTROLLER_STATE,
  CORE_USER_STATE,
  POWER_USER_STATE,
  CASUAL_USER_STATE,
} from './constants';

export const DEFAULT_FIXTURE_ACCOUNT =
  '0x76cf1cdd1fcc252442b50d6e97207228aa4aefc3';

export const DEFAULT_FIXTURE_ACCOUNT_2 =
  '0xcdd74c6eb517f687aa2c786bc7484eb2f9bae1da';

export const DEFAULT_IMPORTED_FIXTURE_ACCOUNT =
  '0x43e1c289177ecfbe6ef34b5fb2b66ebce5a8e05b';

const DAPP_URL = 'localhost';

/**
 * FixtureBuilder class provides a fluent interface for building fixture data.
 */
class FixtureBuilder {
  /**
   * Create a new instance of FixtureBuilder.
   * @param {Object} options - Options for the fixture builder.
   * @param {boolean} options.onboarding - Flag indicating if onboarding fixture should be used.
   */
  constructor({ onboarding = false } = {}) {
    // Initialize the fixture based on the onboarding flag
    onboarding === true
      ? this.withOnboardingFixture()
      : this.withDefaultFixture();
  }

  /**
   * Set the asyncState property of the fixture.
   * @param {any} asyncState - The value to set for asyncState.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withAsyncState(asyncState) {
    this.fixture.asyncState = asyncState;
    return this;
  }

  /**
   * Set the state property of the fixture.
   * @param {any} state - The value to set for state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withState(state) {
    this.fixture.state = state;
    return this;
  }

  /**
   * Ensures that the Solana feature modal is suppressed by adding the appropriate flag to asyncState.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  ensureSolanaModalSuppressed() {
    if (!this.fixture.asyncState) {
      this.fixture.asyncState = {};
    }
    this.fixture.asyncState['@MetaMask:solanaFeatureModalShown'] = 'true';
    return this;
  }

  /**
   * Set the default fixture values.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withDefaultFixture() {
    this.fixture = {
      state: {
        legalNotices: {
          newPrivacyPolicyToastClickedOrClosed: true,
          newPrivacyPolicyToastShownDate: Date.now(),
        },
        collectibles: {
          favorites: {},
        },
        engine: {
          backgroundState: {
            AccountTrackerController: {
              accountsByChainId: {
                64: {
                  [DEFAULT_FIXTURE_ACCOUNT]: {
                    balance: '0x0',
                  },
                },
                1: {
                  [DEFAULT_FIXTURE_ACCOUNT]: {
                    balance: '0x0',
                  },
                },
              },
            },
            AddressBookController: {
              addressBook: {},
            },
            NftController: {
              allNftContracts: {},
              allNfts: {},
              ignoredNfts: [],
            },
            TokenListController: {
              tokensChainsCache: {
                '0x1': {
                  data: [
                    {
                      '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': {
                        address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
                        symbol: 'SNX',
                        decimals: 18,
                        name: 'Synthetix Network Token',
                        iconUrl:
                          'https://static.cx.metamask.io/api/v1/tokenIcons/1/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png',
                        type: 'erc20',
                        aggregators: [
                          'Aave',
                          'Bancor',
                          'CMC',
                          'Crypto.com',
                          'CoinGecko',
                          '1inch',
                          'PMM',
                          'Synthetix',
                          'Zerion',
                          'Lifi',
                        ],
                        occurrences: 10,
                        fees: {
                          '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f': 0,
                          '0xda4ef8520b1a57d7d63f1e249606d1a459698876': 0,
                        },
                      },
                    },
                  ],
                },
              },
              preventPollingOnNetworkRestart: false,
            },
            CurrencyRateController: {
              currentCurrency: 'usd',
              currencyRates: {
                ETH: {
                  conversionDate: 1684232383.997,
                  conversionRate: 1815.41,
                  usdConversionRate: 1815.41,
                },
              },
            },
            KeyringController: {
              vault:
                '{"cipher":"ynNI8tAH4fcpmXo8S88A/3T3Dd1w0LY5ftpL59gW0ObYxovgFhrtKpRe/WD7WU42KwGBNKVicB9W9at4ePgOJGS6IMWr//C3jh0vKQTabkDzDy1ZfSvztRxGpVjmrnU3fC5B0eq/MBMSrgu8Bww309pk5jghyRfzp9YsG0ONo1CXUm2brQo/eRve7i9aDbiGXiEK0ch0BO7AvZPGMhHtYRrrOro4QrDVHGUgAF5SA1LD4dv/2AB8ctHwn4YbUmICieqlhJhprx3CNOJ086g7vPQOr21T4IbvtTumFaTibfoD3GWHQo11CvE04z3cN3rRERriP7bww/tZOe8OAMFGWANkmOJHwPPwEo1NBr6w3GD2VObEmqNhXeNc6rrM23Vm1JU40Hl+lVKubnbT1vujdGLmOpDY0GdekscQQrETEQJfhKlXIT0wwyPoLwR+Ja+GjyOhBr0nfWVoVoVrcTUwAk5pStBMt+5OwDRpP29L1+BL9eMwDgKpjVXRTh4MGagKYmFc6eKDf6jV0Yt9pG+jevv5IuyhwX0TRtfQCGgRTtS7oxhDQPxGqu01rr+aI7vGMfRQpaKEEXEWVmMaqCmktyUV35evK9h/xv1Yif00XBll55ShxN8t2/PnATvZxFKQfjJe5f/monbwf8rpfXHuFoh8M9hzjbcS5eh/TPYZZu1KltpeHSIAh5C+4aFyZw0e1DeAg/wdRO3PhBrVztsHSyISHlRdfEyw7QF4Lemr++2MVR1dTxS2I5mUEHjh+hmp64euH1Vb/RUppXlmE8t1RYYXfcsF2DlRwPswP739E/EpVtY3Syf/zOTyHyrOJBldzw22sauIzt8Q5Fe5qA/hGRWiejjK31P/P5j7wEKY7vrOJB1LWNXHSuSjffx9Ai9E","iv":"d5dc0252424ac0c08ca49ef320d09569","salt":"feAPSGdL4R2MVj2urJFl4A==","lib":"original"}',
              keyrings: [
                {
                  accounts: [DEFAULT_FIXTURE_ACCOUNT],
                  index: 0,
                  type: 'HD Key Tree',
                },
              ],
            },
            NetworkController: {
              selectedNetworkClientId: 'mainnet',
              networksMetadata: {
                mainnet: {
                  status: 'available',
                  EIPS: {
                    1559: true,
                  },
                },
                networkId1: {
                  status: 'available',
                  EIPS: {
                    1559: true,
                  },
                },
              },
              networkConfigurationsByChainId: {
                '0x1': {
                  chainId: '0x1',
                  rpcEndpoints: [
                    {
                      networkClientId: 'mainnet',
                      url: 'https://mainnet.infura.io/v3/{infuraProjectId}',
                      type: 'infura',
                      name: 'Ethereum Network default RPC',
                    },
                  ],
                  defaultRpcEndpointIndex: 0,
                  blockExplorerUrls: ['https://etherscan.io'],
                  defaultBlockExplorerUrlIndex: 0,
                  name: 'Ethereum Main Network',
                  nativeCurrency: 'ETH',
                },
                '0x539': {
                  chainId: '0x539',
                  rpcEndpoints: [
                    {
                      networkClientId: 'networkId1',
                      url: `http://localhost:${getGanachePort()}`,
                      type: 'custom',
                      name: 'Local RPC',
                    },
                  ],
                  defaultRpcEndpointIndex: 0,
                  defaultBlockExplorerUrlIndex: 0,
                  blockExplorerUrls: ['https://test.io'],
                  name: 'Localhost',
                  nativeCurrency: 'ETH',
                },
                '0xaa36a7': {
                  blockExplorerUrls: [],
                  chainId: '0xaa36a7',
                  defaultRpcEndpointIndex: 0,
                  name: 'Sepolia',
                  nativeCurrency: 'SepoliaETH',
                  rpcEndpoints: [
                    {
                      networkClientId: 'sepolia',
                      type: 'infura',
                      url: 'https://sepolia.infura.io/v3/{infuraProjectId}',
                    },
                  ],
                },
                '0xe705': {
                  blockExplorerUrls: [],
                  chainId: '0xe705',
                  defaultRpcEndpointIndex: 0,
                  name: 'Linea Sepolia',
                  nativeCurrency: 'LineaETH',
                  rpcEndpoints: [
                    {
                      networkClientId: 'linea-sepolia',
                      type: 'infura',
                      url: 'https://linea-sepolia.infura.io/v3/{infuraProjectId}',
                    },
                  ],
                },
              },
            },
            PhishingController: {
              listState: {
                allowlist: [],
                fuzzylist: [
                  'cryptokitties.co',
                  'launchpad.ethereum.org',
                  'etherscan.io',
                  'makerfoundation.com',
                  'metamask.io',
                  'myetherwallet.com',
                  'opensea.io',
                  'satoshilabs.com',
                ],
                version: 2,
                name: 'MetaMask',
                tolerance: 1,
                lastUpdated: 1684231917,
              },
              whitelist: [],
              hotlistLastFetched: 1684231917,
              stalelistLastFetched: 1684231917,
            },
            AccountsController: {
              internalAccounts: {
                accounts: {
                  '4d7a5e0b-b261-4aed-8126-43972b0fa0a1': {
                    address: DEFAULT_FIXTURE_ACCOUNT,
                    id: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1',
                    metadata: {
                      name: 'Account 1',
                      importTime: 1684232000456,
                      keyring: {
                        type: 'HD Key Tree',
                      },
                    },
                    options: {},
                    methods: [
                      'personal_sign',
                      'eth_signTransaction',
                      'eth_signTypedData_v1',
                      'eth_signTypedData_v3',
                      'eth_signTypedData_v4',
                    ],
                    type: 'eip155:eoa',
                  },
                },
                selectedAccount: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1',
              },
            },
            PreferencesController: {
              featureFlags: {},
              identities: {
                [DEFAULT_FIXTURE_ACCOUNT]: {
                  address: DEFAULT_FIXTURE_ACCOUNT,
                  name: 'Account 1',
                  importTime: 1684232000456,
                },
              },
              ipfsGateway: 'https://dweb.link/ipfs/',
              lostIdentities: {},
              selectedAddress: DEFAULT_FIXTURE_ACCOUNT,
              useTokenDetection: true,
              useNftDetection: true,
              displayNftMedia: true,
              useSafeChainsListValidation: false,
              isMultiAccountBalancesEnabled: true,
              showTestNetworks: true,
            },
            TokenBalancesController: {
              tokenBalances: {},
            },
            TokenRatesController: {
              marketData: {},
            },
            TokensController: {
              allTokens: {},
              allIgnoredTokens: {},
              allDetectedTokens: {},
            },
            TransactionController: {
              methodData: {},
              transactions: [],
              swapsTransactions: {},
            },
            SwapsController: {
              quotes: {},
              quoteValues: {},
              fetchParams: {
                slippage: 0,
                sourceToken: '',
                sourceAmount: 0,
                destinationToken: '',
                walletAddress: '',
              },
              fetchParamsMetaData: {
                sourceTokenInfo: {
                  decimals: 0,
                  address: '',
                  symbol: '',
                },
                destinationTokenInfo: {
                  decimals: 0,
                  address: '',
                  symbol: '',
                },
              },
              topAggSavings: null,
              aggregatorMetadata: null,
              tokens: null,
              topAssets: null,
              approvalTransaction: null,
              aggregatorMetadataLastFetched: 0,
              quotesLastFetched: 0,
              error: {
                key: null,
                description: null,
              },
              topAggId: null,
              tokensLastFetched: 0,
              isInPolling: false,
              pollingCyclesLeft: 4,
              quoteRefreshSeconds: null,
              usedGasEstimate: null,
              usedCustomGas: null,
              chainCache: {
                '0x1': {
                  aggregatorMetadata: null,
                  tokens: null,
                  topAssets: null,
                  aggregatorMetadataLastFetched: 0,
                  topAssetsLastFetched: 0,
                  tokensLastFetched: 0,
                },
              },
            },
            GasFeeController: {
              gasFeeEstimates: {},
              estimatedGasFeeTimeBounds: {},
              gasEstimateType: 'none',
              gasFeeEstimatesByChainId: {},
              nonRPCGasFeeApisDisabled: false,
            },
            PermissionController: {
              subjects: {},
            },
            ApprovalController: {
              pendingApprovals: {},
              pendingApprovalCount: 0,
              approvalFlows: [],
            },
            UserStorageController: {},
            NotificationServicesController: {
              subscriptionAccountsSeen: [],
              isMetamaskNotificationsFeatureSeen: false,
              isNotificationServicesEnabled: false,
              isFeatureAnnouncementsEnabled: false,
              metamaskNotificationsList: [],
              metamaskNotificationsReadList: [],
              isUpdatingMetamaskNotifications: false,
              isFetchingMetamaskNotifications: false,
              isUpdatingMetamaskNotificationsAccount: [],
              isCheckingAccountsPresence: false,
            },
            MultichainNetworkController: {
              selectedMultichainNetworkChainId: SolScope.Mainnet,
              multichainNetworkConfigurationsByChainId: {
                [SolScope.Mainnet]: {
                  chainId: SolScope.Mainnet,
                  name: 'Solana Mainnet',
                  nativeCurrency: `${SolScope.Mainnet}/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
                  isEvm: false,
                },
              },
              isEvmSelected: true,
            },
            MultichainAssetsController: {
              accountsAssets: {},
              assetsMetadata: {},
            },
            MultichainAssetsRatesController: {
              conversionRates: {},
            },
            CronJobController: {
              jobs: {},
              events: {},
            },
            SnapController: {},
          },
        },
        privacy: {
          approvedHosts: {},
          revealSRPTimestamps: [],
        },
        bookmarks: [],
        browser: {
          history: [],
          whitelist: [],
          tabs: [
            {
              url: 'https://google.com',
              id: 1692550481062,
            },
          ],
          activeTab: 1692550481062,
        },
        modals: {
          networkModalVisible: false,
          shouldNetworkSwitchPopToWallet: true,
          collectibleContractModalVisible: false,
          receiveModalVisible: false,
          dappTransactionModalVisible: false,
          signMessageModalVisible: true,
        },
        settings: {
          searchEngine: 'Google',
          primaryCurrency: 'ETH',
          lockTime: 30000,
          useBlockieIcon: true,
          hideZeroBalanceTokens: false,
          basicFunctionalityEnabled: true,
        },
        alert: {
          isVisible: false,
          autodismiss: null,
          content: null,
          data: null,
        },
        transaction: {
          selectedAsset: {},
          transaction: {},
        },
        user: {
          loadingMsg: '',
          loadingSet: false,
          passwordSet: true,
          seedphraseBackedUp: true,
          backUpSeedphraseVisible: false,
          protectWalletModalVisible: false,
          gasEducationCarouselSeen: false,
          userLoggedIn: true,
          isAuthChecked: false,
          initialScreen: '',
          appTheme: 'os',
        },
        wizard: {
          step: 0,
        },
        onboarding: {
          events: [],
        },
        notification: {
          notifications: [],
        },
        swaps: {
          '0x1': {
            isLive: true,
          },
          isLive: true,
          hasOnboarded: false,
        },
        fiatOrders: {
          orders: [],
          customOrderIds: [],
          networks: [
            {
              active: true,
              chainId: 1,
              chainName: 'Ethereum Mainnet',
              shortName: 'Ethereum',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 10,
              chainName: 'Optimism Mainnet',
              shortName: 'Optimism',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 25,
              chainName: 'Cronos Mainnet',
              shortName: 'Cronos',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 56,
              chainName: 'BNB Chain Mainnet',
              shortName: 'BNB Chain',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 137,
              chainName: 'Polygon Mainnet',
              shortName: 'Polygon',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 250,
              chainName: 'Fantom Mainnet',
              shortName: 'Fantom',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1284,
              chainName: 'Moonbeam Mainnet',
              shortName: 'Moonbeam',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1285,
              chainName: 'Moonriver Mainnet',
              shortName: 'Moonriver',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 42161,
              chainName: 'Arbitrum Mainnet',
              shortName: 'Arbitrum',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 42220,
              chainName: 'Celo Mainnet',
              shortName: 'Celo',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 43114,
              chainName: 'Avalanche C-Chain Mainnet',
              shortName: 'Avalanche C-Chain',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 1313161554,
              chainName: 'Aurora Mainnet',
              shortName: 'Aurora',
              nativeTokenSupported: false,
            },
            {
              active: true,
              chainId: 1666600000,
              chainName: 'Harmony Mainnet (Shard 0)',
              shortName: 'Harmony  (Shard 0)',
              nativeTokenSupported: true,
            },
            {
              active: true,
              chainId: 11297108109,
              chainName: 'Palm Mainnet',
              shortName: 'Palm',
              nativeTokenSupported: false,
            },
            {
              active: true,
              chainId: 1337,
              chainName: 'Localhost',
              shortName: 'Localhost',
              nativeTokenSupported: true,
            },
            {
              chainId: 1,
              chainName: 'Tenderly',
              shortName: 'Tenderly',
              nativeTokenSupported: true,
            },
          ],
          selectedRegionAgg: null,
          selectedPaymentMethodAgg: null,
          getStartedAgg: false,
          getStartedSell: false,
          authenticationUrls: [],
          activationKeys: [],
        },
        infuraAvailability: {
          isBlocked: false,
        },
        navigation: {
          currentRoute: 'AdvancedSettings',
          currentBottomNavRoute: 'Wallet',
        },
        networkOnboarded: {
          networkOnboardedState: {},
          networkState: {
            showNetworkOnboarding: false,
            nativeToken: '',
            networkType: '',
            networkUrl: '',
          },
          switchedNetwork: {
            networkUrl: '',
            networkStatus: false,
          },
        },
        security: {
          allowLoginWithRememberMe: false,
          automaticSecurityChecksEnabled: false,
          hasUserSelectedAutomaticSecurityCheckOption: true,
          isAutomaticSecurityChecksModalOpen: false,
        },
        experimentalSettings: {
          securityAlertsEnabled: true,
        },
        inpageProvider: {
          networkId: '1',
        },
      },
      asyncState: {
        '@MetaMask:existingUser': 'true',
        '@MetaMask:onboardingWizard': 'explored',
        '@MetaMask:UserTermsAcceptedv1.0': 'true',
        '@MetaMask:WhatsNewAppVersionSeen': '7.24.3',
        '@MetaMask:solanaFeatureModalShown': 'true',
      },
    };
    return this;
  }

  /**
   * Merges provided data into the background state of the PermissionController.
   * @param {object} data - Data to merge into the PermissionController's state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withPermissionController(data) {
    merge(this.fixture.state.engine.backgroundState.PermissionController, data);
    return this;
  }

  /**
   * Merges provided data into the background state of the NetworkController.
   * @param {object} data - Data to merge into the NetworkController's state.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withNetworkController(data) {
    const networkController =
      this.fixture.state.engine.backgroundState.NetworkController;

    // Extract providerConfig data
    const { providerConfig } = data;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(networkController.networkConfigurationsByChainId).length + 1
    }`;

    // Define the network configuration
    const networkConfig = {
      chainId: providerConfig.chainId,
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: providerConfig.rpcUrl,
          type: providerConfig.type,
          name: providerConfig.nickname,
        },
      ],
      defaultRpcEndpointIndex: 0,
      blockExplorerUrls: [],
      name: providerConfig.nickname,
      nativeCurrency: providerConfig.ticker,
    };

    // Add the new network configuration to the object
    networkController.networkConfigurationsByChainId[providerConfig.chainId] =
      networkConfig;

    // Update selectedNetworkClientId to the new network client ID
    networkController.selectedNetworkClientId = newNetworkClientId;

    return this;
  }

  /**
   * Private helper method to create permission controller configuration
   * @private
   * @param {Object} additionalPermissions - Additional permissions to merge with permission
   * @returns {Object} Permission controller configuration object
   */
  createPermissionControllerConfig(additionalPermissions = {}) {
    const caip25CaveatValue = additionalPermissions?.[
      Caip25EndowmentPermissionName
    ]?.caveats?.find((caveat) => caveat.type === Caip25CaveatType)?.value ?? {
      optionalScopes: {
        'eip155:1': { accounts: [] },
      },
      requiredScopes: {},
      sessionProperties: {},
      isMultichainOrigin: false,
    };

    const basePermissions = {
      [Caip25EndowmentPermissionName]: {
        id: 'ZaqPEWxyhNCJYACFw93jE',
        parentCapability: Caip25EndowmentPermissionName,
        invoker: DAPP_URL,
        caveats: [
          {
            type: Caip25CaveatType,
            value: setEthAccounts(caip25CaveatValue, [DEFAULT_FIXTURE_ACCOUNT]),
          },
        ],
        date: 1664388714636,
      },
    };

    return {
      subjects: {
        [DAPP_URL]: {
          origin: DAPP_URL,
          permissions: basePermissions,
        },
      },
    };
  }

  /**
   * Connects the PermissionController to a test dapp with specific accounts permissions and origins.
   * @param {Object} additionalPermissions - Additional permissions to merge.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withPermissionControllerConnectedToTestDapp(additionalPermissions = {}) {
    this.withPermissionController(
      this.createPermissionControllerConfig(additionalPermissions),
    );

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withRampsSelectedRegion(region = null) {
    const defaultRegion = {
      currencies: ['/currencies/fiat/xcd'],
      emoji: '🇱🇨',
      id: '/regions/lc',
      name: 'Saint Lucia',
      support: { buy: true, sell: true, recurringBuy: true },
      unsupported: false,
      recommended: false,
      detected: false,
    };

    // Use the provided region or fallback to the default
    this.fixture.state.fiatOrders.selectedRegionAgg = region ?? defaultRegion;
    return this;
  }
  withRampsSelectedPaymentMethod() {
    const paymentType = '/payments/debit-credit-card';

    // Use the provided region or fallback to the default
    this.fixture.state.fiatOrders.selectedPaymentMethodAgg = paymentType;
    return this;
  }

  /**
   * Adds chain switching permission for specific chains.
   * @param {string[]} chainIds - Array of chain IDs to permit (defaults to ['0x1']), other nexts like linea mainnet 0xe708
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withChainPermission(chainIds = ['0x1']) {
    const optionalScopes = chainIds
      .map((id) => ({
        [`eip155:${parseInt(id)}`]: { accounts: [] },
      }))
      .reduce((acc, obj) => ({ ...acc, ...obj }));

    const defaultCaip25CaveatValue = {
      optionalScopes,
      requiredScopes: {},
      sessionProperties: {},
      isMultichainOrigin: false,
    };

    const chainPermission = {
      [Caip25EndowmentPermissionName]: {
        id: 'Lde5rzDG2bUF6HbXl4xxT',
        parentCapability: Caip25EndowmentPermissionName,
        invoker: 'localhost',
        caveats: [
          {
            type: Caip25CaveatType,
            value: setPermittedEthChainIds(defaultCaip25CaveatValue, chainIds),
          },
        ],
        date: 1732715918637,
      },
    };

    this.withPermissionController(
      this.createPermissionControllerConfig(chainPermission),
    );
    return this;
  }

  /**
   * Set the fixture to an empty object for onboarding.
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withOnboardingFixture() {
    this.fixture = {
      asyncState: {},
    };
    return this;
  }

  withGanacheNetwork() {
    const fixtures = this.fixture.state.engine.backgroundState;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(fixtures.NetworkController.networkConfigurationsByChainId)
        .length + 1
    }`;

    // Define the Ganache network configuration
    const ganacheNetworkConfig = {
      chainId: '0x539',
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: `http://localhost:${getGanachePort()}`,
          type: 'custom',
          name: 'Localhost',
        },
      ],
      defaultRpcEndpointIndex: 0,
      defaultBlockExplorerUrlIndex: 0,
      blockExplorerUrls: ['https://test.io'],
      name: 'Localhost',
      nativeCurrency: 'ETH',
    };

    // Add the new Ganache network configuration
    fixtures.NetworkController.networkConfigurationsByChainId['0x539'] =
      ganacheNetworkConfig;

    // Update selectedNetworkClientId to the new network client ID
    fixtures.NetworkController.selectedNetworkClientId = newNetworkClientId;

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withSepoliaNetwork() {
    const fixtures = this.fixture.state.engine.backgroundState;

    // Extract Sepolia network configuration from CustomNetworks
    const sepoliaConfig = CustomNetworks.Sepolia.providerConfig;

    // Generate a unique key for the new network client ID
    const newNetworkClientId = `networkClientId${
      Object.keys(fixtures.NetworkController.networkConfigurationsByChainId)
        .length + 1
    }`;

    // Define the Sepolia network configuration
    const sepoliaNetworkConfig = {
      chainId: sepoliaConfig.chainId,
      rpcEndpoints: [
        {
          networkClientId: newNetworkClientId,
          url: sepoliaConfig.rpcTarget,
          type: 'custom',
          name: sepoliaConfig.nickname,
        },
      ],
      defaultRpcEndpointIndex: 0,
      blockExplorerUrls: [],
      name: sepoliaConfig.nickname,
      nativeCurrency: sepoliaConfig.ticker,
    };

    // Add the new Sepolia network configuration
    fixtures.NetworkController.networkConfigurationsByChainId[
      sepoliaConfig.chainId
    ] = sepoliaNetworkConfig;

    // Update selectedNetworkClientId to the new network client ID
    fixtures.NetworkController.selectedNetworkClientId = newNetworkClientId;

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withImportedAccountKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
        },
        {
          type: 'Simple Key Pair',
          accounts: ['0xDDFFa077069E1d4d478c5967809f31294E24E674'],
        },
      ],
      vault:
        '{"cipher":"vxFqPMlClX2xjUidoCTiwazr43W59dKIBp6ihT2lX66q8qPTeBRwv7xgBaGDIwDfk4DpJ3r5FBety1kFpS9ni3HtcoNQsDN60Pa80L94gta0Fp4b1jVeP8EJ7Ho71mJ360aDFyIgxPBSCcHWs+l27L3WqF2VpEuaQonK1UTF7c3WQ4pyio4jMAH9x2WQtB11uzyOYiXWmiD3FMmWizqYZY4tHuRlzJZTWrgE7njJLaGMlMmw86+ZVkMf55jryaDtrBVAoqVzPsK0bvo1cSsonxpTa6B15A5N2ANyEjDAP1YVl17roouuVGVWZk0FgDpP82i0YqkSI9tMtOTwthi7/+muDPl7Oc7ppj9LU91JYH6uHGomU/pYj9ufrjWBfnEH/+ZDvPoXl00H1SmX8FWs9NvOg7DZDB6ULs4vAi2/5KGs7b+Td2PLmDf75NKqt03YS2XeRGbajZQ/jjmRt4AhnWgnwRzsSavzyjySWTWiAgn9Vp/kWpd70IgXWdCOakVf2TtKQ6cFQcAf4JzP+vqC0EzgkfbOPRetrovD8FHEFXQ+crNUJ7s41qRw2sketk7FtYUDCz/Junpy5YnYgkfcOTRBHAoOy6BfDFSncuY+08E6eiRHzXsXtbmVXenor15pfbEp/wtfV9/vZVN7ngMpkho3eGQjiTJbwIeA9apIZ+BtC5b7TXWLtGuxSZPhomVkKvNx/GNntjD7ieLHvzCWYmDt6BA9hdfOt1T3UKTN4yLWG0v+IsnngRnhB6G3BGjJHUvdR6Zp5SzZraRse8B3z5ixgVl2hBxOS8+Uvr6LlfImaUcZLMMzkRdKeowS/htAACLowVJe3pU544IJ2CGTsnjwk9y3b5bUJKO3jXukWjDYtrLNKfdNuQjg+kqvIHaCQW40t+vfXGhC5IDBWC5kuev4DJAIFEcvJfJgRrm8ua6LrzEfH0GuhjLwYb+pnQ/eg8dmcXwzzggJF7xK56kxgnA4qLtOqKV4NgjVR0QsCqOBKb3l5LQMlSktdfgp9hlW","iv":"b09c32a79ed33844285c0f1b1b4d1feb","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"GYNFQCSCigu8wNp8cS8C3w=="}',
    });
    return this;
  }

  withPopularNetworks() {
    const fixtures = this.fixture.state.engine.backgroundState;
    const networkConfigurationsByChainId = {
      ...fixtures.NetworkController.networkConfigurationsByChainId,
    }; // Object to store network configurations

    let firstNetworkClientId = null;

    // Loop through each network in PopularNetworksList
    for (const key in PopularNetworksList) {
      const network = PopularNetworksList[key];
      const {
        rpcUrl: rpcTarget,
        chainId,
        ticker,
        nickname,
      } = network.providerConfig;

      // Generate a unique key for the new network client ID
      const newNetworkClientId = `networkClientId${
        Object.keys(networkConfigurationsByChainId).length + 1
      }`;

      if (!firstNetworkClientId) {
        firstNetworkClientId = newNetworkClientId;
      }

      // Define the network configuration
      const networkConfig = {
        chainId,
        rpcEndpoints: [
          {
            networkClientId: newNetworkClientId,
            url: rpcTarget,
            type: 'custom',
            name: nickname,
          },
        ],
        defaultRpcEndpointIndex: 0,
        blockExplorerUrls: [],
        name: nickname,
        nativeCurrency: ticker,
      };

      // Add the new network configuration to the object
      networkConfigurationsByChainId[chainId] = networkConfig;
    }

    // Assign networkConfigurationsByChainId object to NetworkController in fixtures
    fixtures.NetworkController = {
      ...fixtures.NetworkController,
      networkConfigurationsByChainId,
    };

    // Set the selectedNetworkClientId to the first network added
    if (firstNetworkClientId) {
      fixtures.NetworkController.selectedNetworkClientId = firstNetworkClientId;
    }

    // Ensure Solana feature modal is suppressed
    return this.ensureSolanaModalSuppressed();
  }

  withPreferencesController(data) {
    merge(
      this.fixture.state.engine.backgroundState.PreferencesController,
      data,
    );
    return this;
  }

  withKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
          type: 'HD Key Tree',
        },
        { type: 'QR Hardware Wallet Device', accounts: [] },
      ],
      vault:
        '{"cipher":"T+MXWPPwXOh8RLxpryUuoFCObwXqNQdwak7FafAoVeXOehhpuuUDbjWiHkeVs9slsy/uzG8z+4Va+qyz4dlRnd/Gvc/2RbHTAb/LG1ECk1rvLZW23JPGkBBVAu36FNGCTtT+xrF4gRzXPfIBVAAgg40YuLJWkcfVty6vGcHr3R3/9gpsqs3etrF5tF4tHYWPEhzhhx6HN6Tr4ts3G9sqgyEhyxTLCboAYWp4lsq2iTEl1vQ6T/UyBRNhfDj8RyQMF6hwkJ0TIq2V+aAYkr5NJguBBSi0YKPFI/SGLrin9/+d66gcOSFhIH0GhUbez3Yf54852mMtvOH8Vj7JZc664ukOvEdJIpvCw1CbtA9TItyVApkjQypLtE+IdV3sT5sy+v0mK7Xc054p6+YGiV8kTiTG5CdlI4HkKvCOlP9axwXP0aRwc4ffsvp5fKbnAVMf9+otqmOmlA5nCKdx4FOefTkr/jjhMlTGV8qUAJ2c6Soi5X02fMcrhAfdUtFxtUqHovOh3KzOe25XhjxZ6KCuix8OZZiGtbNDu3xJezPc3vzkTFwF75ubYozLDvw8HzwI+D5Ifn0S3q4/hiequ6NGiR3Dd0BIhWODSvFzbaD7BKdbgXhbJ9+3FXFF9Xkp74msFp6o7nLsx02ywv/pmUNqQhwtVBfoYhcFwqZZQlOPKcH8otguhSvZ7dPgt7VtUuf8gR23eAV4ffVsYK0Hll+5n0nZztpLX4jyFZiV/kSaBp+D2NZM2dnQbsWULKOkjo/1EpNBIjlzjXRBg5Ui3GgT3JXUDx/2GmJXceacrbMcos3HC2yfxwUTXC+yda4IrBx/81eYb7sIjEVNxDuoBxNdRLKoxwmAJztxoQLF3gRexS45QKoFZZ0kuQ9MqLyY6HDK","iv":"3271713c2b35a7c246a2a9b263365c3d","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"l4e+sn/jdsaofDWIB/cuGQ=="}',
    });
    return this;
  }

  /**
   * Creates a fixture with multiple accounts in the vault.
   * Generates a configurable number of Ethereum addresses for testing.
   *
   * @param {number} numberOfAccounts - The number of accounts to generate (default: 20)
   * @returns {FixtureBuilder} - The FixtureBuilder instance for method chaining.
   */
  withMultipleAccounts(numberOfAccounts = 20) {
    // Generate multiple Ethereum addresses for testing
    const generateEthereumAddresses = (count) => {
      const addresses = [];
      for (let i = 0; i < count; i++) {
        // Generate a more realistic Ethereum address
        // Use a deterministic approach based on index for consistent testing
        const baseAddress = '0x7F987E62895a5B3C7d352D1476c776e3dEc7A415';
        // Increment the last two hex characters to create unique addresses
        const lastTwoChars = baseAddress.slice(-2);
        const lastTwoHex = parseInt(lastTwoChars, 16);
        const newLastTwoHex = (lastTwoHex + i) % 256;
        const newLastTwoChars = newLastTwoHex.toString(16).padStart(2, '0');
        const newAddress = baseAddress.slice(0, -2) + newLastTwoChars;
        addresses.push(newAddress);
      }
      return addresses;
    };

    const accounts = generateEthereumAddresses(numberOfAccounts);

    // Populate KeyringController with proper structure
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          accounts,
          type: 'HD Key Tree',
          metadata: {
            id: '01JX9NJ15HPNS6RRRYBCKDK33R',
            name: '',
          },
        },
        { type: 'QR Hardware Wallet Device', accounts: [] },
      ],
      vault:
        '{"cipher":"T+MXWPPwXOh8RLxpryUuoFCObwXqNQdwak7FafAoVeXOehhpuuUDbjWiHkeVs9slsy/uzG8z+4Va+qyz4dlRnd/Gvc/2RbHTAb/LG1ECk1rvLZW23JPGkBBVAu36FNGCTtT+xrF4gRzXPfIBVAAgg40YuLJWkcfVty6vGcHr3R3/9gpsqs3etrF5tF4tHYWPEhzhhx6HN6Tr4ts3G9sqgyEhyxTLCboAYWp4lsq2iTEl1vQ6T/UyBRNhfDj8RyQMF6hwkJ0TIq2V+aAYkr5NJguBBSi0YKPFI/SGLrin9/+d66gcOSFhIH0GhUbez3Yf54852mMtvOH8Vj7JZc664ukOvEdJIpvCw1CbtA9TItyVApkjQypLtE+IdV3sT5sy+v0mK7Xc054p6+YGiV8kTiTG5CdlI4HkKvCOlP9axwXP0aRwc4ffsvp5fKbnAVMf9+otqmOmlA5nCKdx4FOefTkr/jjhMlTGV8qUAJ2c6Soi5X02fMcrhAfdUtFxtUqHovOh3KzOe25XhjxZ6KCuix8OZZiGtbNDu3xJezPc3vzkTFwF75ubYozLDvw8HzwI+D5Ifn0S3q4/hiequ6NGiR3Dd0BIhWODSvFzbaD7BKdbgXhbJ9+3FXFF9Xkp74msFp6o7nLsx02ywv/pmUNqQhwtVBfoYhcFwqZZQlOPKcH8otguhSvZ7dPgt7VtUuf8gR23eAV4ffVsYK0Hll+5n0nZztpLX4jyFZiV/kSaBp+D2NZM2dnQbsWULKOkjo/1EpNBIjlzjXRBg5Ui3GgT3JXUDx/2GmJXceacrbMcos3HC2yfxwUTXC+yda4IrBx/81eYb7sIjEVNxDuoBxNdRLKoxwmAJztxoQLF3gRexS45QKoFZZ0kuQ9MqLyY6HDK","iv":"3271713c2b35a7c246a2a9b263365c3d","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"l4e+sn/jdsaofDWIB/cuGQ=="}',
    });

    // Update AccountsController with internal accounts
    const internalAccounts = {};
    accounts.forEach((address, index) => {
      const accountId = `account-${index + 1}-${address.slice(-8)}`;
      internalAccounts[accountId] = {
        address,
        id: accountId,
        metadata: {
          name: `Account ${index + 1}`,
          importTime: Date.now(),
          keyring: {
            type: 'HD Key Tree',
          },
          lastSelected: Date.now() - index * 1000, // Ensure proper ordering
        },
        methods: [
          'personal_sign',
          'eth_sign',
          'eth_signTransaction',
          'eth_signTypedData_v1',
          'eth_signTypedData_v3',
          'eth_signTypedData_v4',
        ],
        type: 'eip155:eoa',
        scopes: ['eip155:1'], // Mainnet scope
      };
    });

    merge(this.fixture.state.engine.backgroundState.AccountsController, {
      internalAccounts: {
        accounts: internalAccounts,
        selectedAccount: Object.keys(internalAccounts)[0], // Select the first account
      },
    });

    // Update PreferencesController with account identities
    const identities = {};
    accounts.forEach((address, index) => {
      identities[address] = {
        name: `Account ${index + 1}`,
        address,
        importTime: Date.now(),
        lastSelected: Date.now() - index * 1000, // Ensure proper ordering
      };
    });

    merge(this.fixture.state.engine.backgroundState.PreferencesController, {
      identities,
      selectedAddress: accounts[0], // Select the first account
    });

    // Update AccountTrackerController with account balances
    const accountsByChainId = {};
    accounts.forEach((address) => {
      if (!accountsByChainId[1]) {
        accountsByChainId[1] = {}; // Mainnet chain ID
      }
      if (!accountsByChainId[64]) {
        accountsByChainId[64] = {}; // BSC chain ID
      }
      accountsByChainId[1][address] = {
        balance: '0x0',
      };
      accountsByChainId[64][address] = {
        balance: '0x0',
      };
    });

    merge(this.fixture.state.engine.backgroundState.AccountTrackerController, {
      accountsByChainId,
    });

    return this;
  }

  withRealAccounts({
    hdAccounts = 1,
    simpleAccounts = 0,
    qrAccounts = 0,
  } = {}) {
    // Generate Ethereum addresses for different account types
    const generateEthereumAddresses = (count, startIndex = 0) => {
      const addresses = [];
      for (let i = 0; i < count; i++) {
        const baseAddress = '0x1234567890123456789012345678901234567890';
        // Increment the last two hex characters to create unique addresses
        const lastTwoChars = baseAddress.slice(-2);
        const lastTwoHex = parseInt(lastTwoChars, 16);
        const newLastTwoHex = (lastTwoHex + startIndex + i) % 256;
        const newLastTwoChars = newLastTwoHex.toString(16).padStart(2, '0');
        const newAddress = baseAddress.slice(0, -2) + newLastTwoChars;
        addresses.push(newAddress);
      }
      return addresses;
    };

    const hdAddresses = generateEthereumAddresses(hdAccounts, 0);
    const simpleAddresses = generateEthereumAddresses(
      simpleAccounts,
      hdAccounts,
    );
    const qrAddresses = generateEthereumAddresses(
      qrAccounts,
      hdAccounts + simpleAccounts,
    );

    // Build keyrings array
    const keyrings = [];

    // Add HD Key Tree keyring if there are HD accounts
    if (hdAccounts > 0) {
      keyrings.push({
        accounts: hdAddresses,
        type: 'HD Key Tree',
        metadata: {
          id: '01JX9NJ15HPNS6RRRYBCKDK33R',
          name: '',
        },
      });
    }

    // Add Simple Key Pair keyring if there are simple accounts
    if (simpleAccounts > 0) {
      keyrings.push({
        accounts: simpleAddresses,
        type: 'Simple Key Pair',
        metadata: {
          id: '01JX9NZWRAVQKES02TWSN8GD91',
          name: '',
        },
      });
    }

    // Add QR Hardware Wallet keyring if there are QR accounts
    if (qrAccounts > 0) {
      keyrings.push({
        accounts: qrAddresses,
        type: 'QR Hardware Wallet Device',
        metadata: {
          id: '01JXA9KQBWD60ZB6STX279GQMF',
          name: '',
        },
      });
    }

    // Populate KeyringController
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings,
      vault:
        '{"cipher":"T+MXWPPwXOh8RLxpryUuoFCObwXqNQdwak7FafAoVeXOehhpuuUDbjWiHkeVs9slsy/uzG8z+4Va+qyz4dlRnd/Gvc/2RbHTAb/LG1ECk1rvLZW23JPGkBBVAu36FNGCTtT+xrF4gRzXPfIBVAAgg40YuLJWkcfVty6vGcHr3R3/9gpsqs3etrF5tF4tHYWPEhzhhx6HN6Tr4ts3G9sqgyEhyxTLCboAYWp4lsq2iTEl1vQ6T/UyBRNhfDj8RyQMF6hwkJ0TIq2V+aAYkr5NJguBBSi0YKPFI/SGLrin9/+d66gcOSFhIH0GhUbez3Yf54852mMtvOH8Vj7JZc664ukOvEdJIpvCw1CbtA9TItyVApkjQypLtE+IdV3sT5sy+v0mK7Xc054p6+YGiV8kTiTG5CdlI4HkKvCOlP9axwXP0aRwc4ffsvp5fKbnAVMf9+otqmOmlA5nCKdx4FOefTkr/jjhMlTGV8qUAJ2c6Soi5X02fMcrhAfdUtFxtUqHovOh3KzOe25XhjxZ6KCuix8OZZiGtbNDu3xJezPc3vzkTFwF75ubYozLDvw8HzwI+D5Ifn0S3q4/hiequ6NGiR3Dd0BIhWODSvFzbaD7BKdbgXhbJ9+3FXFF9Xkp74msFp6o7nLsx02ywv/pmUNqQhwtVBfoYhcFwqZZQlOPKcH8otguhSvZ7dPgt7VtUuf8gR23eAV4ffVsYK0Hll+5n0nZztpLX4jyFZiV/kSaBp+D2NZM2dnQbsWULKOkjo/1EpNBIjlzjXRBg5Ui3GgT3JXUDx/2GmJXceacrbMcos3HC2yfxwUTXC+yda4IrBx/81eYb7sIjEVNxDuoBxNdRLKoxwmAJztxoQLF3gRexS45QKoFZZ0kuQ9MqLyY6HDK","iv":"3271713c2b35a7c246a2a9b263365c3d","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"l4e+sn/jdsaofDWIB/cuGQ=="}',
    });

    // Combine all addresses for AccountsController
    const allAddresses = [...hdAddresses, ...simpleAddresses, ...qrAddresses];

    // Update AccountsController with internal accounts
    const internalAccounts = {};
    allAddresses.forEach((address, index) => {
      const accountId = `account-${index + 1}-${address.slice(-8)}`;
      let keyringType = 'HD Key Tree';
      if (index >= hdAccounts && index < hdAccounts + simpleAccounts) {
        keyringType = 'Simple Key Pair';
      } else if (index >= hdAccounts + simpleAccounts) {
        keyringType = 'QR Hardware Wallet Device';
      }

      internalAccounts[accountId] = {
        address,
        id: accountId,
        metadata: {
          name: `Account ${index + 1}`,
          importTime: Date.now(),
          keyring: {
            type: keyringType,
          },
          lastSelected: Date.now() - index * 1000, // Ensure proper ordering
        },
        methods: [
          'personal_sign',
          'eth_sign',
          'eth_signTransaction',
          'eth_signTypedData_v1',
          'eth_signTypedData_v3',
          'eth_signTypedData_v4',
        ],
        type: 'eip155:eoa',
        scopes: ['eip155:1'], // Mainnet scope
      };
    });

    merge(this.fixture.state.engine.backgroundState.AccountsController, {
      internalAccounts: {
        accounts: internalAccounts,
        selectedAccount: Object.keys(internalAccounts)[0], // Select the first account
      },
    });

    // Update PreferencesController with account identities
    const identities = {};
    allAddresses.forEach((address, index) => {
      identities[address] = {
        name: `Account ${index + 1}`,
        address,
        importTime: Date.now(),
        lastSelected: Date.now() - index * 1000, // Ensure proper ordering
      };
    });

    merge(this.fixture.state.engine.backgroundState.PreferencesController, {
      identities,
      selectedAddress: allAddresses[0], // Select the first account
    });

    // Update AccountTrackerController with account balances
    const accountsByChainId = {};
    allAddresses.forEach((address) => {
      if (!accountsByChainId[1]) {
        accountsByChainId[1] = {}; // Mainnet chain ID
      }
      if (!accountsByChainId[64]) {
        accountsByChainId[64] = {}; // BSC chain ID
      }
      accountsByChainId[1][address] = {
        balance: '0x0',
      };
      accountsByChainId[64][address] = {
        balance: '0x0',
      };
    });

    merge(this.fixture.state.engine.backgroundState.AccountTrackerController, {
      accountsByChainId,
    });

    return this;
  }

  withImportedHdKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V4CZ5WSJXSS7END4FJQ9',
            name: '',
          },
        },
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_IMPORTED_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V9ACE7ZA3ZRZFPYFYCJ1',
            name: '',
          },
        },
      ],
      // TODO: update this
      vault:
        '{"cipher":"IpV+3goe8Vey0mmfHz6DT0NiLwcTbjeglBI+WckZ/HeW0JcyE6kK9rBaqiZ+I0adwWAysIf/OanwvpE5YkYw9xYEkVXDUBQ/0lmscFGatXl24hadMdD01MRkKH6qyjUUw6ZqqmFnIRFbSwwYtD1X8UaRDhX+k/vnzAD9ETFW2cUpji7n5VU5hJQYOaCDO6hUxzE55scp2k68bDm/26EJ5SVgcsDXP/BW/MKnsqGGLAIPtQbVYUVChQ9D150WJif3HLJS1p0SSdGluL85JBLEQqShbBRZ3SiAHtJilf3oQBJB/YcAM6j6Uo7Sf+gAhc7cOvMYQ+YrTc+0Solzfa2OkLemskd4IOIVj6vWY+w0TPLo1IYSR1mFE2JVXE064zhUO0PKXME1qENQTiQCAAIfeEBwfdbQfrv92Zo/nU4VFyzdC3Rf+WPmWjLMXkZYqb1PdwhcgY85EpdFcjZAtcye6VF2iBTO0nMmZIyUabI/3RFizUgKtTlNH/H4NOLTm2HwUHOwAe4pxBbtEIFyuqo050n7UAJftN14Lp+/0kmraguFvsf0sg+AWXK5Tk9Bmkqm74bCuvmDCw2l28/+VEXOiYvytr9105NstlOnG/MmIJoYx8NkIJr5jMSCRtX8byBGRT+lhNq70CjWZIub5USmHkRdx1AuBAipQCdTjisaS2QRPwcA7M4PFbE2ltil1TavcRGRo+xa5nKji04jsx9AotAKkCqUPTOFr/h+WazGtx5+LWTAGXPUe9YtUraBCABXdnNhq7t7dXR7ivaZLkl6oXhQN6u2wmGRRvg3D36gddFVgDcqNafk/y82e0uWAu3F9VrGynYd0t7txkmzup1J19kpBlv7YVWy17J2MT3/PkatNrqdo21qFlhnYAcYKBC52MMInaY8qwQWXLMPud+cDdSR7QDLefl2AQEvH+hyzh2DI6d3Wri17LjujvSRdcwjAitylxnz9k4H2IAgJLlXIh5W69C+JdsNzoHanuJd+Hk=","iv":"68e751a7883bd7119118ebd2b3d30a6f","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"pOiYCrlywkH4UDFq/IHIKg=="}',
    });
    return this;
  }

  withImportedHdKeyringAndTwoDefaultAccountsOneImportedHdAccountKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_FIXTURE_ACCOUNT, DEFAULT_FIXTURE_ACCOUNT_2],
          metadata: {
            id: '01JN61V4CZ5WSJXSS7END4FJQ9',
            name: '',
          },
        },
        {
          type: 'HD Key Tree',
          accounts: [DEFAULT_IMPORTED_FIXTURE_ACCOUNT],
          metadata: {
            id: '01JN61V9ACE7ZA3ZRZFPYFYCJ1',
            name: '',
          },
        },
      ],
      // TODO: update this
      vault:
        '{"cipher":"wWIegxm+og31XAr34sZAkaf+wsuIycthFqmLa2mA0zxD0HSJKp1uITa4dJ94uGN10RgaDHHRmqpLzMqx7l7W+LiG6KMkdaPiZUqDLq3zdQVecY+rwWt+G4DZbIrZC6jUMopKTdvSv0Lrzb3fRnsQ1sDJ4R99OY8Dvhloc4V+rgi43rLc4eT7DB7zLlK0GuUtxfZwStJVeq5lBlYsVNrsZF2kfBCZQxqZGxLlSk6qaIP8HNY/ptttB/ZdOBjYYPqZkr5J5oUhmiIQDqN+MqsjUrOEmfz9fP3HIi8IxCFGA94G1tvDClMHMqpzwYsBQpcA0k7NJiSc+UdB8dcilXQLXF33PvQKSbgVeXuNkgKgnWPGtsGxPTJ0gIxCBxsW0MmyYvyBsHO8BoocflrOaqkXvSwmXUja9aQwHdZAmayvxWXnIE4MRAD1nLnvXdMO+qY+nW3yCvw5R6DoNBtnQIk9cKCuj2UL0/fxhNDdfbK8rhTyPZMRqRH2dhhuji71V+OeQBPV1/R0srvSUggOfSmcxVNe+ok5SJdzJpCavXE4/JVwTPe1Jrr/uz4AC4R2ih7lDBPFZnNXy7uSRn0lZWbKZFoM6jkLO7oTn9UN1C+YcteyNqkDiYGNJ0zxjuMzU/r6aJGAlvKGCkvBph3ON9vfD2ARAwpSSIFckh4a6t37vmKzmpsW7tQE95uqJHe7h+KMraWxtqlCCWB6BsJkpbm0BqjBdg8zUH8pP0GA0un3KCJjUEfTOWw+Yn69IkJQzX1Jyr5Hepzt500Va7K7kDDlFG4KFUt5RO80GnT7jtRGPGjPx29pKK2Zp61dmP5BZu+0xnXMlSGozJv+dgRCsZuzqvzUu5/44jYpggHrApNk5hhw0crBeovV+EgHE2VVnGNdLwwSngJ00b/cUnCUsPW0FjR7IscaI96eslFAPkdZXr70zXPVzA/NiE05ADciMoZxD8Qv8dGGU+yQMnDo2wABv+YEroO3VOtJiKBPqIB0GC0=","iv":"1ccda0516bc876f905e08e76bad201b9","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"E9val7NN4h2AfX/pwUkd9aa2iNyn+LwIurZXIdxlG/o="}',
    });
    return this;
  }

  withUserProfileSnapUnencryptedState(userState) {
    merge(
      this.fixture.state.engine.backgroundState.SnapController,
      userState.SNAPS_CONTROLLER_STATE,
    );

    return this;
  }

  withUserProfileSnapPermissions(userState) {
    merge(
      this.fixture.state.engine.backgroundState.PermissionController,
      userState.PERMISSION_CONTROLLER_STATE,
    );
    return this;
  }

  // This method basically make sure the default account is an evm account and not solana
  withUserProfileKeyRing(userState) {
    merge(
      this.fixture.state.engine.backgroundState.KeyringController,
      userState.KEYRING_CONTROLLER_STATE,
    );

    // Add accounts controller with the first account selected
    const firstAccountAddress =
      userState.KEYRING_CONTROLLER_STATE.keyrings[0].accounts[0];
    const accountId = '4d7a5e0b-b261-4aed-8126-43972b0fa0a1';

    merge(this.fixture.state.engine.backgroundState.AccountsController, {
      internalAccounts: {
        accounts: {
          [accountId]: {
            address: firstAccountAddress,
            id: accountId,
            metadata: {
              name: 'Account 1',
              importTime: 1684232000456,
              keyring: {
                type: 'HD Key Tree',
              },
            },
            options: {},
            methods: [
              'personal_sign',
              'eth_signTransaction',
              'eth_signTypedData_v1',
              'eth_signTypedData_v3',
              'eth_signTypedData_v4',
            ],
            type: 'eip155:eoa',
            scopes: ['eip155:1'],
          },
        },
        selectedAccount: accountId,
      },
    });

    return this;
  }

  withSnapPermissions() {
    merge(this.fixture.state.engine.backgroundState.PermissionController, {
      subjects: {
        'npm:@metamask/message-signing-snap': {
          origin: 'npm:@metamask/message-signing-snap',
          permissions: {
            snap_getEntropy: {
              id: '4ZiGu5AY86BDYxhzzkAYK',
              parentCapability: 'snap_getEntropy',
              invoker: 'npm:@metamask/message-signing-snap',
              caveats: null,
              date: 1751473353645,
            },
            'endowment:rpc': {
              id: 'f4KZLHAusny9OkDCAVCqa',
              parentCapability: 'endowment:rpc',
              invoker: 'npm:@metamask/message-signing-snap',
              caveats: [
                {
                  type: 'rpcOrigin',
                  value: {
                    dapps: true,
                    snaps: true,
                  },
                },
              ],
              date: 1751473353646,
            },
          },
        },
        'https://portfolio.metamask.io': {
          origin: 'https://portfolio.metamask.io',
          permissions: {
            wallet_snap: {
              id: 'gv0_3nc0IZkl0wYU3ruZQ',
              parentCapability: 'wallet_snap',
              invoker: 'https://portfolio.metamask.io',
              caveats: [
                {
                  type: 'snapIds',
                  value: {
                    'npm:@metamask/message-signing-snap': {},
                    'npm:@metamask/solana-wallet-snap': {},
                  },
                },
              ],
              date: 1751473353650,
            },
          },
        },
        'https://portfolio-builds.metafi-dev.codefi.network': {
          origin: 'https://portfolio-builds.metafi-dev.codefi.network',
          permissions: {
            wallet_snap: {
              id: 'zwDEouLctYBlyyCu363u9',
              parentCapability: 'wallet_snap',
              invoker: 'https://portfolio-builds.metafi-dev.codefi.network',
              caveats: [
                {
                  type: 'snapIds',
                  value: {
                    'npm:@metamask/message-signing-snap': {},
                  },
                },
              ],
              date: 1751473353651,
            },
          },
        },
        'https://docs.metamask.io': {
          origin: 'https://docs.metamask.io',
          permissions: {
            wallet_snap: {
              id: '1IxIvP9AC4feW5dKUNZpv',
              parentCapability: 'wallet_snap',
              invoker: 'https://docs.metamask.io',
              caveats: [
                {
                  type: 'snapIds',
                  value: {
                    'npm:@metamask/message-signing-snap': {},
                  },
                },
              ],
              date: 1751473353652,
            },
          },
        },
        'https://developer.metamask.io': {
          origin: 'https://developer.metamask.io',
          permissions: {
            wallet_snap: {
              id: 'qqGP9vBgo4bJUzWqzK9Le',
              parentCapability: 'wallet_snap',
              invoker: 'https://developer.metamask.io',
              caveats: [
                {
                  type: 'snapIds',
                  value: {
                    'npm:@metamask/message-signing-snap': {},
                  },
                },
              ],
              date: 1751473353653,
            },
          },
        },
        'npm:@metamask/gator-permissions-snap': {
          origin: 'npm:@metamask/gator-permissions-snap',
          permissions: {
            wallet_snap: {
              id: 'gQmp7dPg0BEWzrHckgmBH',
              parentCapability: 'wallet_snap',
              invoker: 'npm:@metamask/gator-permissions-snap',
              caveats: [
                {
                  type: 'snapIds',
                  value: {
                    'npm:@metamask/message-signing-snap': {},
                  },
                },
              ],
              date: 1751473353653,
            },
          },
        },
        'npm:@metamask/solana-wallet-snap': {
          origin: 'npm:@metamask/solana-wallet-snap',
          permissions: {
            'endowment:rpc': {
              id: 'zbb1Hd2raCkRpybTytnhe',
              parentCapability: 'endowment:rpc',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'rpcOrigin',
                  value: {
                    dapps: true,
                    snaps: false,
                  },
                },
              ],
              date: 1751473353714,
            },
            'endowment:keyring': {
              id: 'GjvoLZ7uM0hBQEW10qrDH',
              parentCapability: 'endowment:keyring',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'keyringOrigin',
                  value: {
                    allowedOrigins: ['https://portfolio.metamask.io'],
                  },
                },
              ],
              date: 1751473353714,
            },
            snap_getBip32Entropy: {
              id: 'OAhfPijQMJC6dYebEs8zg',
              parentCapability: 'snap_getBip32Entropy',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'permittedDerivationPaths',
                  value: [
                    {
                      path: ['m', "44'", "501'"],
                      curve: 'ed25519',
                    },
                  ],
                },
              ],
              date: 1751473353714,
            },
            'endowment:network-access': {
              id: '6wTIQuOmTttI-PTF0s8YN',
              parentCapability: 'endowment:network-access',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: null,
              date: 1751473353715,
            },
            'endowment:cronjob': {
              id: 'jBrDsGDkYHAtFEWGTbo8q',
              parentCapability: 'endowment:cronjob',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'snapCronjob',
                  value: {
                    jobs: [
                      {
                        expression: '* * * * *',
                        request: {
                          method: 'refreshSend',
                          params: {},
                        },
                      },
                      {
                        expression: '* * * * *',
                        request: {
                          method: 'refreshConfirmationEstimation',
                          params: {},
                        },
                      },
                      {
                        expression: '*/2 * * * *',
                        request: {
                          method: 'scheduleRefreshAccounts',
                          params: {},
                        },
                      },
                    ],
                  },
                },
              ],
              date: 1751473353716,
            },
            'endowment:protocol': {
              id: 'z8CbR3ogtpYu9ezmXZ75y',
              parentCapability: 'endowment:protocol',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'protocolSnapScopes',
                  value: {
                    'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': {
                      methods: [
                        'getGenesisHash',
                        'getLatestBlockhash',
                        'getMinimumBalanceForRentExemption',
                      ],
                    },
                    'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': {
                      methods: [
                        'getGenesisHash',
                        'getLatestBlockhash',
                        'getMinimumBalanceForRentExemption',
                      ],
                    },
                  },
                },
              ],
              date: 1751473353718,
            },
            'endowment:assets': {
              id: 'x9K_-0OkqWvbtjRDum0WY',
              parentCapability: 'endowment:assets',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: [
                {
                  type: 'chainIds',
                  value: [
                    'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
                    'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
                  ],
                },
              ],
              date: 1751473353718,
            },
            snap_manageAccounts: {
              id: 'BsuPVu-Bym8ettmbknIna',
              parentCapability: 'snap_manageAccounts',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: null,
              date: 1751473353718,
            },
            snap_manageState: {
              id: '_PYVL55h9JrLLlff4TlOk',
              parentCapability: 'snap_manageState',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: null,
              date: 1751473353718,
            },
            snap_dialog: {
              id: 'aFrRFn3nDwyC8VlWhkR8q',
              parentCapability: 'snap_dialog',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: null,
              date: 1751473353718,
            },
            snap_getPreferences: {
              id: 'fqXkfMCvNdmy-qjqoElVZ',
              parentCapability: 'snap_getPreferences',
              invoker: 'npm:@metamask/solana-wallet-snap',
              caveats: null,
              date: 1751473353719,
            },
          },
        },
      },
    });

    return this;
  }

  withImportedHdKeyringAndTwoDefaultAccountsOneImportedHdAccountOneQrAccountOneSimpleKeyPairAccount() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          accounts: ['0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6'],
          metadata: { id: '01JXA9M05DGJ92SMSEPFG8VN17', name: '' },
          type: 'HD Key Tree',
        },
        {
          accounts: ['0x428f04e9ea21b31090d377f24501065cbb48512f'],
          metadata: { id: '01JXA9MYRXNW16JZSZJXD6F9SD', name: '' },
          type: 'QR Hardware Wallet Device',
        },
        {
          accounts: ['0x43e1c289177ecfbe6ef34b5fb2b66ebce5a8e05b'],
          metadata: { id: '01JXA9MYRXNW16JZSZJXD6F9SD', name: '' },
          type: 'HD Key Tree',
        },
        {
          accounts: ['0x84b4ebb7492e6deb8892b16b0ee425e39d3116a4'],
          metadata: { id: '01JXA9YPC99YPE39C063RYGVX1', name: '' },
          type: 'Simple Key Pair',
        },
      ],
      vault:
        '{"cipher":"LK8EKGnU5Fmhq2Sa8NgnPXolMBc03cEcujhTNAZpeHvoWwOi+VmLiQ54qQGzaAjE58oXcksRh/OPx7FC9vI/UShYevSruqC5JZHcRfLvrAhkG0tZmkrnUT9tJZY3RO+FeF2MVllGbqKNjag07uTyeh/xnYS27/Q7lcVzt8v2b+X1RhDC+gsGFIZTbgqXI9kkmvbASXF8nDrt8l9UiC60WwiXM3OCkRHEaG3ziPeWUvNZx73UssQkaXSjRWZM07O9eRPiOHuFzm3iU+1rTq+n7Oj9SeAx3pKXoyDLb+/pzLX/iCMvRvuE0sH8EOmP2wiggWUSB02CUKSVaUd01zssNOSgKVfvbGvnoOy+EZqY4t73TP74/A8FxQHrEtLTyl9iH5f4785Kid3qNEAn9Fyur+Jbik7zwGdE5hls9V6cYm7S2NuVFsWheVfAMYfqFkg+DNO+DVi8iHtZOBbRB2u3vu/wz/CcGchFplc2a5APeSmcCpzemUnHue1Jjb8VYhOEVZLK/Zr5RwsBJBKWTAQL7Gj0szu9tuetqzKPK5uaY0CQK5PA6ib/RFLDoj1ca85DYmMeTwsn6XdpPR1WnQxFzy/iYtN1ZaRm4+bLgijPmY9xK3rqci0X9ugT0q4PKL71thjRiPVsOcdUsqipbgPekW63ATj4OejS3BDbjJLG/dzaj5edmNfFljpA3wkDA9Ww8pQ3+gRHzckDw2s5uNO1whT81kqBh+bRlt70Lkv7qH5P7UPpssmxq+svsWru+HUqr6oQlsizbjUn70soXpAfp0rF9TzjcWIqgcZ51r78sdKXpCMzeX5Qj0xpFsUnlPi88kaLjFva/VPt4y9CKcbheSO/oqS2nocEB1T97bdL2fxFQAuJiNSglWQgJYzXFSSO91nxxRUOwzMCqwIT98COYOeiJInaXAo7e0LK2iP0tH9p12LTBFKsiGmJKJpBCoVrOFtHqYfwMJfBkKS2djYqfvuqw5zGzJdJ50R/9IT+28znHZhMrPkuM3HepuYtKu8BaLPLvhsMYOmYNj5Qvz0Z3MFfrGzNisJwh0eKiA4O2SSrwFcgDYZRfbKOad2NZpjXGIvxSGl2bXPgqMj/KpzS0V8r9NejlWhi6BGtRX9fEFZZJEqhXi2TF94GxZ47QBtlwWuNOJJdkxKlTKQHq30P/Anw0gnLv2t2hX8skeO6aY26xjlwote6j9lPbR2XPbYCvDuLubiZHJ0m6fHtxeTH5KzhUMd1TVQsNa0oZ0U+4bk0C2DfDz8N0MlGbQFSDn9AyqqZME+ZF0lUyz51r8AuOG10CMT1W8QccDKSCqKJwg9o4Q3TP+SYIeFezvzWieIEfHAp1YBYjtRIe3h9p9Zr/R5tXzE+lK28erzgFSfPY792cj0H3EKEsyFU36qavzipp3k0eZtG5D5BA0TPERYse23K4tvD9jwcdEkEZ74PRTCcjCtt7PZ4xwiyisIA9pImaCK9TJXNV1+gBhGDFdyWe+PVmt8BUl/3A5iMtyYlC8UZfoBhFfj1pUy4Hr0/XrMX+UeYEzg/+39UYyjbsZtaYikhGv2GlsM37lfWS3N87j+MswG/FTSoFgKRjzl3x4M133svc4z5baBWBCRpLiTDyjaTHGmNohbW9xa8IomxT+1sB1ZctG2yKutSJjyHm50z5lmHaWj1VpTPKzJb+3JZVG2JdUToCxkrwfrbw1eLTzLShdRnOMZr1tmt5Ul92GQ0iidOV8g8Aud4wWLdVQ5A1BdrxV4jjbCg/BsCirIE4voY7pRjfJCs5TCzbP7ZFwUnGl/0/KAVRcu8nRy+YrIuVyRne7m8YjopHVXvHboEIK8sUBxQNPlWmaFcE1xSxequ4oXiRdhwR67TcBmwQR9S+9qgmOo9vVr0snjP30JwEzuYnv6MwHMQoFO638HfafqKGIVBkV6BCd7GJWaCqkZHTeiGMOZjF4oUH20bdWU8Sqma8rviZ8zql492YIYalnqp1jEVA1JZ1XgU436ghchnRNxbfFeyZLoOrpzzov5GHNqKHizZ90T2Oenh5kLY2tNirnyjvJKsIQmUX33r7IPVyzt1mbziUF09IvpCnhjzltoBUSf/px0uuDKbfLGufVjfYQQvi0tKShuvv1UHQgae3hTVCDzhSY2vEEgRHxS2ehR3KgSEKGBP3Q9UmtZKA8xbJfdlZ4ou2YneKO/oinoPvmTCzuds81vig6B4MIiAdDb5EFVrQj/hp/oKlGYMMJViaziZhoKFlYzrfXfTW5aFsQZp7NXVRon2tGjBEkYleOhP+UloP5klREcstGJFnAfXygfewzjbKqCMnU7YI17GQojviRUT61ZWUroMXJaAnTt0fr/I86uZiS+XfIkY/RJN","iv":"4df215ad8ea053bc082a369a40267680","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"TWbGoRlf8VcWi4RXapCjOg44EaJ6xskBCbvgevIjiWc="}',
    });
    return this;
  }

  withKeyringControllerOfMultipleAccounts() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      keyrings: [
        {
          accounts: ['0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6'],
          metadata: { id: '01JYMQCWV547WJ1X7X8KA72BHB', name: null },
          type: 'HD Key Tree',
        },
        // {
        //   accounts: ['C8WwCAxqd7CsdF2nmQWaMqj8bc6b4RtTZEmaQCAusgkh'],
        //   metadata: { id: '01JYMQCXJR780W8479CHWADRMW', name: null },
        //   type: 'Snap Keyring',
        // },
        {
          accounts: [],
          metadata: { id: '01JYMQD2ZW9MH3QDV97J1T9H9A', name: null },
          type: 'QR Hardware Wallet Device',
        },
      ],
      vault:
        '{"cipher":"DUx7iAsJoxlE+MKGopEvRQBL50daKCxL5stSFkxjZl4ZA3DMv4tLxUs1yAr31VMwM9rDuTFDZmZmTLj/WVNnPUgu8PXioD+Qufj3NP6cFmU3oTN1mw+sneI+9CSVlPYnuTzBOWaCXhxHEqTe4jfjPRc0rEeiBAzvJvvnZh93BNoBO7aqr5LNEx32cIuNqefG4mBzNbKq8ytfWHRsKZOZRl9yROpPtUtCaiuk8tuSAtTbtEOT5Btbiha/gAEYT5JjLsMe2Gw96oqyqS8Oza4WagQSVCIJvT/kJDPuO+KZJiIV2VZXmpck+UF02xiw2qvrnm9gu/hZ20t19alx3nbKsF3Q/Kxrfxt02MS/5Z+XKgRDl6qrNmD2K7NkMphuiWI4TdKT8yEU7ZWucJ83XLdQwAhyG2T1ugoe5dwbN9QvY4Fcyw92kba3A3ILKlV3XLnDnel1ZG6V9GAa4SRRCs7z/+lTzfj/h1QpO24ETznMi+PqJF4gtp/RNtgu/aTHwAqj0zkenZYtSME44lYe5hgbJCZXdK5zUTC1czqXshkVotccoKBly9kyML/ajAfO9RIGhSjglrrRUsCco7yyUafz2jLZYuQvFFAuVVukgbAEdINimRlHbYGran1klp9YVaMDADrTB31IVnDCAuNMb5RVoiiS7J0iCuvJWLAVrV5sukHFMi9oA6XMRYCYE6v6jvHgOPXRhJfxV8k7U96Vgv6o7VXkaA9s10y/tuYUhnQpH8AuhOqtQthytlt1FeTF1c74G+Vt/fLfWd3B2p6Iyqrf+XMOT+e/4fAZc0jTsmMM9cfoYoVd8ofyAmRGhql19cAYUEAwvMNfu3QAiOLl00EicHdX8IK8EzoObwLHO+008erBUKbjRvJ1ePl9Dvx83BZkqb2wlP5GmXSQjy9JmUDrCS6TuquVVNHpVKA8EoBwORN68p3B1hnP29yC79Kq7hc8K94K/Xofm0T0wj+Tzspru2iFxA0aZhEAoe13CGy9hBq9QqT285XPGby7vvek9wifIgvwA1yBXjU6lQ5ObyYCKitp8NLXPb5U0UXEOho7mu0QE+GwhoI3uxjtcKyIWkZlPldYsh2eZfcP/mfNhuFsqqlRin+SWynNUY9HMyaDw3FvtPkDZ6VgYMymP3DnWbmiOUa82iKJ2uGKuVgzvKzOlP5pf/GyWSdBz9ZjPNWMTEW/WYPvTkfGDdDCbTWxAG7fKU9locF+D09CV9mboSAQGTbZSI2f7d48Uo+77rntE6ODcumD++qASMZrGHOapCRtv0a4fHbMa3dWDtx6GHLlbvViDbvCsec7ChOUBoL39sgZEyWrC5JiOgYuRUWnU7xkaZHtYha7yKEVLWg4UFtXnLliYQLQseDa/k2/SDbSqLrz9ACVHgKpS3vtY6mSdhNWyrBkWamwVPXinb1Wjni3OQUqN0R7TeQ/QmRRp20atkY5OoFUuYOkBWU4HgyJHg0wEiYOXkscktGS1vl6RvOHyoTPKiWPJFgtz46NOP5ynmlBqS2+srespbKPh2GEN5EGhbdFWGAXSUoecbvjzizxRQdzm8nLNWtx2eDHo54fv3IahvWQNvmDIL265Ezfo+ZEYhOeHTerWvuVBzg78ZeHpOd1ZwTZz/k5JVtW9BZDoJoO1DZ98Bliew7i2uaN0De2ZP10RMQzH5GL636aptqRiUw9mwbavkaI2xC8f2Y9J2jsgtZ8Gjp48lGjBMxWpG4xywu3J8aUi+rLEiOthEK1Ob6LjkUEBeKC8eFreM1LeB9adIuWpdre84RdWTfWvirzCpvyStNc6USpZtgMKTYGmbqgFtZouphiNEvW2zbUi82Qp5v9XqhXB/zGnJwHRFs+Qk/k20tTLnp1U1+5uIjm+uzbXkLix5KGHNwdDpsx4GrZs04HHN2aRcBHnPZokGajwtcv/1PDHW4VMLKb0bttZSYr1tiYYuFp/0p1EcsCJ1cUcQTdTm8xmjKJWune9L2L","iv":"9e427fa9c50d74903acc326dc5f57f32","keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","salt":"r6Ta3qV3uqZgiXbnJ6bmT5oJhqKpH3ojd2NUzmc2ZLU="}',
    });

    // Update AccountsController to only include Ethereum account (hide Solana account)
    this.fixture.state.engine.backgroundState.AccountsController = {
      internalAccounts: {
        accounts: {
          // Ethereum Account 1 only
          '4d7a5e0b-b261-4aed-8126-43972b0fa0a1': {
            address: '0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6',
            id: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1',
            metadata: {
              name: 'Account 1',
              importTime: 1684232000456,
              keyring: {
                type: 'HD Key Tree',
              },
            },
            options: {},
            methods: [
              'personal_sign',
              'eth_signTransaction',
              'eth_signTypedData_v1',
              'eth_signTypedData_v3',
              'eth_signTypedData_v4',
            ],
            type: 'eip155:eoa',
            scopes: ['eip155:1'],
          },
        },
        selectedAccount: '4d7a5e0b-b261-4aed-8126-43972b0fa0a1', // Default to Ethereum account
      },
    };
    // this.fixture.state.engine.backgroundState.PreferencesController.identities = {
    //   '0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6': {
    //     address: '0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6',
    //     name: 'Account 1',
    //     importTime: 1684232000456,
    //   },
    // };
    // this.fixture.state.engine.backgroundState.PreferencesController.selectedAddress = '0xbacec2e26c5c794de6e82a1a7e21b9c329fa8cf6';

    // Configure for Ethereum mainnet only
    this.fixture.state.engine.backgroundState.MultichainNetworkController = {
      selectedMultichainNetworkChainId: 'eip155:1', // Default to Ethereum mainnet
      multichainNetworkConfigurationsByChainId: {
        'eip155:1': {
          chainId: 'eip155:1',
          name: 'Ethereum Mainnet',
          nativeCurrency: 'ETH',
          isEvm: true,
        },
      },
      isEvmSelected: true, // Default to EVM mode
      networksWithTransactionActivity: {},
    };

    return this;
  }

  withProfileSyncingEnabled() {
    // Enable AuthenticationController - user must be signed in for profile syncing
    merge(this.fixture.state.engine.backgroundState.AuthenticationController, {
      isSignedIn: true,
    });

    // Enable UserStorageController with all profile syncing features
    merge(this.fixture.state.engine.backgroundState.UserStorageController, {
      isBackupAndSyncEnabled: true,
      isBackupAndSyncUpdateLoading: false,
      isAccountSyncingEnabled: true,
      isContactSyncingEnabled: true,
      hasAccountSyncingSyncedAtLeastOnce: true,
      isAccountSyncingReadyToBeDispatched: true,
      isAccountSyncingInProgress: false,
      isContactSyncingInProgress: false,
    });

    // Enable basic functionality in settings (required for profile syncing)
    merge(this.fixture.state.settings, {
      basicFunctionalityEnabled: true,
    });

    return this;
  }

  // Mirrors the vault contents from the extension fixture.
  withMultiSRPKeyringController() {
    merge(this.fixture.state.engine.backgroundState.KeyringController, {
      vault:
        '{"keyMetadata":{"algorithm":"PBKDF2","params":{"iterations":5000}},"lib":"original","cipher":"LOubqgWR4O7Hv/RcdHPZ0Xi0GmCPD6whWLbO/jtnv44cAbBDumnAKX1NK1vgDNORSPVlUTkjyZwaHaStzuTIoJDurCBJN4TtsNUe5qIoJgttZ4Yv4hHxlg04V4nq/DXqAQaXedILMXnhbqZ+DP+tMc7JBXcVi12GIOiqV+ycLj8xFcasS/cdxtU6Os3pItdEZS89Rp7U58YOJBRQ2dlhBg0tCo2JnCrRhQmPGcTBuQVpn7SdkDx5PPC2slz3TRCjaHXWGCMPmx6jCDqI2sJL9ljpFB0/Jvlp18/9PE/cZ53GxybdtQiJ9andNHlfPf5WK+qI+QgySR8CMSRDWaP3hfEGHF1H0oqO7y/v6/pkShitdx7i5bC8Wt++heUOT8qpHTo1gDgUmNuZJsF4sG0Y18Hw8vLu+LfkoZgundb+cFjPFD1teTEnl2mmkpBvQCciynsCHPnHgnhKNHj6KMLhlSXWEItuYL/FY7dRpttfXzWfVQt56dQLLEYEYmO/f7C1uzAv6jbHBHqg16QtX3hCEnX0qzi1h3DQ8J5v44ckkQ/UGVvy6bOUC83b8DMLNPiSoMJDSsMaDzMmQ4J4xHzoHdD7/wBcXcbtUwccMGRHXv3jFLtHjuV+HQo0//I9xnjjAxfxX9SgyBQE8WCvUOxgCdwF8W7aBKcFEsoksLAWIQFxerWc3OxdvKSzvinI/j/MvyFMvVP5pm/BLWNj639GpFmIJVMprxkDL4H45CsgUcMe1Kiim/PFvo0D449vO1XL31ZIl9TxRVLaIr2cE3a95MFbzru9stqNkXz0EHrhSltFyoANMCim1HFxK/1yRl5Tt4u9Vjjyvj6a4Wtzy7SyLHhx0PfrlARq2euwGQal46cZYYKuMsnwvQf3ba/uJF3hF3FyAl9fn28HKRurImsiKNDvT+kaoUMFYoX6i+qR0LHoA7OfeqXpsKYyMx8LnUq7zKP4ZVc8sysI95YYYwdzhq2xzHDQfOplYRFkQllxqtkoTxMPHz/J1W1kjBTpCI7M8n8qLv53ryNq4y+hQx0RQNtvGPE9OcQTDUpkCM5dv7p8Ja8uLTDehKeKzs315IRBVJN8mdGy18EK5sjDoileDQ==","iv":"e88d2415e223bb8cc67c74ce47de1a6b","salt":"BX+ED3hq9K3tDBdnobBphA=="}',
    });

    return this;
  }

  withTokens(tokens, chainId = CHAIN_IDS.MAINNET) {
    merge(this.fixture.state.engine.backgroundState.TokensController, {
      allTokens: {
        [chainId]: {
          [DEFAULT_FIXTURE_ACCOUNT]: tokens,
        },
      },
    });
    return this;
  }

  withTokensForAllPopularNetworks(tokens) {
    // Get all popular network chain IDs using proper constants
    const popularChainIds = [
      CHAIN_IDS.MAINNET, // Ethereum Mainnet
      CHAIN_IDS.POLYGON, // Polygon Mainnet
      CHAIN_IDS.BSC, // BNB Smart Chain
      CHAIN_IDS.OPTIMISM, // Optimism
      CHAIN_IDS.ARBITRUM, // Arbitrum One
      CHAIN_IDS.AVALANCHE, // Avalanche C-Chain
      CHAIN_IDS.BASE, // Base
      CHAIN_IDS.ZKSYNC_ERA, // zkSync Era
      CHAIN_IDS.SEI, // Sei Network
    ];

    const accountsData =
      MULTIPLE_ACCOUNTS_ACCOUNTS_CONTROLLER.internalAccounts.accounts;
    const allAccountAddresses = Object.values(accountsData).map(
      (account) => account.address,
    );

    // Create tokens object for all accounts
    const accountTokens = {};
    allAccountAddresses.forEach((address) => {
      accountTokens[address] = tokens;
    });

    const allTokens = {};

    // Add tokens to each popular network
    popularChainIds.forEach((chainId) => {
      allTokens[chainId] = accountTokens;
    });

    merge(this.fixture.state.engine.backgroundState.TokensController, {
      allTokens,
    });

    // we need to test this ...

    // Create token balances for TokenBalancesController
    // Structure: { [accountAddress]: { [chainId]: { [tokenAddress]: balance } } }
    const tokenBalances = {};

    allAccountAddresses.forEach((accountAddress, accountIndex) => {
      tokenBalances[accountAddress] = {};

      // Add balances for each popular network
      popularChainIds.forEach((chainId) => {
        tokenBalances[accountAddress][chainId] = {};

        tokens.forEach((token, tokenIndex) => {
          // Generate realistic but varied balances for testing
          // Using different multipliers to create variety across accounts and tokens
          const baseBalance = (accountIndex + 1) * (tokenIndex + 1) * 1000;
          const randomVariation = Math.floor(Math.random() * 5000);
          const finalBalance = baseBalance + randomVariation;

          // Convert to hex with proper padding for token decimals
          const balanceInWei = (
            finalBalance * Math.pow(10, token.decimals)
          ).toString(16);
          tokenBalances[accountAddress][chainId][
            token.address
          ] = `0x${balanceInWei}`;
        });
      });
    });

    merge(this.fixture.state.engine.backgroundState.TokenBalancesController, {
      tokenBalances,
    });

    return this;
  }

  withIncomingTransactionPreferences(incomingTransactionPreferences) {
    merge(this.fixture.state.engine.backgroundState.PreferencesController, {
      showIncomingTransactions: incomingTransactionPreferences,
    });
    return this;
  }

  withTransactions(transactions) {
    merge(this.fixture.state.engine.backgroundState.TransactionController, {
      transactions,
    });
    return this;
  }

  /**
   * Build and return the fixture object.
   * @returns {Object} - The built fixture object.
   */
  build() {
    return this.fixture;
  }
}

export default FixtureBuilder;
