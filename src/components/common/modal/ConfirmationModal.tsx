import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  styled,
} from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button/Button';
import { statusTone } from '../../../theme';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(1),
    maxWidth: '420px',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
}));

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDanger = true,
}) => {
  const { t } = useTranslation();
  const titleId = 'confirm-title';
  const messageId = 'confirm-message';

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <DialogTitle id={titleId} component="div" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isDanger && (
            <Box
              aria-hidden
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: statusTone.danger.bg,
                color: statusTone.danger.fg,
                flexShrink: 0,
              }}
            >
              <AlertCircle size={22} />
            </Box>
          )}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id={messageId}
          sx={{ color: 'text.secondary', fontSize: '15px', lineHeight: 1.65 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variantType="outline" onClick={onClose}>
          {cancelLabel ?? t('buttons.cancel')}
        </Button>
        <Button
          variantType={isDanger ? 'danger' : 'default'}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel ?? t('buttons.confirm')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
