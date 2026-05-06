'use client';

import {
  Ref, ReactNode, SelectHTMLAttributes, useRef,
} from 'react';
import { cn } from '../config';
import type { ValidityStateMessage, ErrorDisplayStrategy, CustomErrorCompare } from '../types';
import { FieldError } from './FieldError';
import { useMergedRef } from '../hooks/useMergedRef';
import { useTriggerCustomError } from '../hooks/useTriggerCustomError';

/** Types */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement> | null;
  className?: string;
  errorMsg?: ValidityStateMessage;
  compare?: CustomErrorCompare;
  showError?: boolean;
  errorStrategy?: ErrorDisplayStrategy;
  children?: ReactNode;
}

/**
 * @description A styled select component that wraps a standard HTML select element.
 * It supports validation and displays error messages based on the select's validity state.
 *
 * **Props:**
 * - `ref` - A React ref to access the underlying select element.
 * - `className` - Additional class names for the select element. It will override similar classes.
 * - `errorMsg` - An object containing custom error messages for different validity states.
 * - `compare` - A string or function to compare the current select value against for custom validation.
 * - `showError` - A boolean to control whether to display error messages. Defaults to true.
 * - `errorStrategy` - Strategy to determine when to show errors. 'peer' uses CSS peer selector, 'hook' uses a hook to detect :user-invalid state. Default is 'peer'.
 * - `children` - Option elements or option groups to render inside the select.
 * - All other standard select attributes are supported via SelectHTMLAttributes.
 *
 * @example
 * // Using the Select component with validation
 * // The client side validation errors will automatically display relevant error messages based on the select's validity state.
 * <Select
 *   ref={selectRef}
 *   required
 *   className="border p-2 rounded"
 *   errorMsg={{ valueMissing: "Please select an option" }}
 * >
 *   <option value="">Choose an option</option>
 *   <option value="option1">Option 1</option>
 *   <option value="option2">Option 2</option>
 * </Select>
 *
 * // Display the error message outside the Select component, use the 'hook' strategy
 * const selectRef = useRef<HTMLSelectElement>(null);
 * ...
 * <div>
 *   <Select
 *     ref={selectRef}
 *     required
 *     showError={false} // Disable internal error display
 *   >
 *     <option value="">Choose an option</option>
 *     <option value="option1">Option 1</option>
 *   </Select>
 * </div>
 * ...
 * <div>
 *   <FieldError elementRef={selectRef} />
 * </div>
 *
 * // Display the error message from server-side validation using the compare prop.
 * // As long as the value inside the select is "invalid", the custom error message will display.
 * // You can also pass a function to compare for more complex logic.
 * <Select
 *   compare="invalid" // or compare={(val) => val !== "expected value"}
 *   errorMsg={{ customError: "Value does not match the expected value" }}
 * >
 *   <option value="">Choose an option</option>
 *   <option value="valid">Valid Option</option>
 *   <option value="invalid">Invalid Option</option>
 * </Select>
 *
 * // When using the useActionState, you should always save the prev form values and use that to compare against,
 * // then pass the server error messages from API to the errorMsg prop. You can pass anything to the compare prop, it won't
 * // trigger an error unless you also provide an errorMsg.customError.
 * const [formState, formAction, isPending] = useActionState(...);
 *
 * <Select
 *  compare={formState?.prev?.category} // Compare against the previous category value
 *  errorMsg={{ customError: formState?.errors?.category }} // Without a customError message, no custom error will show
 * >
 *   <option value="">Select category</option>
 *   <option value="cat1">Category 1</option>
 * </Select>
 */
export const Select = (props: SelectProps) => {
  const {
    ref = null,
    className,
    errorMsg,
    compare,
    showError = true,
    errorStrategy = 'peer',
    value,
    children,
    ...rest
  } = props;

  const localRef = useRef<HTMLSelectElement>(null);
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
      {/* Select element */}
      <select
        ref={mergedRef}
        className={cn('peer', className)}
        {...(value !== undefined && { value })}
        {...rest}
      >
        {children}
      </select>

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
