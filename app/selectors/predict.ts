import { RootState } from '../reducers';

export const selectIsPolymarketStaging = (state: RootState) =>
  state.predict.isPolymarketStaging;

export const selectIsGeolocationCheck = (state: RootState) =>
  state.predict.isGeolocationCheck;

export const selectGeolocationData = (state: RootState) =>
  state.predict.countryCode;
