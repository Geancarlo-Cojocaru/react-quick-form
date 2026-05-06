'use client';

import { useRef, useState, SubmitEvent } from 'react';
import { Input } from '../components/Input';
import { InputGroup } from '../components/InputGroup';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { FieldError } from '../components/FieldError';
import { SwitchInput } from '../components/SwitchInput';
import { LabelGroup } from '../components/LabelGroup';
import { LabelRadio } from '../components/LabelRadio';

/**
 * @description Example of how to use the form elements.
 * Render it in a page.
 */
export const QuickFormExample = () => {
  // Server value mock
  const serverErrorMock = 'taco';

  const radioRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [radioState, setRadioState] = useState<string>('');
  const [checkboxState, setCheckboxState] = useState<string>('');

  // Simple submission handler
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    (e.target as HTMLFormElement).checkValidity();
  };

  // Render component
  return (
    <>
      {/* INPUTS */}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 xl:p-8"
      >
        {/* Title */}
        <div className="col-span-full mt-3 mb-1 border-b border-input pb-5 xl:mb-0">
          <h1 className="mb-2 text-3xl">Input elements</h1>
          <p>
            Play with all the input fields: write, clear, change, etc!
            Also, at lease once, submit the form without completing anything!
          </p>
        </div>

        {/* Simple text input with minLength and maxLength */}
        <LabelGroup
          as="div"
          required
          description="Text input"
        >
          <Input
            required
            minLength={6}
            maxLength={16}
            type="text"
            name="test-minLength"
            placeholder="Enter 3 characters"
          />
        </LabelGroup>

        {/* Number input with min and max */}
        <LabelGroup
          as="div"
          required
          description="Number input"
        >
          <Input
            required
            min={10}
            max={9999}
            type="number"
            name="test-minMax"
            placeholder="Min 10, max 9999"
          />
        </LabelGroup>

        {/* Email input */}
        <LabelGroup
          as="div"
          description="Email input"
        >
          <Input
            type="email"
            name="test-email"
            placeholder="Enter email"
          />
        </LabelGroup>

        {/* URL input */}
        <LabelGroup
          as="div"
          description="URL input"
        >
          <Input
            type="url"
            name="test-url"
            placeholder="Enter url"
          />
        </LabelGroup>

        {/* Tel input with a pattern for phone number */}
        <LabelGroup
          as="div"
          description="Tel input"
        >
          <Input
            pattern="^(?:[+]?(?:[\s\(\)\.\-]*\d){7,15}[\s\(\)\.\-]*)$"
            type="tel"
            name="test-phone"
            placeholder="Ex: + 40 721 123 456"
          />
        </LabelGroup>

        {/* Input with a custom pattern for the credit card number */}
        <LabelGroup
          as="div"
          required
          description="Credit card number"
        >
          <Input
            required
            pattern="^\d{4}\s\d{4}\s\d{4}\s\d{4}$"
            type="text"
            name="test-patern"
            placeholder="Ex: 1234 5678 9012 3456"
            errorMsg={{ patternMismatch: 'Please enter a valid card number' }}
          />
        </LabelGroup>

        {/* Input with a custom error message */}
        <LabelGroup
          as="div"
          description="Server error message test"
        >
          <Input
            type="text"
            name="test-customError"
            placeholder="Type 'taco' to trigger error"
            errorMsg={{ customError: `You didn't say the magic word "${serverErrorMock}"!` }}
            compare={serverErrorMock}
          />
        </LabelGroup>

        {/* Search input */}
        <LabelGroup
          as="div"
          description="Search input"
        >
          <Input
            type="search"
            name="test-search"
            placeholder="Search something..."
          />
        </LabelGroup>

        {/* Date input */}
        <LabelGroup
          as="div"
          description="Date input"
        >
          <Input
            type="date"
            name="test-date"
            min="2020-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
        </LabelGroup>

        {/* Group input */}
        <LabelGroup
          required
          as="div"
          description="Group input"
        >
          <InputGroup
            required
            type="number"
            step="0.01"
            name="test-group"
            after="euro"
            placeholder="Enter amount"
            errorMsg={{ valueMissing: 'Please enter an amount' }}
            className="pr-10"
          />
        </LabelGroup>

        {/* Radio inputs required */}
        <LabelGroup
          as="div"
          required
          description="Radio inputs required"
        >
          <div className="mt-3 flex flex-col items-start gap-1.5">
            <LabelRadio
              description="Should I stay?"
            >
              <Input
                ref={radioRef}
                required
                type="radio"
                name="test-radio-1"
                defaultValue="radio-option-1"
                showError={false}
                onChange={(e) => setRadioState(e.target.value)}
                className="shrink-0"
              />
            </LabelRadio>

            <LabelRadio
              description="Or should I go?"
            >
              <Input
                required
                type="radio"
                name="test-radio-1"
                defaultValue="radio-option-2"
                showError={false}
                onChange={(e) => setRadioState(e.target.value)}
                className="shrink-0"
              />
            </LabelRadio>
          </div>

          <FieldError
            key={radioState}
            elementRef={radioRef}
          />
        </LabelGroup>

        {/* Checkbox inputs required */}
        <LabelGroup
          as="div"
          required
          description="Checkbox input required"
        >
          <div className="mt-2.5 flex items-start gap-4 xl:pr-8">
            <LabelRadio
              description="Do you agree with terms and conditions?"
            >
              <Input
                ref={checkboxRef}
                required
                type="checkbox"
                name="test-checkbox-1"
                defaultValue="checkbox-option-1"
                showError={false}
                onChange={(e) => setCheckboxState(e.target.value)}
                className="shrink-0"
              />
            </LabelRadio>
          </div>
          <FieldError
            key={checkboxState}
            elementRef={checkboxRef}
            errorMsg={{ valueMissing: 'Sorry, you can\'t proceed without agreeing!' }}
          />
        </LabelGroup>

        <div className="col-span-full mt-2">
          <button
            type="submit"
            className="inline-block min-w-30 cursor-pointer rounded-sm border-transparent bg-primary px-7 py-2.5 text-white"
          >
            Submit
          </button>
        </div>
      </form>

      {/* SELECT AND TEXTAREA */}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 xl:p-8"
      >
        {/* Title */}
        <div className="col-span-full mt-3 mb-1 border-b border-input pb-5 xl:mb-0">
          <h1 className="mb-2 text-3xl">Select and textarea elements</h1>
          <p>
            At lease once, submit the form without completing anything!
          </p>
        </div>

        {/* Select single required */}
        <LabelGroup
          as="div"
          required
          description="Select single required"
        >
          <Select
            required
            name="test-select-1"
            defaultValue=""
          >
            <option value="" disabled>Choose an option</option>
            <option value="option-1">Option 1</option>
            <option value="option-2">Option 2</option>
            <option value="option-3">Option 3</option>
          </Select>
        </LabelGroup>

        {/* Select multiple required */}
        <LabelGroup
          as="div"
          required
          description="Select multiple required"
        >
          <Select
            required
            multiple
            name="test-select-3"
            defaultValue={[]}
            size={3}
          >
            <option value="option-1">Option 1</option>
            <option value="option-2">Option 2</option>
            <option value="option-3">Option 3</option>
          </Select>
        </LabelGroup>

        {/* Textarea required */}
        <LabelGroup
          as="div"
          required
          description="Textarea required"
        >
          <Textarea
            required
            name="test-textarea-1"
            placeholder="Enter at least 10 characters"
            minLength={10}
            maxLength={200}
            className="field-sizing-content resize-none"
          />
        </LabelGroup>

        <div className="col-span-full mt-2">
          <button
            type="submit"
            className="inline-block min-w-30 cursor-pointer rounded-sm border-transparent bg-primary px-7 py-2.5 text-white"
          >
            Submit
          </button>
        </div>
      </form>

      {/* SWITCH INPUT */}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 xl:p-8"
      >
        {/* Title */}
        <div className="col-span-full mt-3 mb-1 border-b border-input pb-5 xl:mb-0">
          <h1 className="mb-2 text-3xl">Switch input</h1>
          <p>
            Play with the switch element: toggle on, toggle off, etc!
          </p>
        </div>

        {/* Switch, not required */}
        <LabelGroup
          as="div"
          description="Switch not required"
        >
          <div className="flex items-center justify-between border-t py-2">
            <span className="text-sm">Some option to config</span>
            <SwitchInput name="test-switch-2" />
          </div>
          <div className="flex items-center justify-between border-t py-2">
            <span className="text-sm">Another option to config</span>
            <SwitchInput name="test-switch-3" />
          </div>
          <div className="flex items-center justify-between border-t py-2">
            <span className="text-sm">Last config option</span>
            <SwitchInput name="test-switch-4" />
          </div>
        </LabelGroup>

        {/* Switch, required */}
        <LabelGroup
          as="div"
          required
          description="Switch required"
        >
          <SwitchInput
            required
            name="test-switch-1"
            errorMsg={{ valueMissing: 'You must turn this switch on to proceed' }}
          />
        </LabelGroup>

        <div className="col-span-full mt-2">
          <button
            type="submit"
            className="inline-block min-w-30 cursor-pointer rounded-sm border-transparent bg-primary px-7 py-2.5 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
