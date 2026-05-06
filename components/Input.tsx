'use client';

import { cn } from '../config';
import { Ref, InputHTMLAttributes, useRef } from 'react';
import type { ValidityStateMessage, ErrorDisplayStrategy, CustomErrorCompare } from '../types';
import { FieldError } from './FieldError';
import { useMergedRef } from '../hooks/useMergedRef';
import { useTriggerCustomError } from '../hooks/useTriggerCustomError';

/** Types */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement> | null;
  className?: string;
  errorMsg?: ValidityStateMessage;
  compare?: CustomErrorCompare;
  showError?: boolean;
  errorStrategy?: ErrorDisplayStrategy;
}

/**
 * @description A styled input component that wraps a standard HTML input element.
 * It supports validation and displays error messages based on the input's validity state.
 *
 * **Props:**
 * - `ref` - A React ref to access the underlying input element.
 * - `className` - Additional class names for the input element. It will override similar classes.
 * - `errorMsg` - An object containing custom error messages for different validity states.
 * - `compare` - A string or function to compare the current input value against for custom validation.
 * - `showError` - A boolean to control whether to display error messages. Defaults to true.
 * - `errorStrategy` - Strategy to determine when to show errors. 'peer' uses CSS peer selector, 'hook' uses a hook to detect :user-invalid state. Default is 'peer'.
 * - All other standard input attributes are supported via InputHTMLAttributes.
 *
 * @example
 * // Using the Input component with validation
 * // The client side validation errors will automatically display relevant error messages based on the input's validity state.
 * <Input
 *   ref={inputRef}
 *   type="text"
 *   required
 *   minLength={5}
 *   className="border p-2 rounded"
 *   errorMsg={{ tooShort: "Input is too short" }} // Override default message for tooShort
 * />
 *
 * // Display the error message outside the Input component (i.e., checkbox/radio groups), use the 'hook' strategy
 * const inputRef = useRef<HTMLInputElement>(null);
 * ...
 * <div>
 *   <Input
 *     ref={inputRef}
 *     type="checkbox"
 *     required
 *     minLength={5}
 *     showError={false} // Disable internal error display
 *   />
 * </div>
 * ...
 * <div>
 *   <FieldError elementRef={inputRef} />
 * </div>
 *
 * // Display the error message from server-side validation using the compare prop.
 * // As long as the value inside the input is "not good", the custom error message will display.
 * // You can also pass a function to compare for more complex logic.
 * // If no errorMsg.customError is provided, no custom error will show (because there's no error message sent from the server).
 * <Input
 *   type="text"
 *   compare="not good" // or compare={(val) => val !== "expected value"}, or compare=(val) => val.length < 5
 *   errorMsg={{ customError: "Value does not match the expected value" }}
 * />
 *
 * // When using the useActionState, you should always save the prev form values and use that to compare against,
 * // then pass the server error messages to the errorMsg prop. You can pass anything to the compare prop, it won't
 * // trigger an error unless you also provide an errorMsg.customError.
 * const [formState, formAction, isPending] = useActionState(...);
 *
 * <Input
 *  type="text"
 *  compare={formState?.prev?.username ?? undefined} // Compare against the previous username value
 *  errorMsg={{ customError: formState?.errors?.username }} // Without a customError message, no custom error will show
 * />
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
export const Input = (props: InputProps) => {
  const {
    ref = null,
    className,
    errorMsg,
    compare,
    showError = true,
    errorStrategy = 'peer',
    value,
    ...rest
  } = props;

  const localRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, localRef);

  // Trigger custom error based on compare prop
  useTriggerCustomError({
    ref: localRef,
    errorMessage: errorMsg?.customError || '',
    compare,
    value,
  });

  // Render component
  return (
    <>
      {/* Input element */}
      <input
        ref={mergedRef}
        className={cn('peer', className)}
        {...(value !== undefined && { value })}
        {...rest}
      />

      {/* Error message */}
      {showError && (
        <FieldError
          elementRef={localRef}
          errorMsg={errorMsg}
          strategy={errorStrategy}
        />
      )}
    </>
  );
};
