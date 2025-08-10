import type { RootState } from '../../../../reducers';
import {
  renderHookWithProvider,
  type DeepPartial,
} from '../../../../util/test/renderWithProvider';
import { usePerpsSelector } from './usePerpsSelector';
import { selectHasPlacedFirstOrder } from '../controllers/selectors';

describe('usePerpsSelector', () => {
  // Mock Redux state
  const createMockState = (
    hasPlacedFirstOrder: boolean,
  ): DeepPartial<RootState> => ({
    engine: {
      backgroundState: {
        PerpsController: {
          hasPlacedFirstOrder,
        },
      },
    },
  });

  it('should retrieve hasPlacedFirstOrder = true from state using selectHasPlacedFirstOrder', () => {
    // Create state with hasPlacedFirstOrder = true
    const state = createMockState(true);

    // Render the hook with the mocked state
    const { result } = renderHookWithProvider(
      () => usePerpsSelector(selectHasPlacedFirstOrder),
      { state },
    );

    // Verify the selector returns the expected value
    expect(result.current).toBe(true);
  });

  it('should retrieve hasPlacedFirstOrder = false from state using selectHasPlacedFirstOrder', () => {
    // Create state with hasPlacedFirstOrder = false
    const state = createMockState(false);

    // Render the hook with the mocked state
    const { result } = renderHookWithProvider(
      () => usePerpsSelector(selectHasPlacedFirstOrder),
      { state },
    );

    // Verify the selector returns the expected value
    expect(result.current).toBe(false);
  });

  it('should safely handle missing PerpsController state', () => {
    // Create state with undefined PerpsController
    const state: DeepPartial<RootState> = {
      engine: {
        backgroundState: {
          // PerpsController is missing
        },
      },
    };

    // Render the hook with the mocked state
    const { result } = renderHookWithProvider(
      () => usePerpsSelector(selectHasPlacedFirstOrder),
      { state },
    );

    // Verify it falls back to default value (false)
    expect(result.current).toBe(false);
  });
});
