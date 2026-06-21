import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Alert, Chip, TextField, Paper, Divider } from '@mui/material';
import { FileText, Camera, Upload, X, Send } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  submitSolution,
  difficultyIdToLabel,
  type BackendProblem,
} from '../../../services/problemService';

interface SubmitSolutionModalProps {
  open: boolean;
  onClose: () => void;
  problem: BackendProblem | null;
  onSubmitted: (problemId: number) => void;
}

export const SubmitSolutionModal = ({ open, onClose, problem, onSubmitted }: SubmitSolutionModalProps) => {
  const { t } = useTranslation();
  const [solutionText, setSolutionText] = useState('');
  const [solutionImage, setSolutionImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSolutionText('');
      setSolutionImage(null);
      setError(null);
    }
  }, [open, problem]);

  if (!problem) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSolutionImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!solutionText.trim() && !solutionImage) {
      setError(t('student.problems.submit.provideAtLeastOne'));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitSolution(problem.id, {
        solutionText: solutionText.trim() || undefined,
        photoFileKey: solutionImage || undefined,
      });
      onSubmitted(problem.id);
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError(t('student.problems.submit.alreadySubmitted'));
      } else {
        setError(getApiErrorMessage(err, t('student.problems.submit.error')));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const difficulty = difficultyIdToLabel(problem.difficulty);

  return (
    <ModalWrapper open={open} onClose={onClose} title={t('student.problems.submit.title')} maxWidth="md">
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {problem.title}
          </Typography>
          <Chip
            label={difficulty}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: difficulty === 'Easy' ? '#e7f7ec' : difficulty === 'Medium' ? '#fff7e0' : '#fdecec',
              color: difficulty === 'Easy' ? '#166534' : difficulty === 'Medium' ? '#92400e' : '#991b1b',
            }}
          />
          <Chip label={problem.topic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
        </Box>
        {problem.statement && (
          <Typography sx={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {problem.statement}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Text solution */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileText size={16} color="#8B1D23" />
          {t('student.problems.submit.textSolution')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '13px' }}>
          {t('student.problems.submit.textSolutionHint')}
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder={t('student.problems.submit.solutionPlaceholder')}
          value={solutionText}
          onChange={(e) => setSolutionText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': { borderColor: '#e5e7eb' },
              '&.Mui-focused fieldset': { borderColor: '#8B1D23', borderWidth: '1.5px' },
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Camera size={16} color="#8B1D23" />
          {t('student.problems.submit.imageSolution')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '13px' }}>
          {t('student.problems.submit.imageSolutionHint')}
        </Typography>

        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

        {solutionImage ? (
          <Box>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <img src={solutionImage} alt={t('student.problems.submit.imageAlt')} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }} />
            </Paper>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Button variantType="outline" size="small" startIcon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()} sx={{ flex: 1 }}>
                {t('student.problems.submit.replaceImage')}
              </Button>
              <Button variantType="danger" size="small" startIcon={<X size={14} />} onClick={() => setSolutionImage(null)} sx={{ flex: 1 }}>
                {t('student.problems.submit.remove')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: '#fafafa',
              borderRadius: '12px',
              border: '2px dashed #e5e7eb',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: '#8B1D23', bgcolor: '#fef2f2' },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Typography sx={{ fontWeight: 600, color: '#64748b', mb: 0.5 }}>
              {t('student.problems.submit.clickToUpload')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '12px' }}>
              {t('student.problems.submit.uploadHint')}
            </Typography>
          </Paper>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '13px' }}>
          {!solutionText.trim() && !solutionImage
            ? t('student.problems.submit.provideAtLeastOne')
            : t('student.problems.submit.readyToSubmit')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variantType="outline" onClick={onClose} type="button">
            {t('student.problems.submit.cancel')}
          </Button>
          <Button
            variantType="default"
            startIcon={<Send size={16} />}
            onClick={handleSubmit}
            disabled={submitting || (!solutionText.trim() && !solutionImage)}
          >
            {submitting ? t('common.loading') : t('student.problems.submit.submitButton')}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default SubmitSolutionModal;
