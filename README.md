# React Quick Form

A lightweight, high-performance form validation utility for Next.js and React. Unlike full UI kits, Quick Forms focuses on providing **hooks**, **validation logic**, and **error display components** that you can integrate into *any* existing component library (like shadcn/ui, MUI, or your own custom inputs).

It leverages native browser validation APIs (`ValidityState`) to provide a modern, developer-friendly interface without replacing server-side validation.

## Core Philosophy

- **Bring Your Own Components**: Use our hooks and `FieldError` with any input element.
- **Native-First**: Built on the browser's `ValidityState` API for performance and accessibility.
- **Client-Side Focus**: Handles immediate feedback for users; works alongside your server-side validation.
- **Non-Intrusive**: Small footprint, zero-dependency (other than React and Tailwind).
- **Core Essentials**: All you need are the **hooks**, the **`FieldError` component**, and the **exported types** to build your own robust and accessible form components.

---

## Installation

Copy the utility into your project using one of the following methods:

### Full Installation
Includes all components, hooks, utilities, and Tailwind styles.

**Default path (`src/react-quick-form`):**
```bash
git clone --depth 1 https://github.com/Geancarlo-Cojocaru/react-quick-form.git src/react-quick-form && rm -rf src/react-quick-form/.git
```

**Custom path:**
```bash
git clone --depth 1 https://github.com/Geancarlo-Cojocaru/react-quick-form.git your/custom/path && rm -rf your/custom/path/.git
```

### Barebones Installation
Includes only the core logic: Hooks, Types, Config, and the `FieldError` component. Ideal if you want to build your own UI components from scratch.

```bash
mkdir -p src/react-quick-form && cd src/react-quick-form && \
git init && \
git remote add origin https://github.com/Geancarlo-Cojocaru/react-quick-form.git && \
git config core.sparseCheckout true && \
echo "hooks/" >> .git/info/sparse-checkout && \
echo "types/" >> .git/info/sparse-checkout && \
echo "utils/" >> .git/info/sparse-checkout && \
echo "config.ts" >> .git/info/sparse-checkout && \
echo "components/FieldError.tsx" >> .git/info/sparse-checkout && \
git pull --depth 1 origin main && \
rm -rf .git && cd -
```

---

## Project Structure

```text
react-quick-form/
├── components/                     # Pre-built accessible form components
│   ├── FieldError.tsx              # Core validation message display
│   ├── Input.tsx                   # Custom text/email/number input
│   ├── InputGroup.tsx              # Custom input with prefix/suffix slots
│   ├── Select.tsx                  # Custom select
│   ├── SwitchInput.tsx             # Toggle/Switch checkbox
│   ├── Textarea.tsx                # Custom textarea
│   ├── LabelGroup.tsx              # Label wrapper for inputs
│   └── LabelRadio.tsx              # Styled radio/checkbox wrapper
├── hooks/                          # Core logic for validation and state
│   ├── useValidityState.ts         # Tracks native ValidityState
│   ├── useTriggerCustomError.ts    # Manual setCustomValidity trigger
│   ├── useDetectUserInvalid.ts     # Tracks user interaction/blur
│   └── ...
├── utils/                          # Form data and string helpers
│   ├── transformFormData.ts        # FormData to Object conversion
│   └── replacePlaceholders.ts      # Error message parsing
├── styles/                         # Tailwind CSS v4 style definitions
│   ├── forms.css                   # Base component styles
│   ├── theme.css                   # Theme variables extension
│   └── colors.css                  # Default color palette
├── types/                          # TypeScript interfaces
└── config.ts                       # Default error messages and settings
```

---

## 1. FieldError Component

The `FieldError` component is the heart of the library. It displays validation messages based on an element's `ValidityState`.

### Key Features
- **Automatic Messages**: Provides default messages for all standard HTML validation attributes.
- **Custom Overrides**: Use the `errorMsg` prop to provide specific messages for specific errors. You can modify defaults in place by passing an object to `errorMsg`.
- **Supported Error Keys**:
  - `valueMissing`: When a `required` field is empty.
  - `tooShort` / `tooLong`: Based on `minLength` and `maxLength`.
  - `rangeUnderflow` / `rangeOverflow`: Based on `min` and `max`.
  - `stepMismatch`: Based on `step`.
  - `typeMismatch`: For `email` or `url` types.
  - `patternMismatch`: Based on `pattern`.
  - `badInput`: For invalid number inputs.
  - `customError`: Triggered via `setCustomValidity`.
- **Placeholder Support**: Messages can include placeholders like `{minLength}`, `{maxLength}`, `{min}`, `{max}` which are automatically replaced with the attribute values.
- **Strategies**: 
  - `hook` (default for standalone): Uses `useDetectUserInvalid` to show errors only after interaction.
  - `peer`: Uses CSS `:invalid` and peer selectors for zero-JS UI updates (requires the input to have the `peer` class).

