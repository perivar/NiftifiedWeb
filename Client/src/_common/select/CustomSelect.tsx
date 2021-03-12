import React from 'react';
import { FieldProps } from 'formik';
import Select, { ValueType, OptionsType } from 'react-select';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  options: OptionsType<Option>;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
}

export const CustomSelect = ({ className, placeholder, field, form, options, isMulti = false }: CustomSelectProps) => {
  const onChange = (option: ValueType<Option | Option[], boolean>) => {
    form.setFieldValue(
      field.name,
      isMulti ? (option as Option[]).map((item: Option) => item.value) : (option as Option).value
    );
    form.setFieldTouched(field.name, true);
    form.setFieldError(field.name, undefined);
  };

  const getValue = () => {
    if (options) {
      const value = field.value ? field.value : '';
      return isMulti
        ? options.filter((option) => value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === value);
    }
    return isMulti ? [] : ('' as any);
  };

  return (
    <Select
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
    />
  );
};

export default CustomSelect;
