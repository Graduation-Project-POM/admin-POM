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
            startIcon={<CheckCircle2 size={16} color={filter === 'Graded' ? 'white' : '#166534'} />}
            sx={filter !== 'Graded' ? { color: '#166534', bgcolor: '#e7f7ec', border: 'none' } : {}}
          >
            {t('trainer.studentProgress.graded', 'Graded')}
          </Button>
          <Button
            variantType={filter === 'Pending' ? 'default' : 'outline'}
            onClick={() => setFilter('Pending')}
            size="small"
            startIcon={<Clock size={16} color={filter === 'Pending' ? 'white' : '#92400e'} />}
            sx={filter !== 'Pending' ? { color: '#92400e', bgcolor: '#fef3c7', border: 'none' } : {}}
          >
            {t('trainer.studentProgress.pending', 'Pending')}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#8B1D23' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <FileText size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>
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
                            bgcolor: graded ? '#e7f7ec' : '#fef3c7',
                            color: graded ? '#166534' : '#92400e',
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
                      <Avatar sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 700 }}>
                        {initials(submission.studentName)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{submission.studentName}</Typography>}
                      secondary={
                        <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>
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
