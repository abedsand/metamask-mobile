import { RootState } from '../reducers';

export const selectIsPolymarketStaging = (state: RootState) =>
  state.predict.isPolymarketStaging;
