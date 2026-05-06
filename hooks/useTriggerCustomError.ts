import { RefObject, useEffect, useCallback } from 'react';
import { CustomErrorCompare, FormEl } from '../types';

/** Types */
interface UseTriggerCustomErrorProps<T extends FormEl> {
  ref: RefObject<T | null>;
  errorMessage?: string;
  compare?: CustomErrorCompare;
  value?: string | number | readonly string[] | undefined;
}

/**
 * @description React hook to trigger custom validation errors on form elements.
 * It sets a custom validity message based on a comparison value or function.
 *
 * **Props: **
 * - `ref`: A React ref object pointing to a form element (input, select, textarea).
 * - `errorMessage`: The custom error message to display when validation fails.
 * - `compare`: A string or function to compare against the element's value for validation.
 * - `value`: The current value of the form element to validate, if you're using a controlled element form
 * (value in a state). If the component is uncontrolled, the hook will read the value directly from the element
 * (no need to pass the current value).
 *
 * **Behavior: **
 * - If `errorMessage` or `compare` is not provided, no validation is performed.
 * - If `value` is provided, it is used for comparison; otherwise, the hook reads the value from the element.
 * - If `compare` is a function, it is called with the current value to determine if the error should be shown.
 * - If `compare` is a string, it checks if the current value strictly equals the string.
 * - If validation fails, the custom error message is set on the element; otherwise, any existing custom error is cleared.
 *
 * * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const [value, setValue] = useState(''); // you don't need to use state if the input is uncontrolled
 *
 * // Trigger a custom error if the value is not 'validValue'
 * useTriggerCustomError({
 *   ref: inputRef,
 *   errorMessage: 'Value must be "validValue"',
 *   compare: 'validValue',
 *   value,
 * });
 *
 * // Use a function to validate the value
 * useTriggerCustomError({
 *   ref: inputRef,
 *   errorMessage: 'Value must be at least 5 characters',
 *   compare: (v) => (v ? (v.length < 5) : true),
 * });
 */
export const useTriggerCustomError = <T extends FormEl>(props: UseTriggerCustomErrorProps<T>) => {
  const {
    ref, errorMessage, compare, value,
  } = props;

  // Helpers
  const comparator = compare;

  // Type guard for the comparator function.
  const isComparatorFn = (
    c: unknown,
  ): c is (v?: string | number | readonly string[]) => boolean => typeof c === 'function';

  // Helper to compute whether to show a custom error.
  const computeShouldShow = useCallback((val: string | number | readonly string[] | undefined): boolean => {
    if (!errorMessage || !comparator) return false;
    return isComparatorFn(comparator) ? comparator(val) : val === comparator;
  }, [comparator, errorMessage]);

  // Perform initial validation and attach the input listener.
  useEffect(() => {
    const el = ref.current;
    if (!el || !errorMessage || !comparator) return undefined;

    // Initial validation using provided value or current element value.
    const initialValue = value ?? el.value;
    el.setCustomValidity(computeShouldShow(initialValue) ? errorMessage : '');

    // Validate on input events.
    const handleInput = () => {
      const currentValue = el.value;
      el.setCustomValidity(computeShouldShow(currentValue) ? errorMessage : '');
    };

    el.addEventListener('input', handleInput);

    // Cleanup listener on unmount or deps change.
    return () => {
      el.removeEventListener('input', handleInput);
    };
  }, [errorMessage, comparator, value, ref, computeShouldShow]);

  return undefined;
};

