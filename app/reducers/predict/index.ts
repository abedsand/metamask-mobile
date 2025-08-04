import { REHYDRATE } from 'redux-persist';

const initialState = {
  isPolymarketStaging: true,
  isGeolocationCheck: false,
  countryCode: '',
};

interface PredictAction {
  type: string;
  payload?: {
    predict?: typeof initialState;
  };
  isPolymarketStaging?: boolean;
  isGeolocationCheck?: boolean;
  countryCode?: string;
}

// eslint-disable-next-line @typescript-eslint/default-param-last
const predictReducer = (state = initialState, action: PredictAction) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...initialState,
        ...(action.payload?.predict || {}),
      };
    case 'SET_POLYMARKET_STAGING':
      return {
        ...state,
        isPolymarketStaging: action.isPolymarketStaging,
      };
    case 'SET_GEOLOCATION_CHECK':
      return {
        ...state,
        isGeolocationCheck: action.isGeolocationCheck,
      };
    case 'SET_GEOLOCATION_DATA':
      return {
        ...state,
        countryCode: action.countryCode,
      };
    default:
      return state;
  }
};

export default predictReducer;
