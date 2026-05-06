import { useCallback, useRef, type Ref } from 'react';

/**
 * Merges two React refs into a single ref callback.
 * This is useful when you need to use a local ref and also support an external ref passed via props.
 * Supports React 19 cleanup functions.
 */
export function useMergedRef<TElement>(
  refA: Ref<TElement> | null | undefined,
  refB: Ref<TElement> | null | undefined,
): (current: TElement | null) => void {
  const cleanupA = useRef<(() => void) | null>(null);
  const cleanupB = useRef<(() => void) | null>(null);

  return useCallback(
    (current: TElement | null) => {
      if (current === null) {
        const cleanupFnA = cleanupA.current;
        if (cleanupFnA) {
          cleanupA.current = null;
          cleanupFnA();
        }
        const cleanupFnB = cleanupB.current;
        if (cleanupFnB) {
          cleanupB.current = null;
          cleanupFnB();
        }
      } else {
        if (refA) {
          cleanupA.current = applyRef(refA, current);
        }
        if (refB) {
          cleanupB.current = applyRef(refB, current);
        }
      }
    },
    [refA, refB],
  );
}

/**
 * Assigns a value to a React ref.
 * Supports both function refs and object refs, including React 19 cleanup functions.
 *
 * @param ref - The React ref to apply the value to.
 * @param current - The value to assign to the ref.
 * @returns A cleanup function to be called when the ref should be cleared.
 */
function applyRef<TElement>(
  ref: Ref<TElement>,
  current: TElement,
): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(current);
    if (typeof cleanup === 'function') {
      return cleanup;
    } else {
      return () => ref(null);
    }
  } else if (ref && typeof ref === 'object' && 'current' in ref) {
    (ref as { current: TElement | null }).current = current;
    return () => {
      (ref as { current: TElement | null }).current = null;
    };
  }
  return () => {};
}
