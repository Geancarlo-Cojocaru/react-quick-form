import { RefObject, useSyncExternalStore } from 'react';
import type { FormEl } from '../types';

/**  Default events to listen to for form element changes. */
const DEFAULT_EVENTS = ['input', 'blur', 'invalid'] as const;

/**
 * @description Attaches event listeners to a given element for specified events.
 * @param element - The target element to attach listeners to.
 * @param events - An array of event names to listen for.
 * @param listener - The event listener function or object.
 * @returns A cleanup function to remove the attached event listeners.
 *
 * @example
 * const cleanup = attachEventListeners(inputElement, ['input', 'blur'], handleEvent);
 * // Later, to remove the listeners:
 * cleanup();
 */
export const attachEventListeners = (
  element: Element,
  events: ReadonlyArray<string>,
  listener: EventListenerOrEventListenerObject,
) => {
  events.forEach((evt) => element.addEventListener(evt, listener as EventListener));
  return () => {
    events.forEach((evt) => element.removeEventListener(evt, listener as EventListener));
  };
};


/**
 * @description Base hook for subscribing to form element events with useSyncExternalStore.
 * Provides a reusable subscription pattern for form element state changes.
 * It just takes care of attaching/detaching event listeners and calling the provided snapshot functions.
 *
 * @param ref - A React ref object pointing to a form element (input, select, textarea).
 * @param getSnapshot - Function that returns the current state snapshot.
 * @param getServerSnapshot - Function that returns the server-side snapshot (for SSR).
 * @param enabled - Optional boolean to enable or disable the subscription (default: true).
 * @param events - Optional array of event names to listen for (default: ['input', 'blur', 'invalid']).
 * @returns The result of useSyncExternalStore with the provided snapshot functions.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const value = useFormElementSubscription(
 *   inputRef,
 *   () => inputRef?.current?.value || '', // the getSnapshot function for client side
 *   () => '', // the getServerSnapshot function for server side
 *   true, // the enabled parameter, whether to attach the listeners or not, default is true
 *   ['change'], // events - custom events to listen to, default is ['input', 'blur', 'invalid']
 * );
 */
export const useFormElementSubscription = <T extends FormEl, S = unknown>(
  ref: RefObject<T | null>,
  getSnapshot: () => S,
  getServerSnapshot: () => S,
  enabled = true,
  events: ReadonlyArray<keyof HTMLElementEventMap> = DEFAULT_EVENTS,
) => useSyncExternalStore(
  (callback) => {
    const element = ref.current;
    if (!element || !enabled) return () => {};

    const notify = () => callback();

    return attachEventListeners(element, events as ReadonlyArray<string>, notify);
  },
  getSnapshot,
  getServerSnapshot,
);

