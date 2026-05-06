import { RefObject } from 'react';
import type { FormEl } from '../types';
import { useFormElementSubscription } from './useFormElementSubscription';

/**
 * @description React hook to detect if a form element is in the :user-invalid state.
 * It uses useSyncExternalStore to subscribe to input, blur, and invalid events on the element.
 * @param ref - A React ref object pointing to a form element (input, select, textarea).
 * @param enabled - A boolean to enable or disable the detection (default: true).
 * @returns A boolean indicating if the element is in the :user-invalid state.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const isUserInvalid = useDetectUserInvalid(inputRef);
 * // => isUserInvalid will be true if the input is in the :user-invalid state
 */
export const useDetectUserInvalid = <T extends FormEl>(
  ref: RefObject<T | null>,
  enabled = true,
): boolean => {
  // CSS selector for the :user-invalid pseudo-class
  const USER_INVALID_SELECTOR = ':user-invalid';

  // Snapshot function to check if the element matches :user-invalid
  const isUserInvalidSnapshot = () => {
    if (!enabled) return false;
    const el = ref.current;
    return !!el?.matches(USER_INVALID_SELECTOR);
  };

  // Use the generic form element subscription hook
  return useFormElementSubscription(
    ref,
    isUserInvalidSnapshot,
    () => false,
    enabled,
  );
};

