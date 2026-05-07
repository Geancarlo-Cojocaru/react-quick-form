/**
 * A minimal class name merger.
 * Note: This does NOT handle Tailwind conflicts.
 * It is intended as a lightweight fallback until replaced by the user's own 'cn' function.
 */
export const lightCn = (...inputs: (string | undefined | null | boolean)[]): string => {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
};