### Usage with Custom Inputs
To build your own input, pass the `ref` of your input element to `FieldError`.

```tsx
import { useRef } from 'react';
import { FieldError } from '@/react-quick-form/components/FieldError';

export function MyCustomInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <input 
        ref={inputRef}
        required 
        minLength={5}
        className="peer border rounded p-2" 
      />
      {/* FieldError listens to the ref's validity state. 
          Use 'peer' strategy for CSS-only display or 'hook' (default) for JS-based detection. */}
      <FieldError 
        elementRef={inputRef} 
        strategy="peer"
        errorMsg={{
          // If you want a custom message instead of the default
          tooShort: "Input is too short"
        }}
      />
    </div>
  );
}
```

#### Handling Checkbox/Radio Groups
When using `FieldError` with a required radio or checkbox group, use the `key` prop to force a re-render when the selection changes. This ensures the validity state is updated correctly.

```tsx
const [selected, setSelected] = useState('');
const radioRef = useRef<HTMLInputElement>(null);

return (
  <div>
    <input ref={radioRef} type="radio" name="options" value="1" required onChange={(e) => setSelected(e.target.value)} />
    <input type="radio" name="options" value="2" required onChange={(e) => setSelected(e.target.value)} />
    
    <FieldError key={selected} elementRef={radioRef} />
  </div>
);
```

### Advanced: Custom Validation with `useTriggerCustomError`
For validation logic that goes beyond native HTML attributes (like password matching or server-side errors), use `useTriggerCustomError` in combination with `FieldError`.

```tsx
import { useRef } from 'react';
import { FieldError, useTriggerCustomError } from '@/react-quick-form';

export function ComplexInput({ serverError }) {
  const inputRef = useRef<HTMLInputElement>(null);

  // This hook calls setCustomValidity() on the element
  useTriggerCustomError({
    ref: inputRef,
    errorMessage: serverError, // The message to show
    compare: serverError ? true : false, // Trigger error if serverError exists
  });

  return (
    <>
      <input ref={inputRef} className="peer ..." />
      <FieldError 
        elementRef={inputRef} 
        errorMsg={{ customError: serverError }} 
      />
    </>
  );
}
```

---

## 2. Core Hooks

### `useTriggerCustomError`
The most powerful hook for custom validation. It sets a custom validity message on the element (via `setCustomValidity`), which then triggers the `customError` state in `FieldError`.

**Parameters:**
- `ref`: React ref to the input element.
- `errorMessage`: The message to set if validation fails.
- `compare`: 
  - If a **function**: returns `true` to trigger the error.
  - If a **string/number**: triggers an error if it strictly matches the input value.
  - If **boolean**: triggers error if `true`.
- `value`: (Optional) Pass the state value if using a controlled component.

```tsx
useTriggerCustomError({
  ref: inputRef,
  errorMessage: "Passwords must match",
  compare: (val) => val !== passwordConfirmation, 
});
```

### `useValidityState`
Extracts the current `ValidityState` from an element ref, allowing you to react to validation changes in JavaScript.

### `useDetectUserInvalid`
A utility hook that determines if a field is "dirty" or "touched" enough to show an error, avoiding showing red borders on empty forms.

---

## 4. Form Submission

Quick Forms work best with standard HTML form submission patterns. Use the native `checkValidity()` method to trigger validation UI before processing the data.

```tsx
import { SubmitEvent, useRef } from 'react';
import { formDataToObject } from '@/react-quick-form/utils/transformFormData';

export function MyForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    // Trigger native validation UI and check if form is valid
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const data = formDataToObject(formData);
      
      console.log("Form data is valid:", data);
      // Proceed with API call or Server Action
    } else {
      console.log("Form contains validation errors.");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {/* ... your inputs ... */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

> **Note**: Adding `noValidate` to the `<form>` tag prevents the browser's default validation bubbles from appearing, allowing `FieldError` to handle the display of errors while still using the native `checkValidity()` logic.

---

## 5. Bonus: Ready-to-use Components

While you can use the hooks and `FieldError` independently, we provide a set of pre-styled components (Tailwind-based) that integrate everything. These are considered **bonus** elements to speed up development if you use our styling system.

### `Input` Component
The `Input` component is a powerful wrapper around the native HTML input.

**Key Features:**
- **Automatic Validation**: Integrated with `FieldError`.
- **Custom Validation**: Use the `compare` prop for logic like "must match password" or server-side error matching.
- **Flexible Display**: Use `showError={false}` to display the error message elsewhere.

#### 1. Basic Validation
```tsx
// If the text length is less than the required length 
// the default error message will be:
// 'The field must be at least 5 characters long.'
<Input
  type="text"
  required
  minLength={5}
