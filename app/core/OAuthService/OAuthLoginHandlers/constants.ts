import { getBundleId } from 'react-native-device-info';
import { ACTIONS, PROTOCOLS } from '../../../constants/deeplinks';
import AppConstants from '../../AppConstants';

export const AppRedirectUri = `${PROTOCOLS.HTTPS}://${AppConstants.MM_UNIVERSAL_LINK_HOST}/${ACTIONS.OAUTH_REDIRECT}`;

export const web3AuthNetwork = 'sapphire_devnet';
export const AuthServerUrl = 'https://api-develop-torus-byoa.web3auth.io';

export const IosGID =
  '882363291751-nbbp9n0o307cfil1lup766g1s99k0932.apps.googleusercontent.com';
export const IosGoogleRedirectUri =
  'com.googleusercontent.apps.882363291751-nbbp9n0o307cfil1lup766g1s99k0932:/oauth2redirect/google';
export const IosAppleClientId = getBundleId();

export const AndroidGoogleWebGID =
  '882363291751-2a37cchrq9oc1lfj1p419otvahnbhguv.apps.googleusercontent.com';
export const AppleWebClientId = 'com.web3auth.appleloginextension';

export const AuthConnectionId = 'byoa-server';
export const GroupedAuthConnectionId = 'mm-seedless-onboarding';

export const AppleServerRedirectUri = `${AuthServerUrl}/api/v1/oauth/callback`;

// if (
//   !AppConstants.SEEDLESS_ONBOARDING.WEB3AUTH_NETWORK ||
//   !AppConstants.SEEDLESS_ONBOARDING.AUTH_SERVER_URL ||
//   !AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_CLIENT_ID ||
//   !AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_REDIRECT_URI ||
//   !AppConstants.SEEDLESS_ONBOARDING.IOS_APPLE_CLIENT_ID ||
//   !AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_GOOGLE_CLIENT_ID ||
//   !AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_APPLE_CLIENT_ID ||
//   !AppConstants.SEEDLESS_ONBOARDING.AUTH_CONNECTION_ID ||
//   !AppConstants.SEEDLESS_ONBOARDING.GROUPED_AUTH_CONNECTION_ID
// ) {
//   throw new Error(
//     `Missing environment variables for OAuthLoginHandlers\n
//     WEB3AUTH_NETWORK: ${AppConstants.SEEDLESS_ONBOARDING.WEB3AUTH_NETWORK}\n
//     AUTH_SERVER_URL: ${AppConstants.SEEDLESS_ONBOARDING.AUTH_SERVER_URL}\n
//     IOS_GOOGLE_CLIENT_ID: ${AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_CLIENT_ID}\n
//     IOS_GOOGLE_REDIRECT_URI: ${AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_REDIRECT_URI}\n
//     IOS_APPLE_CLIENT_ID: ${AppConstants.SEEDLESS_ONBOARDING.IOS_APPLE_CLIENT_ID}\n
//     ANDROID_WEB_GOOGLE_CLIENT_ID: ${AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_GOOGLE_CLIENT_ID}\n
//     ANDROID_WEB_APPLE_CLIENT_ID: ${AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_APPLE_CLIENT_ID}\n`,
//   );
// }

// export const web3AuthNetwork =
//   AppConstants.SEEDLESS_ONBOARDING.WEB3AUTH_NETWORK;
// export const AuthServerUrl = AppConstants.SEEDLESS_ONBOARDING.AUTH_SERVER_URL;

// export const IosGID = AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_CLIENT_ID;
// export const IosGoogleRedirectUri =
//   AppConstants.SEEDLESS_ONBOARDING.IOS_GOOGLE_REDIRECT_URI;
// export const IosAppleClientId =
//   AppConstants.SEEDLESS_ONBOARDING.IOS_APPLE_CLIENT_ID;

// export const AndroidGoogleWebGID =
//   AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_GOOGLE_CLIENT_ID;
// export const AppleWebClientId =
//   AppConstants.SEEDLESS_ONBOARDING.ANDROID_WEB_APPLE_CLIENT_ID;

// export const AuthConnectionId =
//   AppConstants.SEEDLESS_ONBOARDING.AUTH_CONNECTION_ID;
// export const GroupedAuthConnectionId =
//   AppConstants.SEEDLESS_ONBOARDING.GROUPED_AUTH_CONNECTION_ID;

// export const AppleServerRedirectUri = `${AuthServerUrl}/api/v1/oauth/callback`;
