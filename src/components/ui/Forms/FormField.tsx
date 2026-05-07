import React from 'react';
import { Box } from '@mui/material';
import { Label } from '../label/Label';
import { Input } from '../input/Input';

interface FormFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  multiline = false,
  rows = 1,
  select = false,
  children,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Label required={required}>{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        multiline={multiline}
        rows={rows}
        select={select}
        slotProps={select ? { select: {} } : undefined}
      >
        {children}
      </Input>
    </Box>
  );
};
