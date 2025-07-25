import { REHYDRATE } from 'redux-persist';

const initialState = {
  isPolymarketStaging: true, // Default to staging
};

const predictReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case REHYDRATE:
      // Merge persisted state with initial state
      return {
        ...initialState,
        ...(action.payload?.predict || {}),
      };
    case 'SET_POLYMARKET_STAGING':
      return {
        ...state,
        isPolymarketStaging: action.isPolymarketStaging,
      };
    default:
      return state;
  }
};

export default predictReducer; 