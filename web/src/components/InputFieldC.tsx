import {
  ComponentWithAs,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input, Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { useField } from 'formik';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size,
  ...props
}) => {
  let InputOrTextArea: ComponentWithAs<any> = Input;
  if(textarea) {
    InputOrTextArea = Textarea;
  }
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="name">{label}</FormLabel>
      <InputOrTextArea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
