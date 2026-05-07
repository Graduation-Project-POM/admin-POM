import {
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Input } from "../input/Input";
import { Label } from "../label/Label";

const PRIMARY_COLOR = "#8B1D23";
type FieldType = "text" | "email" | "password" | "select" | "switch";

interface Option {
  label: string;
  value: string;
}

interface Props {
  type: FieldType;
  label: string;
  name: string;
  value: any;
  onChange: any;
  required?: boolean;
  options?: Option[];
}

export const FormField = ({
  type,
  label,
  name,
  value,
  onChange,
  required,
  options = [],
}: Props) => {
  if (type === "switch") {
    return (
      <Box sx={{ display: "flex", alignItems: "flex-end", pb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={(e, checked) =>
                onChange({
                  target: {
                    name,
                    value: checked,
                  },
                })
              }
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#8B1D23",
                  "&:hover": {
                    backgroundColor: "rgba(139, 29, 35, 0.08)",
                  },
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#8B1D23",
                },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {label}
            </Typography>
          }
        />
      </Box>
    );
  }

  return (
    <Box>
      <Label required={required}>{label}</Label>

      <Input
        name={name}
        type={type === "select" ? undefined : type}
        value={value}
        onChange={onChange}
        select={type === "select"}
        required={required}
        multiline={name === "bio"}
        minRows={name === "bio" ? 3 : 1}
        maxRows={name === "bio" ? 8 : 1}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: PRIMARY_COLOR,
          },
        }}
      >
        {type === "select" &&
          options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
      </Input>
    </Box>
  );
};
