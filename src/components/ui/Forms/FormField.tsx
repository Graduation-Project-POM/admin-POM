import React from 'react';
import { Box, MenuItem } from '@mui/material';
import { Label } from '../label/Label';
import { Input } from '../input/Input';

interface FormFieldOption {
  label: string;
  value: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  options?: FormFieldOption[];
  error?: boolean;
  helperText?: string;
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
  options,
  error = false,
  helperText,
  children,
}) => {
  const isSelect = select || type === 'select' || Boolean(options);
  const inputType = type === 'select' || type === 'switch' ? 'text' : type;

  return (
    <Box sx={{ width: '100%' }}>
      <Label required={required}>{label}</Label>
      <Input
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        error={error}
        helperText={helperText}
        multiline={multiline}
        rows={rows}
        select={isSelect}
        slotProps={isSelect ? { select: {} } : undefined}
      >
        {options
          ? options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))
          : children}
      </Input>
    </Box>
  );
};
