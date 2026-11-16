import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  TextField,
  Alert,
} from '@mui/material';
import { getApiErrorMessage } from '../../../utils/apiError';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { resolveMediaUrl } from '../../../utils/media';
import type { ProblemSubmission } from '../../../services/problemsService';
import { neutral, radius, statusTone } from '../../../theme';

interface SolutionDetailModalProps {
  open: boolean;
  onClose: () => void;
  submission: ProblemSubmission | null;
  problemTitle: string;
  onSaveMark: (submissionId: number, score: number, feedback: string) => void | Promise<unknown>;
  saving?: boolean;
  /** True while the contest is still running: the solution can be read but not graded yet. */
  gradingLocked?: boolean;
}

export const SolutionDetailModal = ({
  open,
  onClose,
  submission,
  problemTitle,
  onSaveMark,
  saving = false,
  gradingLocked = false,
}: SolutionDetailModalProps) => {
  const { t } = useTranslation();
  // Kept as text so "no score yet" ('') is distinct from a real score of 0.
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [scoreInvalid, setScoreInvalid] = useState(false);

  useEffect(() => {
    setScore(submission?.score != null ? String(submission.score) : '');
    setFeedback(submission?.feedback ?? '');
    setError(null);
    setScoreInvalid(false);
  }, [submission, open]);

  const handleSave = async () => {
    if (!submission || gradingLocked) return;
    setError(null);
    setScoreInvalid(false);
    // A score is required to grade — in particular, feedback can't be saved without one.
    if (score.trim() === '') {
      setScoreInvalid(true);
      setError(
        feedback.trim()
          ? t('trainer.solutionDetail.scoreRequiredWithFeedback', 'Enter a score before saving feedback.')
          : t('trainer.solutionDetail.scoreRequired', 'Enter a score to grade this submission.'),
      );
      return;
    }
    const value = Number(score);
    if (!Number.isInteger(value) || value < 0 || value > submission.problemPoints) {
      setScoreInvalid(true);
      setError(t('trainer.solutionDetail.scoreRange', { max: submission.problemPoints }));
      return;
    }
    try {
      await onSaveMark(submission.id, value, feedback);
    } catch (err) {
      setError(getApiErrorMessage(err, t('trainer.solutionDetail.gradeFailed', 'Failed to save mark')));
    }
  };

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
        {gradingLocked && (
          // Soft "not yet" notice. Flex + gap (no left/right offsets) so it
          // mirrors correctly in RTL; wraps cleanly on narrow screens.
          <Box
            role="status"
            aria-live="polite"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 1.5, sm: 2 },
              p: { xs: 1.75, sm: 2 },
              mb: 3,
              bgcolor: statusTone.warning.bg,
              border: `1px solid ${statusTone.warning.border}`,
              borderRadius: `${radius.lg}px`,
            }}
          >
            <Box
              aria-hidden
              sx={{
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                borderRadius: '50%',
                bgcolor: neutral[0],
                border: `1px solid ${statusTone.warning.border}`,
                color: statusTone.warning.solid,
              }}
            >
              <Clock size={18} strokeWidth={2.25} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="p"
                sx={{ fontWeight: 700, fontSize: { xs: '14px', sm: '15px' }, color: statusTone.warning.fg, lineHeight: 1.4, mb: 0.5 }}
              >
                {t('trainer.solutionDetail.gradingLockedTitle', 'Grading Not Available Yet')}
              </Typography>
              <Typography sx={{ fontSize: { xs: '13px', sm: '14px' }, color: neutral[700], lineHeight: 1.6 }}>
                {t(
                  'trainer.solutionDetail.gradingLockedMessage',
                  'You can review this submission now, but grading will be available once the contest ends.',
                )}
              </Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800] }}>{t('trainer.solutionDetail.status')}</Typography>
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
                bgcolor: graded ? statusTone.success.bg : statusTone.warning.bg,
                color: graded ? statusTone.success.fg : statusTone.warning.fg,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800] }}>{t('trainer.solutionDetail.score')}</Typography>
            <input
              type="number"
              min={0}
              max={submission.problemPoints}
              value={score}
              placeholder="—"
              required
              disabled={gradingLocked}
              aria-label={t('trainer.solutionDetail.score')}
              aria-invalid={scoreInvalid || undefined}
              onChange={(e) => {
                const raw = e.target.value;
                setScoreInvalid(false);
                // Keep '' (no score); otherwise cap at the problem's points as before.
                setScore(raw === '' ? '' : String(Math.min(Number(raw), submission.problemPoints)));
              }}
              style={{
                width: '60px',
                padding: '6px 8px',
                borderRadius: '8px',
                border: `1.5px solid ${scoreInvalid ? statusTone.danger.solid : neutral[200]}`,
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
            <Typography sx={{ fontSize: '13px', color: neutral[400], fontWeight: 600 }}>/ {submission.problemPoints}</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800], mb: 1.5 }}>{t('trainer.solutionDetail.solution')}</Typography>

        {submission.solutionText ? (
          // dir="auto" + plaintext bidi: each line follows its own language, so an
          // English/maths solution isn't scrambled (e.g. ".Let x = 2") in the RTL UI.
          <Box dir="auto" sx={{
            p: 2.5,
            bgcolor: neutral[50],
            borderRadius: '12px',
            border: `1px solid ${neutral[200]}`,
            mb: 2,
            fontFamily: 'monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            unicodeBidi: 'plaintext',
            textAlign: 'start',
            lineHeight: 1.6,
            color: neutral[700],
          }}>
            {submission.solutionText}
          </Box>
        ) : !photoUrl ? (
          <Box sx={{ py: 4, textAlign: 'center', bgcolor: neutral[50], borderRadius: '12px', border: `1px dashed ${neutral[200]}`, mb: 2 }}>
            <AlertCircle size={32} color={neutral[400]} style={{ marginBottom: 8 }} />
            <Typography sx={{ fontWeight: 700, color: neutral[800], mb: 0.5 }}>{t('trainer.solutionDetail.noSubmissionFound')}</Typography>
            <Typography variant="body2" sx={{ color: neutral[500] }}>{t('trainer.solutionDetail.noSubmissionHint')}</Typography>
          </Box>
        ) : null}

        {photoUrl && (
          <Box sx={{ p: 2, bgcolor: neutral[0], borderRadius: '12px', border: `1px solid ${neutral[200]}`, mb: 2, textAlign: 'center' }}>
            <img
              src={photoUrl}
              alt={t('trainer.solutionDetail.solution')}
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
            />
          </Box>
        )}

        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800], mb: 1 }}>
          {t('trainer.solutionDetail.feedback', 'Feedback')}
        </Typography>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={feedback}
          disabled={gradingLocked}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t('trainer.solutionDetail.feedbackPlaceholder', 'Optional feedback for the student')}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Button
            variantType="default"
            startIcon={<CheckCircle2 size={18} />}
            onClick={() => void handleSave()}
            disabled={saving || gradingLocked}
            sx={{ px: 3, bgcolor: statusTone.success.fg, '&:hover': { bgcolor: statusTone.success.fg } }}
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
