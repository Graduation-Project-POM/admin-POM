import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { neutral } from '../../../theme';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
};

export const ModalWrapper: React.FC<Props> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
}) => {
  const { t } = useTranslation();
  const titleId = "modal-title";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      // Names the dialog for screen readers instead of leaving it anonymous.
      aria-labelledby={title ? titleId : undefined}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(6px)",
          },
        },
        paper: {
          sx: {
            m: { xs: 2, sm: 4 },
            width: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
            maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
          },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2,
          borderBottom: `1px solid ${neutral[200]}`,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ minWidth: 0 }}>
          {title}
        </Typography>

        <IconButton onClick={onClose} aria-label={t("buttons.close")} edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5, borderColor: neutral[200] }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
