import { useRef, useState } from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { ImagePlus, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button/Button';
import { resolveMediaUrl } from '../../utils/media';

interface CommentComposerProps {
  onSubmit: (body: string, photo: string | null) => Promise<void>;
  onCancel?: () => void;
  placeholder: string;
  submitLabel: string;
  initialBody?: string;
  initialPhoto?: string | null;
  autoFocus?: boolean;
  compact?: boolean;
}

export const CommentComposer = ({
  onSubmit,
  onCancel,
  placeholder,
  submitLabel,
  initialBody = '',
  initialPhoto = null,
  autoFocus = false,
  compact = false,
}: CommentComposerProps) => {
  const { t } = useTranslation();
  const [body, setBody] = useState(initialBody);
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = !body.trim() && !photo;

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSubmit = async () => {
    if (isEmpty || busy) return;
    setBusy(true);
    try {
      await onSubmit(body.trim(), photo);
      setBody('');
      setPhoto(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <TextField
        multiline
        minRows={compact ? 2 : 3}
        fullWidth
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        slotProps={{ htmlInput: { maxLength: 4000 } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: '#fff',
            fontSize: compact ? '14px' : '15px',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&.Mui-focused fieldset': { borderColor: '#8B1D23', borderWidth: '1.5px' },
          },
        }}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePick}
        style={{ display: 'none' }}
      />

      {photo && (
        <Paper
          elevation={0}
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            bgcolor: '#f8fafc',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <img
            src={resolveMediaUrl(photo) ?? undefined}
            alt={t('discussion.attachmentAlt')}
            style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, display: 'block' }}
          />
          <Button
            variantType="ghost"
            size="small"
            onClick={() => setPhoto(null)}
            sx={{ minWidth: 'auto', p: 0.5 }}
            aria-label={t('discussion.removeImage')}
          >
            <X size={16} />
          </Button>
        </Paper>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
        <Button
          variantType="outline"
          size="small"
          startIcon={<ImagePlus size={14} />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ fontSize: '12px' }}
        >
          {t('discussion.attachImage')}
        </Button>
        <Box sx={{ flex: 1 }} />
        {onCancel && (
          <Button variantType="ghost" size="small" onClick={onCancel} disabled={busy} sx={{ fontSize: '12px' }}>
            {t('discussion.cancel')}
          </Button>
        )}
        <Button
          variantType="default"
          size="small"
          startIcon={<Send size={14} />}
          onClick={() => void handleSubmit()}
          disabled={isEmpty || busy}
          sx={{ fontSize: '12px' }}
        >
          {busy ? t('discussion.sending') : submitLabel}
        </Button>
      </Box>

      {body.length > 3800 && (
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
          {t('discussion.charactersLeft', { count: 4000 - body.length })}
        </Typography>
      )}
    </Box>
  );
};

export default CommentComposer;
