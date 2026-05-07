import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export const Input = ({ sx, ...props }: TextFieldProps) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      size="small"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#8B1D23",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#8B1D23",
        },
        ...sx,
      }}
    />
  );
};
