import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { CheckCircle2, Clock, FileText } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import type { ProblemSubmission } from '../../../services/problemsService';
import { brand, neutral, statusTone } from '../../../theme';

interface StudentProgressModalProps {
  open: boolean;
  onClose: () => void;
  problemTitle: string;
  submissions: ProblemSubmission[];
  loading?: boolean;
  onViewSolution: (submission: ProblemSubmission) => void;
}

const isGraded = (s: ProblemSubmission) => s.gradedAt != null || s.score != null;

export const StudentProgressModal = ({
  open,
  onClose,
  problemTitle,
  submissions,
  loading = false,
  onViewSolution,
}: StudentProgressModalProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'All' | 'Graded' | 'Pending'>('All');

  const filtered = submissions.filter((s) => {
    if (filter === 'All') return true;
    if (filter === 'Graded') return isGraded(s);
    return !isGraded(s);
  });

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`${problemTitle} - ${t('trainer.studentProgress.titleSuffix')}`}
      maxWidth="md"
    >
      <Box sx={{ mt: 1 }}>
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variantType={filter === 'All' ? 'default' : 'outline'}
            onClick={() => setFilter('All')}
            size="small"
          >
            {t('trainer.studentProgress.allStudents')}
          </Button>
          <Button
            variantType={filter === 'Graded' ? 'default' : 'outline'}
            onClick={() => setFilter('Graded')}
            size="small"
            startIcon={<CheckCircle2 size={16} color={filter === 'Graded' ? 'white' : statusTone.success.fg} />}
            sx={filter !== 'Graded' ? { color: statusTone.success.fg, bgcolor: statusTone.success.bg, border: 'none' } : {}}
          >
            {t('trainer.studentProgress.graded', 'Graded')}
          </Button>
          <Button
            variantType={filter === 'Pending' ? 'default' : 'outline'}
            onClick={() => setFilter('Pending')}
            size="small"
            startIcon={<Clock size={16} color={filter === 'Pending' ? 'white' : statusTone.warning.fg} />}
            sx={filter !== 'Pending' ? { color: statusTone.warning.fg, bgcolor: statusTone.warning.bg, border: 'none' } : {}}
          >
            {t('trainer.studentProgress.pending', 'Pending')}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: brand[500] }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <FileText size={40} color={neutral[300]} style={{ marginBottom: 12 }} />
            <Typography sx={{ color: neutral[400], fontWeight: 600 }}>
              {t('trainer.studentProgress.noSubmissions', 'No submissions yet')}
            </Typography>
          </Box>
        ) : (
          <List>
            {filtered.map((submission, index) => {
              const graded = isGraded(submission);
              return (
                <Box key={submission.id}>
                  <ListItem
                    sx={{ px: 0, py: 2 }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                        <Chip
                          label={
                            graded
                              ? `${t('trainer.studentProgress.graded', 'Graded')} · ${submission.score ?? 0}`
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
                        <Button
                          variantType="outline"
                          size="small"
                          startIcon={<FileText size={16} />}
                          onClick={() => onViewSolution(submission)}
                          sx={{ fontSize: '12px', fontWeight: 600 }}
                        >
                          {t('trainer.studentProgress.viewSolution')}
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: neutral[50], color: neutral[800], border: `1px solid ${neutral[200]}`, fontSize: '14px', fontWeight: 700 }}>
                        {initials(submission.studentName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700, fontSize: '15px', color: neutral[800] }}>{submission.studentName}</Typography>}
                      secondary={
                        <Typography sx={{ fontSize: '13px', color: neutral[400] }}>
                          {t('trainer.studentProgress.submittedOn', 'Submitted')}{' '}
                          {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '—'}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < filtered.length - 1 && <Divider component="li" />}
                </Box>
              );
            })}
          </List>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variantType="outline" onClick={onClose}>
            {t('buttons.close')}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
