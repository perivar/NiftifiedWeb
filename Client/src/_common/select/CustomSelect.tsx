/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import Select, { ValueType, OptionsType, OptionTypeBase } from 'react-select';
import { isMobile } from 'react-device-detect';

interface Option {
  label: string;
  value: number;
}

interface CustomSelectProps extends OptionTypeBase {
  options: OptionsType<Option>;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (option: ValueType<Option | Option[], boolean>) => void;
}

export const CustomSelect = ({
  name,
  defaultValue,
  options,
  isMulti = false,
  isSearchable = true,
  className,
  placeholder,
  onChange: onExternalChange
}: CustomSelectProps) => {
  const onChange = (option: ValueType<Option | Option[], boolean>) => {
    if (onExternalChange) onExternalChange(option);
  };

  const onMobileChange = (event: React.ChangeEvent<HTMLSelectElement> | undefined) => {
    if (event && event.target) {
      const valueArray = Array.from(event.target.selectedOptions, (option) => Number(option.value));
      const selectedOptions = getSelectedOptions(valueArray);
      if (selectedOptions) {
        if (onExternalChange) {
          return isMulti ? onExternalChange(selectedOptions) : onExternalChange(selectedOptions[0]);
        }
      }
    }
  };

  const getSelectedOptions = (value: number[]) => {
    if (options) {
      const selOption = options.filter((option) => value.indexOf(option.value) >= 0);
      return selOption;
    }
    return [];
  };

  const getDefaultValues = () => {
    const defaultValues =
      isMulti && Array.isArray(defaultValue)
        ? defaultValue.map((valueElement) => valueElement.value)
        : defaultValue.value;
    // if multi, always return an array
    return isMulti ? [defaultValues] : defaultValues;
  };

  return isMobile ? (
    <select
      className={`form-control form-select${className ? ` ${className}` : ''}`}
      name={name}
      defaultValue={getDefaultValues()}
      onChange={onMobileChange}
      multiple={isMulti}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <Select
      className={className}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isSearchable={isSearchable}
    />
  );
};

export default CustomSelect;
