import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  TextField,
} from '@mui/material';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { resolveMediaUrl } from '../../../utils/media';
import type { ProblemSubmission } from '../../../services/problemsService';

interface SolutionDetailModalProps {
  open: boolean;
  onClose: () => void;
  submission: ProblemSubmission | null;
  problemTitle: string;
  onSaveMark: (submissionId: number, score: number, feedback: string) => void;
  saving?: boolean;
}

export const SolutionDetailModal = ({
  open,
  onClose,
  submission,
  problemTitle,
  onSaveMark,
  saving = false,
}: SolutionDetailModalProps) => {
  const { t } = useTranslation();
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    setScore(submission?.score ?? 0);
    setFeedback(submission?.feedback ?? '');
  }, [submission]);

  if (!submission) return null;

  const graded = submission.gradedAt != null || submission.score != null;
  const photoUrl = resolveMediaUrl(submission.solutionPhotoUrl ?? '');

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`${submission.studentName} - ${problemTitle}`}
      maxWidth="sm"
    >
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{t('trainer.solutionDetail.status')}</Typography>
            <Chip
              label={
                graded
                  ? t('trainer.studentProgress.graded', 'Graded')
                  : t('trainer.studentProgress.pending', 'Pending')
              }
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '11px',
                bgcolor: graded ? '#e7f7ec' : '#fef3c7',
                color: graded ? '#166534' : '#92400e',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{t('trainer.solutionDetail.score')}</Typography>
            <input
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              style={{
                width: '60px',
                padding: '6px 8px',
                borderRadius: '8px',
                border: '1.5px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
            <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>/ 100</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', mb: 1.5 }}>{t('trainer.solutionDetail.solution')}</Typography>

        {submission.solutionText ? (
          <Box sx={{
            p: 2.5,
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            mb: 2,
            fontFamily: 'monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            color: '#334155',
          }}>
            {submission.solutionText}
          </Box>
        ) : !photoUrl ? (
          <Box sx={{ py: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0', mb: 2 }}>
            <AlertCircle size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>{t('trainer.solutionDetail.noSubmissionFound')}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>{t('trainer.solutionDetail.noSubmissionHint')}</Typography>
          </Box>
        ) : null}

        {photoUrl && (
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 2, textAlign: 'center' }}>
            <img
              src={photoUrl}
              alt={t('trainer.solutionDetail.solution')}
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
            />
          </Box>
        )}

        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {t('trainer.solutionDetail.feedback', 'Feedback')}
        </Typography>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t('trainer.solutionDetail.feedbackPlaceholder', 'Optional feedback for the student')}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Button
            variantType="default"
            startIcon={<CheckCircle2 size={18} />}
            onClick={() => onSaveMark(submission.id, score, feedback)}
            disabled={saving}
            sx={{ px: 3, bgcolor: '#166534', '&:hover': { bgcolor: '#14532d' } }}
          >
            {saving ? t('common.loading') : t('trainer.solutionDetail.markAsDone')}
          </Button>
          <Button variantType="outline" onClick={onClose}>
            {t('buttons.close')}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
