import { useSelector } from 'react-redux';
import type { Selector } from 'reselect';
import type { PerpsControllerState } from '../controllers/PerpsController';
import { RootState } from '../../../../reducers';

/**
 * A hook that adapts perps controller selectors to work with the client's state structure.
 * This allows us to use the perps controller selectors without being tightly coupled to its state structure.
 *
 * @param selector - A selector from the perps controller
 * @returns The selected value from the perps state
 */
export function usePerpsSelector<T>(
  selector: Selector<PerpsControllerState, T>,
): T {
  return useSelector((state: RootState) =>
    selector(state.engine.backgroundState.PerpsController),
  );
}
