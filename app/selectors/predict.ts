import { RootState } from '../reducers';

export const selectIsPolymarketStaging = (state: RootState) => {
  return state.predict.isPolymarketStaging;
}; 