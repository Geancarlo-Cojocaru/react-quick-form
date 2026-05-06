'use client';

import { cn } from '../config';
import { Ref, InputHTMLAttributes, useRef } from 'react';
import type { ValidityStateMessage, CustomErrorCompare } from '../types';
import { FieldError } from './FieldError';
import { useMergedRef } from '../hooks/useMergedRef';
import { useTriggerCustomError } from '../hooks/useTriggerCustomError';

/** Types */
type CommonSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue'> & {
  ref?: Ref<HTMLInputElement> | null;
  errorMsg?: ValidityStateMessage;
  compare?: CustomErrorCompare;
  showError?: boolean;
  title?: string;
  className?: string;
};

export type SwitchProps =
  | (CommonSwitchProps & {
    // When binaryValue is present, value and defaultValue must not be provided
    binaryValue: [string | number | boolean, string | number | boolean];
    value?: never;
    defaultValue?: never;
  })
  | (CommonSwitchProps & {
    // When binaryValue is absent, value/defaultValue are allowed as usual
    binaryValue?: undefined;
    value?: InputHTMLAttributes<HTMLInputElement>['value'];
    defaultValue?: InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  });

/** Switch classes */
export const switchClasses = {
  track: 'bg-surface-200 border border-surface shadow-inner outline-hidden focus:border-primary/20 hover:bg-surface-300 peer peer-checked:bg-primary-300/60 hover:peer-checked:bg-primary-300/40 h-6.5 w-11 rounded-full transition-all duration-500 ease-in-out peer-focus:ring-transparent peer-focus:outline-0',
  thumb: 'peer-checked:after:border-surface after:bg-ink-soft after:absolute after:top-[2px] after:left-[2px] after:size-5.5 after:shadow-sm after:shadow-ink/50 after:rounded-full after:transition-all after:content-[\'\'] peer-checked:after:translate-x-4.5 peer-checked:after:bg-primary',
};

/**
 * @description A styled switch/toggle component that wraps a checkbox input element.
 * It supports validation and displays error messages based on the input's validity state.
 *
 * **Props:**
 * - `ref` - A React ref to access the underlying input element.
 * - `errorMsg` - An object containing custom error messages for different validity states.
 * - `compare` - A string or function to compare the current input value against for custom validation.
 * - `showError` - A boolean to control whether to display error messages. Defaults to true.
 * - `title` - Title attribute for accessibility. Defaults to "toggle".
 * - `binaryValue` - An optional tuple defining the values for checked and unchecked states. The first element is for checked, the second for unchecked.
 *   use it when you need to send the 'unchecked' value, like when using a select with two options.
 * - All other standard input attributes are supported via InputHTMLAttributes (except the type which is fixed as a checkbox).
 *
 * @example
 * // Basic switch usage
 * <Switch
 *   name="notifications"
 *   defaultChecked={true}
 * />
 *
 * // Switch with validation
 * <Switch
 *   ref={switchRef}
 *   name="terms"
 *   required
 *   errorMsg={{ valueMissing: "You must accept the terms" }}
 * />
 *
 * // Switch with binary values
 * <Switch
 *   name="subscribe"
 *   binaryValue={['yes', 'no']}
 *   defaultChecked={false}
 * />
 */
export const SwitchInput = (props: SwitchProps) => {
  const {
    ref = null,
    errorMsg,
    compare,
    showError = true,
    value,
    title = 'toggle',
    binaryValue,
    name,
    disabled,
    className,
    ...rest
  } = props;

  // Extract potentially conflicting props so we can manage them explicitly
  const {
    checked, defaultChecked, onChange, ...restInput
  } = rest;

  const localRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, localRef);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Trigger custom error based on compare prop
  useTriggerCustomError({
    ref: localRef,
    errorMessage: errorMsg?.customError || '',
    compare,
    value,
  });

  // Keep the hidden checkbox in inverse sync with the visible one
  const handleChange: typeof onChange = (e) => {
    if (hiddenRef.current) {
      hiddenRef.current.checked = !e.currentTarget.checked;
    }
    if (onChange) onChange(e);
  };

  // Render component
  return (
    <>
      {/* Hidden inverse checkbox for binaryValue mode */}
      {binaryValue && name && (
        <input
          ref={hiddenRef}
          type="checkbox"
          name={name}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          {...(disabled && { disabled })}
          value={String(binaryValue[1])}
          {...(checked !== undefined
            ? { checked: !checked }
            : { defaultChecked: defaultChecked !== undefined ? !defaultChecked : true })}
        />
      )}

      {/* Switch container */}
      <label
        title={title}
        className={cn(
          'flex cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        <span
          title={title}
          className="relative inline-flex items-center"
        >
          {/* Visible checkbox */}
          <input
            ref={mergedRef}
            type="checkbox"
            className="peer sr-only"
            name={name}
            {...(binaryValue ? { value: String(binaryValue[0]) } : (value && { value }))}
            {...(checked !== undefined ? { checked } : {})}
            {...(defaultChecked !== undefined ? { defaultChecked } : {})}
            onChange={handleChange}
            {...(disabled && { disabled })}
            {...restInput}
          />

          {/* Switch track and thumb */}
          <span className={`${switchClasses.track} ${switchClasses.thumb}`} />
        </span>
      </label>

      {/* Error message */}
      {showError && (
        <FieldError
          elementRef={localRef}
          errorMsg={errorMsg}
        />
      )}
    </>
  );
};
