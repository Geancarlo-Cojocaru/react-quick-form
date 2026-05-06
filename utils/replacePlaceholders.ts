/**
 * Replaces placeholders in a string with provided values.
 * e.g., replacePlaceholders("Value must be < {max}", { max: 10 }) -> "Value must be < 10"
 */
export const replacePlaceholders = (
  template: string,
  values: Record<string, string | number | undefined | null>,
): string => {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key]?.toString() ?? match;
  });
};