/>
```

#### 2. External Error Display
Useful for complex layouts where the error message isn't directly below the input.
```tsx
const inputRef = useRef<HTMLInputElement>(null);

return (
  <div>
    <Input ref={inputRef} required showError={false} />
    {/* ... other elements ... */}
    <FieldError elementRef={inputRef} strategy="hook" />
  </div>
)
```

#### 3. Server-side Validation / Custom Logic
Use the `compare` prop. It triggers a `customError` whenever the comparison is truthy.
```tsx
// Simple comparison
<Input
  compare="not good" 
  errorMsg={{ customError: "This value is invalid" }}
/>

// Functional comparison
<Input
  compare={(val) => val.length > 0 && val.length < 10}
  errorMsg={{ customError: "Must be at least 10 characters" }}
/>

// Integration with useActionState
const [formState, formAction] = useActionState(/* your code */);

<Input
  compare={formState?.prevValues?.username}
  errorMsg={{ customError: formState?.errors?.username }}
/>
```

### Other Bonus Components

#### `Select`
Standard select wrapper with built-in `FieldError`.

```tsx
<Select 
  required 
  // Optional, if you want to overwrite the default error
  // message for valueMissing
  errorMsg={{ valueMissing: "Please select an option" }}
>
  <option value="">Choose an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
```

#### `Textarea`
Standard textarea wrapper with built-in `FieldError`.

```tsx
<Textarea 
  required 
  minLength={10}
  placeholder="Enter your message..."
  // Optional, if you want to overwrite the default error
  // message for tooShort
  errorMsg={{ tooShort: "Message must be at least {minLength} characters" }}
/>
```

#### `InputGroup`
Adds `before` and `after` slots for prefixes and suffixes (e.g., currency symbols or icons).

```tsx
<InputGroup 
  type="number" 
  after="€" 
  placeholder="0.00"
  required 
/>

<InputGroup 
  type="text" 
  before={<SearchIcon className="size-4" />} 
  placeholder="Search..." 
/>
```

#### `LabelGroup` & `LabelRadio`
Utilities for structural layout and accessibility.

```tsx
// LabelGroup for block-level labeling
<LabelGroup description="Bio" required>
  <Textarea name="bio" required />
</LabelGroup>

// LabelRadio for radio/checkbox items
<LabelGroup as="div" description="Choose one" required>
  <div className="flex flex-col gap-2">
    <LabelRadio description="Option A">
      <input type="radio" name="choice" value="a" required />
    </LabelRadio>
    <LabelRadio description="Option B">
      <input type="radio" name="choice" value="b" required />
    </LabelRadio>
  </div>
</LabelGroup>
```

#### `SwitchInput`
A styled toggle component that wraps a checkbox. Supports binary values (e.g., "yes"/"no" instead of true/false).

```tsx
// Basic usage
<SwitchInput name="notifications" defaultChecked />

// Required toggle with custom error
<SwitchInput 
  name="terms" 
  required 
  errorMsg={{ valueMissing: "You must accept the terms" }} 
/>

// Using binary values
<SwitchInput 
  name="status" 
  binaryValue={["active", "inactive"]} 
  defaultChecked={false} 
/>
```

---

## 6. Bonus: Form Data Utilities

Tools for handling standard HTML Form submissions:
- `formDataToObject`: Converts `FormData` to a JS object (handles multi-select/checkboxes as arrays).
- `formDataSerialize`: Creates a URL-encoded string (skips files).
- `objectToFormData`: Reverse transformation for API calls.

## 7. Bonus: Styling

To include the styles and ensure Tailwind CSS v4 scans the `react-quick-form` directory for class names, add the following to your global CSS file (e.g., `styles/globals.css`):

```css
/* 
  1. Base Colors (Optional)
  If you don't have these colors defined in your project, import our defaults.
  These variables (e.g., --v-primary, --v-danger) are used by the form styles.
*/
@import "../react-quick-form/styles/colors.css" layer(base);

/* 
  2. Theme Extension (Recommended)
  Extends the @theme block with form-specific variables (colors, masks, icons).
*/
@import "../react-quick-form/styles/theme.css";

/* 3. Form Component Styles */
@import "../react-quick-form/styles/forms.css";

/* Include the react-quick-form directory in Tailwind's scan */
@source "../react-quick-form/**/*.{js,ts,jsx,tsx}";
```

Alternatively, if you are still using Tailwind CSS v3, include the directory in your `tailwind.config.js`:
```javascript
content: [
  "./react-quick-form/**/*.{js,ts,jsx,tsx}",
]
```
And import the CSS file in your main entry point.
