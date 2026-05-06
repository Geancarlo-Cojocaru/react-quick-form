import { RefObject } from 'react';
import type { FormEl } from '../types';
import { useFormElementSubscription } from './useFormElementSubscription';

/** Strongly typed list of ValidityState flags we care about */
const VALIDITY_KEYS = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooLong',
  'tooShort',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
  'customError',
  'valid',
] as const;

type ValidityFlag = typeof VALIDITY_KEYS[number];
type ValiditySnapshot = Readonly<Record<ValidityFlag, boolean>>;

/** Cache of validity snapshots (WeakMap to avoid memory leaks) */
const validityCache = new WeakMap<Element, ValiditySnapshot>();

/**
 * Build a plain object snapshot from ValidityState.
 */
function buildValiditySnapshot(el: FormEl): ValiditySnapshot {
  const { validity } = el;
  return {
    valueMissing: validity.valueMissing,
    typeMismatch: validity.typeMismatch,
    patternMismatch: validity.patternMismatch,
    tooLong: validity.tooLong,
    tooShort: validity.tooShort,
    rangeUnderflow: validity.rangeUnderflow,
    rangeOverflow: validity.rangeOverflow,
    stepMismatch: validity.stepMismatch,
    badInput: validity.badInput,
    customError: validity.customError,
    valid: validity.valid,
  };
}

/**
 * Compare two snapshots by known keys (avoids Object.keys dancing).
 */
function areSnapshotsEqual(a: ValiditySnapshot, b: ValiditySnapshot): boolean {
  return VALIDITY_KEYS.every((key) => a[key] === b[key]);
}

/**
 * Return a cached snapshot if unchanged; otherwise update the cache and return the new one.
 */
function getCachedValiditySnapshot(el: FormEl): ValiditySnapshot {
  const snapshot = buildValiditySnapshot(el);
  const cached = validityCache.get(el);
  if (cached && areSnapshotsEqual(cached, snapshot)) {
    return cached;
  }
  validityCache.set(el, snapshot);
  return snapshot;
}

/**
 * @description React hook to track the validity state of a form element.
 * It uses the `useSyncExternalStore` hook to subscribe to validity changes.
 * For more info about ValidityState, see: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 *
 * @param ref - A React ref object pointing to a form element (input, select, textarea).
 * @param enabled - A boolean to enable or disable the validity tracking (default: true).
 * @returns An object representing the current validity state flags, or null if the element is not available.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const validity = useValidityState(inputRef);
 * // => validity will be an object (that will be updated) like:
 * // {
 * //   valueMissing: false,
 * //   typeMismatch: false,
 * //   patternMismatch: false,
 * //   tooLong: false,
 * //   tooShort: false,
 * //   rangeUnderflow: false,
 * //   rangeOverflow: false,
 * //   stepMismatch: false,
 * //   badInput: false,
 * //   customError: false,
 * //   valid: true
 * // }
 */
export const useValidityState = <T extends FormEl>(
  ref: RefObject<T | null>,
  enabled = true,
): ValiditySnapshot | null => useFormElementSubscription<T, ValiditySnapshot | null>(
  ref,
  () => {
    if (!enabled) return null;
    const el = ref.current;
    return el ? getCachedValiditySnapshot(el) : null;
  },
  () => null,
  enabled,
);

