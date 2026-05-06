'use client';

import { cn } from '../config';
import { Ref, TextareaHTMLAttributes, useRef } from 'react';
import type { ValidityStateMessage, ErrorDisplayStrategy, CustomErrorCompare } from '../types';
import { FieldError } from './FieldError';
import { useMergedRef } from '../hooks/useMergedRef';
import { useTriggerCustomError } from '../hooks/useTriggerCustomError';

/** Types */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement> | null;
  className?: string;
  errorMsg?: ValidityStateMessage;
  compare?: CustomErrorCompare;
  showError?: boolean;
  errorStrategy?: ErrorDisplayStrategy;
}

/**
 * @description A styled textarea component that wraps a standard HTML textarea element.
 * It supports validation and displays error messages based on the textarea's validity state.
 *
 * **Props:**
 * - `ref` - A React ref to access the underlying textarea element.
 * - `className` - Additional class names for the textarea element. It will override similar classes.
 * - `errorMsg` - An object containing custom error messages for different validity states.
 * - `compare` - A string or function to compare the current textarea value against for custom validation.
 * - `showError` - A boolean to control whether to display error messages. Defaults to true.
 * - `errorStrategy` - Strategy to determine when to show errors. 'peer' uses CSS peer selector, 'hook' uses a hook to detect :user-invalid state. Default is 'peer'.
 * - All other standard textarea attributes are supported via TextareaHTMLAttributes.
 *
 * @example
 * // Using the Textarea component with validation
 * // The client side validation errors will automatically display relevant error messages based on the textarea's validity state.
 * <Textarea
 *   ref={textareaRef}
 *   required
 *   minLength={10}
 *   maxLength={500}
 *   className="border p-2 rounded"
 *   errorMsg={{ tooShort: "Message is too short", tooLong: "Message is too long" }}
 *   placeholder="Enter your message here..."
 * />
 *
 * // Display the error message outside the Textarea component, use the 'hook' strategy
 * const textareaRef = useRef<HTMLTextAreaElement>(null);
 * ...
 * <div>
 *   <Textarea
 *     ref={textareaRef}
 *     required
 *     minLength={10}
 *     showError={false} // Disable internal error display
 *   />
 * </div>
 * ...
 * <div>
 *   <FieldError elementRef={textareaRef} />
 * </div>
 *
 * // Display the error message from server-side validation using the compare prop.
 * // As long as the value inside the textarea is "inappropriate", the custom error message will display.
 * // You can also pass a function to compare for more complex logic.
 * <Textarea
 *   compare="inappropriate" // or compare={(val) => containsBadWords(val)}
 *   errorMsg={{ customError: "Content contains inappropriate language" }}
 *   placeholder="Enter your comment..."
 * />
 *
 * // When using the useActionState, you should always save the prev form values and use that to compare against,
 * // then pass the server error messages to the errorMsg prop. You can pass anything to the compare prop, it won't
 * // trigger an error unless you also provide an errorMsg.customError.
 * const [formState, formAction, isPending] = useActionState(...);
 *
 * <Textarea
 *  compare={formState?.prev?.description} // Compare against the previous description value
 *  errorMsg={{ customError: formState?.errors?.description }} // Without a customError message, no custom error will show
 *  placeholder="Enter description..."
 * />
 */
export const Textarea = (props: TextareaProps) => {
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

  const localRef = useRef<HTMLTextAreaElement>(null);
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
      {/* Textarea element */}
      <textarea
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
