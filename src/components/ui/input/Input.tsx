import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export const Input = (props: TextFieldProps) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      size="small"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      }}
    />
  );
};
