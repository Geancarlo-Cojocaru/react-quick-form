/** Interface for displaying validation messages based on the ValidityState of an input element. */
export interface ValidityStateMessage {
  badInput?: string;
  customError?: string;
  patternMismatch?: string;
  rangeOverflow?: string;
  rangeUnderflow?: string;
  stepMismatch?: string;
  tooLong?: string;
  tooShort?: string;
  typeMismatch?: string;
  valueMissing?: string;
  valid?: string;
}

/** Union type for form elements that can be validated. */
export type FormEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Type defining strategies for displaying error messages.
 * - 'peer': Uses CSS peer selectors to show/hide error messages based on the input's validity state.
 * - 'hook': Uses a React hook to track validity state and conditionally render error messages.
 */
export type ErrorDisplayStrategy = 'peer' | 'hook';

/** Type for custom error comparison. It can be a string to compare against the input's value,
 * or a function that takes the input's value and returns a boolean indicating validity.
 */
export type CustomErrorCompare = string | number | ((value?: string | number | readonly string[]) => boolean);
