import type { ReactNode } from 'react';
import { cn } from '../config';

/** Types */
interface BaseProps {
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  required?: boolean;
  children: ReactNode;
}

export interface LabelProps<T extends 'label' | 'div' = 'label'> extends BaseProps {
  as?: T;
  htmlFor?: T extends 'label' ? string : never;
}

/**
 * @description A styled label component for form elements. It can wrap around input elements or be associated with
 * them via the `htmlFor` attribute. It's a block-level element that stacks its children vertically.
 * It supports an optional `required` prop to indicate mandatory fields.
 *
 * **Props: **
 * - `as`: The HTML element to render, either 'label' or 'div'. Defaults to 'label'.
 * - `description`: Optional description text or component to provide additional information.
 * - `descriptionClassName`: Additional class names for the description element.
 * - `className`: Additional class names for the label element.
 * - `required`: A boolean indicating if the associated form field is required. Defaults to false.
 * - `children`: The content of the label, typically text or other inline elements.
 * - All other standard label attributes are supported via LabelHTMLAttributes.
 *
 * @example
 * // If you don't wrap the label around the input, use htmlFor to associate it with the input's id
 * <LabelGroup htmlFor="username" description="Username" required />
 * <input type="text" id="username" />
 *
 * // If you wrap the label around the input, htmlFor is not needed
 * <LabelGroup description="Password" required>
 *   <input type="password" id="password" />
 * </LabelGroup>
 *
 * // Using 'div' as the wrapper element instead of 'label'. This is useful when the label is not directly
 * // associated with a single input, like in checkbox or radio groups.
 * <LabelGroup as="div" description="Select your preferences" className="mb-4">
 *   <div className="mt-2">
 *     <label>
 *       <input type="checkbox" name="option1" /> Option 1
 *     </label>
 *     <label className="ml-4">
 *       <input type="checkbox" name="option2" /> Option 2
 *     </label>
 *   </div>
 * </LabelGroup>
 */
export const LabelGroup = <T extends 'label' | 'div' = 'label'>(props: LabelProps<T>) => {
  const {
    as,
    htmlFor,
    className,
    description,
    descriptionClassName,
    required = false,
    children,
  } = props;

  // Determine the tag to use
  const Tag = as || 'label';

  // Render component
  return (
    <Tag
      className={cn('block', className)}
      {...(Tag === 'label' && htmlFor ? { htmlFor } : {})}
    >
      {/* Render the label text if it exists */}
      {description && (
        <span
          className={cn(
            'mb-1.5 block text-sm font-bold',
            required && "after:ml-1 after:text-danger after:content-['*']",
            descriptionClassName,
          )}
        >
          {description}
        </span>
      )}

      {/* Render children (e.g., input elements) */}
      {children}
    </Tag>
  );
};
