import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

/**
 * Thin wrapper over MUI's TextField with the app's defaults.
 *
 * The outlined-input treatment (radius, border ramp, brand focus ring, the
 * disabled and placeholder colours) now lives in the theme, so every plain
 * TextField in the app matches this one instead of only the fields that
 * happened to go through this component.
 */
export const Input = ({ sx, ...props }: TextFieldProps) => {
  return <TextField variant="outlined" fullWidth size="small" {...props} sx={sx} />;
};
