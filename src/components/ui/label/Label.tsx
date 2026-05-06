import { Typography } from "@mui/material";

export const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
      {children}
    </Typography>
  );
};
