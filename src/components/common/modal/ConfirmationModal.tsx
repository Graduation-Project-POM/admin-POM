import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  Alert,
  styled,
} from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button/Button';
import { statusTone } from '../../../theme';
import { getApiErrorMessage } from '../../../utils/apiError';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * May return a promise. The dialog waits for it: on success it closes,
   * on failure it stays open and shows the error message inside itself.
   */
  onConfirm: () => void | Promise<unknown>;
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    setError(null);
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, t('common.actionFailed', 'Action failed')));
    } finally {
      setBusy(false);
    }
  };

  const titleId = 'confirm-title';
  const messageId = 'confirm-message';

  return (
    <StyledDialog
      open={open}
      onClose={busy ? undefined : onClose}
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
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variantType="outline" onClick={onClose} disabled={busy}>
          {cancelLabel ?? t('buttons.cancel')}
        </Button>
        <Button
          variantType={isDanger ? 'danger' : 'default'}
          onClick={() => void handleConfirm()}
          disabled={busy}
        >
          {busy ? t('common.loading') : confirmLabel ?? t('buttons.confirm')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
