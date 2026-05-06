import type { ReactNode } from 'react';
import { cn } from '../config';

/** Types */
interface BaseLabelProps {
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  children: ReactNode;
}

interface LabelWithHtmlForProps extends BaseLabelProps {
  htmlFor: string;
}

interface LabelWithoutHtmlForProps extends BaseLabelProps {
  htmlFor?: undefined;
}

/** Union type to allow for both cases */
type LabelRadioProps = LabelWithHtmlForProps | LabelWithoutHtmlForProps;

/**
 * @description LabelRadio component that wraps radio inputs with a label.
 *
 * **Props**:
 * - `htmlFor` - The id of the input element this label is associated with.
 * - `className` - Additional class names to apply to the label.
 * - `description` - The description text for the label.
 * - `descriptionClassName` - Additional class names to apply to the description text.
 * - `children` - The content of the label, which can include text and input elements.
 *
 * @example
 * <LabelRadio description="Option 1">
 *   <input type="radio" id="option1" name="options" value="1" />
 * </LabelRadio>
 */
export const LabelRadio = (props: LabelRadioProps) => {
  const {
    htmlFor,
    className,
    description,
    descriptionClassName,
    children,
  } = props;

  // Render component
  return (
    <label
      htmlFor={htmlFor}
      className={cn('flex cursor-pointer items-start gap-2', className)}
    >
      {/* Render any other children (e.g., input elements) */}
      {children}

      {/* Render the label text if it exists */}
      {description && (
        <span className={cn('-mt-px leading-tight', descriptionClassName)}>
          {description}
        </span>
      )}
    </label>
  );
};
