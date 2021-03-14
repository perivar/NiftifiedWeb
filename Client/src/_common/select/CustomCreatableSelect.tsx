import React, { useState } from 'react';
import { FieldProps } from 'formik';
import CreatableSelect from 'react-select/creatable';

// import { niftyService } from '../../_services/nifty.service';

interface Option {
  label: string;
  value: string;
}

interface CustomCreatableSelectProps extends FieldProps {
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  optionsMapper?: (obj: any) => Option;
  createOption?: (value: string) => Promise<any>;
  readOptions?: () => Promise<any>;
}

export const CustomCreatableSelect = ({
  className,
  placeholder,
  field,
  form,
  isMulti = false,
  optionsMapper: extOptionsMapper,
  createOption: extCreateOption,
  readOptions: extReadOptions
}: CustomCreatableSelectProps) => {
  // state
  const [value, setValue] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // mapper function
  const optionsMapper = (obj: any): Option => {
    if (extOptionsMapper) {
      return extOptionsMapper(obj);
    }
    return {
      label: obj.name,
      value: obj.id
    };
  };

  const handleChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);

    // set component value
    setValue(newValue);

    // and set formik field value
    console.log(`setting ${field.name} to ${newValue}`);
    form.setFieldValue(field.name, newValue);
    console.groupEnd();
  };

  const handleCreate = (inputValue: any) => {
    setLoading(true);
    console.group('Option to be created');
    console.log('Wait a moment...');
    console.groupEnd();

    if (extCreateOption) {
      // niftyService
      //   .createTag(inputValue)
      extCreateOption(inputValue)
        .then((res) => {
          console.group('Option created succesfully');
          const newOption = optionsMapper(res);
          console.log(newOption);

          // update option list
          const newOptions = [...options, newOption];
          setOptions(newOptions);

          // and update value list
          const newValues = isMulti ? [...value, newOption] : newOption;
          setValue(newValues);

          // and set formik field
          form.setFieldValue(field.name, newValues);
          console.groupEnd();

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // load tag options async
  React.useEffect(() => {
    setLoading(true);

    if (extReadOptions) {
      // niftyService
      //   .getTags()
      extReadOptions()
        .then((res) => {
          const tagData = res.map((obj: any) => {
            const newOption = optionsMapper(obj);
            return newOption;
          });
          setOptions(tagData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <CreatableSelect
      className={className}
      name={field.name}
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
};

export default CustomCreatableSelect;
