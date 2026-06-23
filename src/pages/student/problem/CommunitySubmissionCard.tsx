import { Avatar, Box, Chip, Paper, Typography } from '@mui/material';
import { Layers, Trophy, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveMediaUrl } from '../../../utils/media';
import type { Submission } from '../../../services/problemService';

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

interface Props {
  submission: Submission;
  source: 'bank' | 'contest';
}

export const CommunitySubmissionCard = ({ submission, source }: Props) => {
  const { t } = useTranslation();
  const isContest = source === 'contest';
  const hasPoints = isContest && submission.grade != null;
  const isPending = isContest && submission.grade == null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Avatar sx={{ bgcolor: submission.isMine ? '#8B1D23' : '#fef2f2', color: submission.isMine ? '#fff' : '#8B1D23', fontWeight: 700 }}>
              {initials(submission.studentName)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {submission.studentName}
                </Typography>
                {submission.isMine && (
                  <Chip
                    icon={<User size={11} />}
                    label={t('student.problemDetails.yourBadge')}
                    size="small"
                    sx={{ bgcolor: '#8B1D23', color: '#fff', fontWeight: 700, fontSize: '10px', height: 20 }}
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
                sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
            {hasPoints && (
              <Chip
                label={t('student.problemDetails.points', { score: submission.grade })}
                size="small"
                sx={{ bgcolor: '#e7f7ec', color: '#166534', fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
            {isPending && (
              <Chip
                label={t('student.problemDetails.pendingGrade')}
                size="small"
                sx={{ bgcolor: '#fff7e0', color: '#92400e', fontWeight: 700, fontSize: '10px', height: 22 }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {new Date(submission.submittedAt).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ bgcolor: '#8b1d2325', p: 2, borderRadius: '12px', overflow: 'hidden' }}>
          <Typography
            component="pre"
            sx={{ color: '#8B1D23', fontSize: '13px', lineHeight: 1.6, m: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
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
    </Paper>
  );
};

export default CommunitySubmissionCard;
