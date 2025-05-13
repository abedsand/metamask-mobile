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
