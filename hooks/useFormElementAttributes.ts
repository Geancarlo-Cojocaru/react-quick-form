import { RefObject, useState, useEffect } from 'react';
import type { FormEl } from '../types';

/** Snapshot of common form element attributes */
export interface FormElementAttributesSnapshot {
  elementType: string | null;
  elementTag: string | null;
  min: string;
  max: string;
  minLength: string;
  maxLength: string;
  isMultiple: boolean;
}

/**
 * @description React hook to read and monitor common attributes of a form element.
 * It returns a snapshot of attributes like type, tag name, min/max values, length constraints, and multiple selection.
 * The hook sets up a MutationObserver to update the snapshot whenever the element's attributes change.
 *
 * @param ref - A React ref object pointing to a form element (input, select, textarea).
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const {
 *   elementType,
 *   elementTag,
 *   min,
 *   max,
 *   minLength,
 *   maxLength,
 *   isMultiple,
 * } = useFormElementAttributes(inputRef);
 */
export const useFormElementAttributes = <T extends FormEl>(ref: RefObject<T | null>) => {
  const [attrs, setAttrs] = useState<FormElementAttributesSnapshot>({
    elementType: null,
    elementTag: null,
    min: '',
    max: '',
    minLength: '',
    maxLength: '',
    isMultiple: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Function to read the current attributes and update the state
    const read = () => {
      const elementType = (el as HTMLInputElement).type ?? null;
      const elementTag = el.tagName ? el.tagName.toLowerCase() : null;
      const min = el.getAttribute('min') ?? '';
      const max = el.getAttribute('max') ?? '';
      const minLength = el.getAttribute('minlength') ?? '';
      const maxLength = el.getAttribute('maxlength') ?? '';
      const isMultiple = el instanceof HTMLSelectElement ? el.multiple : false;

      setAttrs({
        elementType,
        elementTag,
        min,
        max,
        minLength,
        maxLength,
        isMultiple,
      });
    };

    read();

    // Set up a MutationObserver to watch for attribute changes
    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true });

    // Cleanup on unmounting
    return () => observer.disconnect();
  }, [ref]);

  return attrs;
};
