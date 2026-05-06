/**
 * @description Transforms a FormData object into a plain object.
 * Handles multiple values for the same key by aggregating them into an array.
 *
 * @param formData - The FormData object to transform.
 * @param allowList - Optional. An array of keys to include in the resulting object.
 *                    If provided, only keys in this list will be processed.
 *
 * @returns An object with the FormData entries, optionally filtered by allowList.
 *
 * @example
 * const formData = new FormData();
 * formData.append('name', 'John');
 * formData.append('age', '30');
 * formData.append('age', '31');
 *
 * // Default behavior: all keys are included in the resulting object.
 * formDataToObject(formData); // { name: 'John', age: ['30', '31'] }
 *
 * // With allowed keys (ie: 'age').
 * formDataToObject(formData, ['age']); // { age: ['30', '31'] }
 */
export const formDataToObject = (formData: FormData, allowList?: string[]) => {
  const obj: Record<string, FormDataEntryValue | FormDataEntryValue[] | undefined> = {};

  // Convert to a Set for performance
  const allowed = allowList ? new Set(allowList) : null;

  for (const [key, value] of formData.entries()) {
    // If allowList is provided, skip keys that are not in the list.
    if (allowed && !allowed.has(key)) {
      continue;
    }

    // If the key already exists in the object, convert it to an array.
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const currentValue = obj[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(value);
      } else {
        obj[key] = [currentValue as FormDataEntryValue, value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

/**
 * @description Serializes an HTML form into a URL-encoded query string.
 * - Duplicate keys (e.g. checkboxes, multi-selects) are preserved as separate
 *   `key=value` pairs, which most server-side frameworks correctly parse back
 *   into arrays (e.g. `tag=a&tag=b`).
 * - File inputs are excluded, as `encodeURIComponent` would coerce a `File`
 *   object to the meaningless string `"[object File]"`.
 * - An optional allowlist can restrict which fields are included in the output.
 *
 * @param formData - The HTML form element to serialize.
 * @param allowList - Optional array of field names to include. If omitted, all
 *   non-file fields are included. Uses a `Set` internally for O(1) lookups.
 *
 * @returns A URL-encoded query string, e.g. `"email=foo%40bar.com&tag=a&tag=b"`.
 *
 * @example
 * // Serialize all fields
 * serializeForm(form); // "email=foo%40bar.com&tag=a&tag=b"
 *
 * @example
 * // Serialize only specific fields
 * serializeForm(form, ["email", "username"]); // "email=foo%40bar.com&username=john"/
 */
export const formDataSerialize = (formData: HTMLFormElement, allowList?: string[]): string => {
  // Convert to a Set for performance
  const allowed = allowList ? new Set(allowList) : null;

  return Array.from(new FormData(formData))
    .filter(
      ([key, value]) =>
        // Exclude File objects - encodeURIComponent would silently coerce them to "[object File]"
        typeof value === 'string' &&
        (!allowed || allowed.has(key)),
    )
    .map(
      // Encode both key and value to safely handle special characters (spaces, ampersands, equals signs, non-ASCII, etc.).
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
    )
    .join('&');
};

/**
 * Common item type that can be appended to FormData (as value or coerced to string).
 * Note: `null` and `undefined` are allowed in arrays but are skipped during append.
 */
export type FormDataArrayItem =
  | string
  | number
  | boolean
  | Blob
  | File
  | Date
  | null
  | undefined;

/**
 * @description Appends an array of values to a `FormData` under the same key.
 * - Skips `undefined` and `null` entries.
 * - Numbers and booleans are converted to strings.
 * - Dates are serialized as ISO strings.
 * - Files/Blobs are appended as-is.
 *
 * @example
 * arrayToFormData('tag', ['a', 'b']); // appends tag=a and tag=b
 */
export const arrayToFormData = (
  key: string,
  values: Array<FormDataArrayItem>,
  fd: FormData = new FormData(),
): FormData => {
  for (const v of values) {
    if (v === undefined || v === null) continue;
    if (v instanceof Blob) {
      // Covers File as well (File extends Blob)
      fd.append(key, v);
    } else if (v instanceof Date) {
      fd.append(key, v.toISOString());
    } else {
      fd.append(key, String(v));
    }
  }
  return fd;
};

/**
 * @description Converts a plain object to `FormData`.
 * - Arrays are appended as repeated keys: `key=a&key=b`.
 * - `FileList` is iterated and each file appended under the same key.
 * - `Date` values use `toISOString()`.
 * - `Blob`/`File` values are appended as-is.
 * - Nested plain objects are JSON-stringified by default.
 * - `undefined`/`null` values are skipped.
 * - Optional allowList to restrict which top-level keys are included.
 */
export const objectToFormData = (
  obj: Record<string, unknown>,
  options?: {
    allowList?: string[];
    /** If true, nested objects are JSON.stringified (default true). */
    stringifyObjects?: boolean;
  },
  fd: FormData = new FormData(),
): FormData => {
  const allowed = options?.allowList ? new Set(options.allowList) : null;
  const stringifyObjects = options?.stringifyObjects ?? true;

  for (const [key, raw] of Object.entries(obj ?? {})) {
    if (allowed && !allowed.has(key)) continue;

    if (raw === undefined || raw === null) continue;

    const value = raw as
      | string
      | number
      | boolean
      | Blob
      | File
      | Date
      | FileList
      | Array<FormDataArrayItem>
      | Record<string, unknown>;

    // Arrays -> append repeated keys
    if (Array.isArray(value)) {
      arrayToFormData(
        key,
        value as Array<FormDataArrayItem>,
        fd,
      );
      continue;
    }

    // FileList -> iterate files
    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        fd.append(key, value.item(i)!);
      }
      continue;
    }

    // Blob/File
    if (value instanceof Blob) {
      fd.append(key, value);
      continue;
    }

    // Date
    if (value instanceof Date) {
      fd.append(key, value.toISOString());
      continue;
    }

    // Plain object -> JSON or skip
    if (typeof value === 'object') {
      if (stringifyObjects) {
        fd.append(key, JSON.stringify(value));
      }
      continue;
    }

    // Primitives
    fd.append(key, String(value));
  }

  return fd;
};
