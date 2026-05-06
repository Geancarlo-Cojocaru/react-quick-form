'use client';

import { cn } from '../config';
import { Ref, InputHTMLAttributes, ReactNode, useRef } from 'react';
import type { ValidityStateMessage, CustomErrorCompare } from '../types';
import { FieldError } from './FieldError';
import { useMergedRef } from '../hooks/useMergedRef';
import { useTriggerCustomError } from '../hooks/useTriggerCustomError';

/** Types */
export interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement> | null;
  className?: string;
  errorMsg?: ValidityStateMessage;
  compare?: CustomErrorCompare;
  showError?: boolean;
  before?: ReactNode;
  beforeClassName?: string;
  after?: ReactNode;
  afterClassName?: string;
}

/**
 * @description A styled input component that wraps a standard HTML input element with support for prefix and suffix elements.
 * It supports validation and displays error messages based on the input's validity state.
 *
 * **Props:**
 * - `ref` - A React ref to access the underlying input element.
 * - `className` - Additional class names for the input element.
 * - `errorMsg` - An object containing custom error messages for different validity states.
 * - `compare` - A string or function to compare the current input value against for custom validation.
 * - `showError` - A boolean to control whether to display error messages. Defaults to true.
 * - `before` - A React node to be displayed before the input (prefix).
 * - `beforeClassName` - Additional class names for the prefix container.
 * - `after` - A React node to be displayed after the input (suffix).
 * - `afterClassName` - Additional class names for the suffix container.
 * - All other standard input attributes are supported via InputHTMLAttributes.
 *
 * @example
 * // Using the InputGroup component with a suffix (e.g., currency)
 * <InputGroup
 *   required
 *   type="number"
 *   step="0.01"
 *   name="amount"
 *   after="euro"
 *   placeholder="Enter amount"
 *   errorMsg={{ valueMissing: 'Please enter an amount' }}
 *   className="pr-10"
 * />
 *
 * @example
 * // Using the InputGroup component with a prefix (e.g., search icon)
 * <InputGroup
 *   type="text"
 *   name="search"
 *   before={<SearchIcon className="size-4" />}
 *   placeholder="Search..."
 *   className="pl-10"
 * />
 */
export const InputGroup = (props: InputGroupProps) => {
  const {
    ref = null,
    className,
    errorMsg,
    compare,
    showError = true,
    value,
    before,
    beforeClassName,
    after,
    afterClassName,
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
      <span className="relative block">
        {before && (
          <span className={cn('absolute top-1/2 left-3 -translate-y-1/2', beforeClassName)}>
            {before}
          </span>
        )}

        <input
          ref={mergedRef}
          className={cn('peer', className)}
          {...(value !== undefined && { value })}
          {...rest}
        />

        {after && (
          <span className={cn('absolute top-1/2 right-3 -translate-y-1/2', afterClassName)}>
            {after}
          </span>
        )}
      </span>

      {/* Error message */}
      {showError && (
        <FieldError
          elementRef={localRef}
          errorMsg={errorMsg}
          strategy={'hook'}
        />
      )}
    </>
  );
};
