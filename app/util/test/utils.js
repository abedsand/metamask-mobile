export const flushPromises = () => new Promise(setImmediate);

export const FIXTURE_SERVER_PORT = 12345;

// E2E test configuration required in app
export const testConfig = {};

// SEGMENT TRACK URL for E2E tests - this is not a real URL and is used for testing purposes only
export const E2E_METAMETRICS_TRACK_URL = 'https://metametrics.test/track';

/**
 * TODO: Update this condition once we change E2E builds to use release instead of debug
 */
export const isTest = process.env.METAMASK_ENVIRONMENT !== 'production' && process.env.METAMASK_ENVIRONMENT !== 'pre-release' && process.env.METAMASK_ENVIRONMENT !== 'beta' && process.env.METAMASK_ENVIRONMENT !== 'rc';
export const isE2E = process.env.IS_TEST === 'true';
export const enableApiCallLogs = process.env.LOG_API_CALLS === 'true';
export const getFixturesServerPortInApp = () =>
  testConfig.fixtureServerPort ?? FIXTURE_SERVER_PORT;

/**
 * Utility function to disable animations in E2E environments
 */
export const getAnimationProps = (autoPlay = true, loop = true) => {
  if (isE2E) {
    return {
      autoPlay: false,
      loop: false,
      speed: 0, // Set speed to 0 to effectively disable animation
    };
  }
  return {
    autoPlay,
    loop,
  };
};

/**
 * Utility function specifically for LottieView components
 * @param {Object} props - Additional props to merge
 * @param {boolean} isEditing - Whether the user is currently editing (e.g., typing in password field)
 */
export const getLottieProps = (props = {}, isEditing = false) => {
  // Disable animations in E2E builds
  if (isE2E) {
    return {
      ...props,
      autoPlay: false,
      loop: false,
      speed: 0, // Set speed to 0 to effectively disable animation
    };
  }
  
  // Disable animations in test environments when user is editing
  if (isTest && isEditing) {
    return {
      ...props,
      autoPlay: false,
      loop: false,
      speed: 0, // Set speed to 0 to effectively disable animation
    };
  }
  
  return {
    ...props,
    autoPlay: props.autoPlay !== undefined ? props.autoPlay : true,
    loop: props.loop !== undefined ? props.loop : true,
  };
};
