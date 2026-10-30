import { Box, Typography, Chip, Stack, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { resolveMediaUrl } from '../../../utils/media';
import { difficultyIdToLabel, type BackendProblem } from '../../../services/problemService';
import { neutral, statusTone } from '../../../theme';

interface ProblemViewModalProps {
  open: boolean;
  onClose: () => void;
  problem: BackendProblem | null;
}

const difficultyStyle = (label: string) => ({
  bgcolor: label === 'Easy' ? statusTone.success.bg : label === 'Medium' ? statusTone.warning.bg : statusTone.danger.bg,
  color: label === 'Easy' ? statusTone.success.fg : label === 'Medium' ? statusTone.warning.fg : statusTone.danger.fg,
});

/**
 * Read-only problem view for students. Uses the already-loaded problem data
 * (title, statement, image) — no fetch, so it works for students who can't call
 * the admin/trainer GET /api/Problems/{id} endpoint.
 */
export const ProblemViewModal = ({ open, onClose, problem }: ProblemViewModalProps) => {
  const { t } = useTranslation();
  if (!problem) return null;

  const difficulty = difficultyIdToLabel(problem.difficulty);

  return (
    <ModalWrapper open={open} onClose={onClose} title={t('problem.detail.title', 'Problem Details')} maxWidth="md">
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            {problem.topic && (
              <Chip label={problem.topic} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            )}
            <Chip label={difficulty} size="small" sx={{ fontWeight: 600, ...difficultyStyle(difficulty) }} />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 700, color: neutral[800] }}>
            {problem.title}
          </Typography>
        </Box>

        {problem.photoUrl && (
          <Box
            component="img"
            src={resolveMediaUrl(problem.photoUrl) ?? undefined}
            alt={problem.title}
            sx={{
              width: '100%',
              maxHeight: 360,
              objectFit: 'contain',
              borderRadius: '12px',
              border: `1px solid ${neutral[200]}`,
              bgcolor: neutral[50],
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        <Divider />

        <Box>
          <Typography
            sx={{ fontWeight: 700, mb: 1, color: neutral[800], fontSize: '13px', textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {t('problem.detail.description', 'Description')}
          </Typography>
          <Typography sx={{ color: neutral[600], lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {problem.statement && problem.statement.trim()
              ? problem.statement
              : t('problem.detail.noDescription', 'No description provided.')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button variantType="outline" onClick={onClose}>
            {t('buttons.close')}
          </Button>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default ProblemViewModal;
