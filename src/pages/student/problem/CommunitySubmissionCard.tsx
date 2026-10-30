import { useState } from 'react';
import { Avatar, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { Eye, EyeOff, Layers, Trash2, Trophy, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveMediaUrl } from '../../../utils/media';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import { ConfirmationModal } from '../../../components/common/modal/ConfirmationModal';
import {
  deleteBankSubmission,
  deleteContestSubmission,
  setBankSubmissionVisibility,
  setContestSubmissionVisibility,
  type Submission,
} from '../../../services/problemService';
import { brand, neutral, statusTone } from '../../../theme';

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

interface Props {
  submission: Submission;
  source: 'bank' | 'contest';
  onChanged?: () => void;
}

export const CommunitySubmissionCard = ({ submission, source, onChanged }: Props) => {
  const { t } = useTranslation();
  const isContest = source === 'contest';
  const hasPoints = isContest && submission.grade != null;
  const isPending = isContest && submission.grade == null;
  const isDraft = submission.isPublished === false;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onPublishToggle = async () => {
    setError(null);
    setBusy(true);
    try {
      const next = !isDraft ? false : true; 
      if (source === 'bank') await setBankSubmissionVisibility(submission.id, next);
      else await setContestSubmissionVisibility(submission.id, next);
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, t('student.problemDetails.visibilityError')));
    } finally {
      setBusy(false);
    }
  };

  const onConfirmDelete = async () => {
    setError(null);
    setBusy(true);
    try {
      if (source === 'bank') await deleteBankSubmission(submission.id);
      else await deleteContestSubmission(submission.id);
      setConfirmOpen(false);
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, t('student.problemDetails.deleteError')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: `1px solid ${neutral[200]}`,
        bgcolor: isDraft ? neutral[50] : neutral[0],
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Avatar sx={{ bgcolor: submission.isMine ? brand[500] : '#fef2f2', color: submission.isMine ? neutral[0] : brand[500], fontWeight: 700 }}>
              {initials(submission.studentName)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 700, color: neutral[800], overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {submission.studentName}
                </Typography>
                {submission.isMine && (
                  <Chip
                    icon={<User size={11} />}
                    label={t('student.problemDetails.yourBadge')}
                    size="small"
                    sx={{ bgcolor: brand[500], color: neutral[0], fontWeight: 700, fontSize: '10px', height: 20 }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {source === 'bank' ? (
              <Chip
                icon={<Layers size={11} />}
                label={t('student.problemDetails.bankBadge')}
                size="small"
                sx={{ bgcolor: '#eef2ff', color: '#4338ca', fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            ) : (
              <Chip
                icon={<Trophy size={11} />}
                label={t('student.problemDetails.contestBadge')}
                size="small"
                sx={{ bgcolor: statusTone.warning.bg, color: statusTone.warning.fg, fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
            <Chip
              icon={isDraft ? <EyeOff size={11} /> : <Eye size={11} />}
              label={isDraft ? t('student.problemDetails.draftBadge') : t('student.problemDetails.publishedBadge')}
              size="small"
              sx={{
                bgcolor: isDraft ? neutral[100] : statusTone.success.bg,
                color: isDraft ? neutral[600] : statusTone.success.fg,
                fontWeight: 700,
                fontSize: '10px',
                height: 22,
              }}
            />
            {hasPoints && (
              <Chip
                label={t('student.problemDetails.points', { score: submission.grade })}
                size="small"
                sx={{ bgcolor: statusTone.success.bg, color: statusTone.success.fg, fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
            {isPending && (
              <Chip
                label={t('student.problemDetails.pendingGrade')}
                size="small"
                sx={{ bgcolor: statusTone.warning.bg, color: statusTone.warning.fg, fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: neutral[400] }}>
            {new Date(submission.submittedAt).toLocaleString()}
          </Typography>

          {submission.isMine && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Button
                variantType="outline"
                size="small"
                startIcon={isDraft ? <Eye size={14} /> : <EyeOff size={14} />}
                onClick={() => void onPublishToggle()}
                disabled={busy}
                sx={{ fontSize: '12px' }}
              >
                {isDraft
                  ? t('student.problemDetails.publishAction')
                  : t('student.problemDetails.saveAsDraftAction')}
              </Button>
              <Button
                variantType="outline"
                size="small"
                startIcon={<Trash2 size={14} />}
                onClick={() => setConfirmOpen(true)}
                disabled={busy}
                sx={{ fontSize: '12px', color: statusTone.danger.solid, borderColor: statusTone.danger.border }}
              >
                {t('student.problemDetails.deleteAction')}
              </Button>
            </Stack>
          )}
          {error && (
            <Typography variant="caption" sx={{ color: statusTone.danger.solid, display: 'block', mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ bgcolor: '#8b1d2325', p: 2, borderRadius: '12px', overflow: 'hidden' }}>
          <Typography
            component="pre"
            sx={{ color: brand[500], fontSize: '13px', lineHeight: 1.6, m: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
          >
            {submission.solutionText || t('student.problemDetails.noSolution')}
          </Typography>
          {submission.photoUrl && (
            <Box sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden' }}>
              <img src={resolveMediaUrl(submission.photoUrl) ?? undefined} alt="solution" style={{ width: '100%', display: 'block' }} />
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void onConfirmDelete()}
        title={t('student.problemDetails.deleteTitle')}
        message={t('student.problemDetails.deleteMessage')}
      />
    </Paper>
  );
};

export default CommunitySubmissionCard;
