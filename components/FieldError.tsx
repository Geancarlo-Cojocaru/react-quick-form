'use client';

import { cn } from '../config';
import { RefObject, useMemo } from 'react';
import type { ValidityStateMessage, FormEl, ErrorDisplayStrategy } from '../types';
import { useValidityState } from '../hooks/useValidityState';
import { useDetectUserInvalid } from '../hooks/useDetectUserInvalid';
import { useFormElementAttributes } from '../hooks/useFormElementAttributes';
import { DEFAULT_ERROR_MESSAGES } from '../config';
import { replacePlaceholders } from '../utils/replacePlaceholders';

/** Types */
export interface FieldErrorProps {
  elementRef: RefObject<FormEl | null>;
  errorMsg?: ValidityStateMessage;
  className?: string;
  iconClassName?: string;
  strategy?: ErrorDisplayStrategy;
}

/**
 * @description A component that displays validation error messages based on the ValidityState of a form element.
 * It uses the `useValidityState` hook to get the current validity state and shows appropriate messages.
 * If you move the `FieldError` outside the component containing the form element, you must ensure the `elementRef`
 * is correctly passed down. Also use the 'hook' strategy to ensure proper detection of user interaction.
 *
 * **Props: **
 * - `elementRef`: A React ref pointing to the form element (input, select, textarea) to validate.
 * - `errorMsg`: An optional object containing custom error messages for different validity states.
 * - `className`: Optional additional class names for the container div.
 * - `iconClassName`: Optional additional class names for the error icon.
 * - `strategy`: Strategy to determine when to show errors. 'peer' uses CSS peer selector, 'hook' uses a hook to detect :user-invalid state.
 * Default is 'hook' (because if you're using as a stand alone, that's what you need).
 *
 * **Behavior: **
 * - If the form element is valid or not available, nothing is rendered.
 * - If invalid, it displays an error icon and the relevant error message(s).
 * - Custom messages from `errorMsg` take precedence over default translated messages.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 *
 * // Using 'peer' strategy when FieldError is inside the input's component
 * <input ref={inputRef} required minLength={5} className="peer" />
 * <FieldError elementRef={inputRef} strategy="peer" />
 *
 * // Using 'hook' strategy when FieldError is outside the input's component
 * <div>
 *   <Input ref={inputRef} required minLength={5} showError={false} />
 * </div>
 * ...
 * <div>
 *   <FieldError elementRef={inputRef} />
 * </div>
 *
 * // If you're using the ErrorField with a required radio/checkbox group, you need to use the 'key' prop to force re-render
 * // when the selected value changes, so the validity state is updated correctly.
 * const [selected, setSelected] = useState<string>('');
 * const radioRef = useRef<HTMLInputElement>(null);
 * ...
 * <div>
 *   <input ref={radioRef} type="radio" name="options" defaultValue="option1" required showError={false} onChange={(e) => setSelected(e.target.value)} />
 *   <input type="radio" name="options" value="option2" required showError={false} onChange={(e) => setSelected(e.target.value)} />
 * </div>
 * ...
 * <FieldError key={selected} elementRef={radioRef} />
 */
export const FieldError = (props: FieldErrorProps) => {
  const {
    elementRef,
    errorMsg,
    className,
    iconClassName,
    strategy = 'hook',
  } = props;

  const validity = useValidityState(elementRef);
  const isUserInvalid = useDetectUserInvalid(elementRef, strategy === 'hook');

  // Form element attribute snapshot
  const {
    elementType,
    elementTag,
    min,
    max,
    minLength,
    maxLength,
    isMultiple,
  } = useFormElementAttributes(elementRef);

  // Sort the typeMismatch message based on element type: email, url, default.
  const sortedMismatchMessage = useMemo(() => {
    if (elementType === 'email') return DEFAULT_ERROR_MESSAGES.emailMismatch;
    if (elementType === 'url') return DEFAULT_ERROR_MESSAGES.urlMismatch;
    return DEFAULT_ERROR_MESSAGES.typeMismatch;
  }, [elementType]);

  // Sort the valueMissing message based on element type: checkbox/radio, default.
  const sortedValueMissingMessage = useMemo(() => {
    if (elementType === 'radio' || (elementTag === 'select' && !isMultiple)) {
      return DEFAULT_ERROR_MESSAGES.radioValueMissing;
    }
    if (elementType === 'checkbox' || (elementTag === 'select' && isMultiple)) {
      return DEFAULT_ERROR_MESSAGES.checkboxValueMissing;
    }
    return DEFAULT_ERROR_MESSAGES.valueMissing;
  }, [elementType, elementTag, isMultiple]);

  // If no validity state or valid, don't render anything
  if (!validity || validity?.valid) return null;

  // For 'hook' strategy, also check if the user has interacted and the element is invalid
  if (strategy === 'hook' && !isUserInvalid) return null;

  // Render component
  return (
    <div
      className={cn(
        'mt-1.5 text-sm text-danger',
        strategy === 'peer'
          ? 'hidden peer-user-invalid:flex peer-user-invalid:items-start peer-user-invalid:gap-1.5'
          : 'flex items-start gap-1.5',
        className,
      )}
    >
      {/* Icon; replace it with a proper icon */}
      <span className={cn('shrink-0', iconClassName)}>
        ⓘ
      </span>

      {/* Message(s) */}
      <span>
        {/* Bad Input */}
        {validity?.badInput && (
          errorMsg?.badInput
          ?? DEFAULT_ERROR_MESSAGES.badInput
        )}

        {/* Custom Error */}
        {validity?.customError && (
          errorMsg?.customError
          ?? DEFAULT_ERROR_MESSAGES.customError
        )}

        {/* Pattern Mismatch */}
        {validity?.patternMismatch && (
          errorMsg?.patternMismatch
          ?? DEFAULT_ERROR_MESSAGES.patternMismatch
        )}

        {/* Range Overflow */}
        {validity?.rangeOverflow && (
          errorMsg?.rangeOverflow
          ?? replacePlaceholders(DEFAULT_ERROR_MESSAGES.rangeOverflow, { max })
        )}

        {/* Range Underflow */}
        {validity?.rangeUnderflow && (
          errorMsg?.rangeUnderflow
          ?? replacePlaceholders(DEFAULT_ERROR_MESSAGES.rangeUnderflow, { min })
        )}

        {/* Step Mismatch */}
        {validity?.stepMismatch && (
          errorMsg?.stepMismatch
          ?? DEFAULT_ERROR_MESSAGES.stepMismatch
        )}

        {/* Too Long */}
        {validity?.tooLong && (
          errorMsg?.tooLong
          ?? replacePlaceholders(DEFAULT_ERROR_MESSAGES.tooLong, { maxLength })
        )}

        {/* Too Short */}
        {validity?.tooShort && (
          errorMsg?.tooShort
          ?? replacePlaceholders(DEFAULT_ERROR_MESSAGES.tooShort, { minLength })
        )}

        {/* Type Mismatch */}
        {validity?.typeMismatch && (
          errorMsg?.typeMismatch
          ?? sortedMismatchMessage
        )}

        {/* Value Missing */}
        {validity?.valueMissing && (
          errorMsg?.valueMissing
          ?? sortedValueMissingMessage
        )}
      </span>
    </div>
  );
};
