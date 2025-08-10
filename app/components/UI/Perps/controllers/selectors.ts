import { PerpsControllerState } from './PerpsController';

/**
 * Select whether user has ever placed their first successful order
 * @param state - PerpsController state
 * @returns boolean indicating if first order was placed
 */
export const selectHasPlacedFirstOrder = (
  state: PerpsControllerState,
): boolean => state?.hasPlacedFirstOrder ?? false;
