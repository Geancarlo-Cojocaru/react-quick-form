// Replace this with your own 'cn' function
import { lightCn } from './utils/lightCn';

/** A utility function for combining class names. */
export const cn = lightCn;

/** Default error messages for form validation states. */
export const DEFAULT_ERROR_MESSAGES = {
  valueMissing: 'This field is required.',
  badInput: 'Please enter a number.',
  rangeOverflow: 'The value entered must be less than {max}.',
  rangeUnderflow: 'The value entered must be greater than {min}.',
  stepMismatch: 'Please select a valid value.',
  urlMismatch: 'Please enter a valid URL.',
  emailMismatch: 'Please enter a valid email address.',
  tooLong: 'The field must have a maximum of {maxLength} characters.',
  tooShort: 'The field must be at least {minLength} characters long.',
  customError: 'The value you entered for this field is invalid.',
  patternMismatch: 'Please match the requested format.',
  radioValueMissing: 'Please select one option.',
  checkboxValueMissing: 'Please select at least one option.',
  typeMismatch: 'Please use the correct input type.',
};
