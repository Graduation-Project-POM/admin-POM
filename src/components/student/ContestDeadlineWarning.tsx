import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import type { StudentContestAlert } from '../../services/dashboardService';

interface Props {
  alerts: StudentContestAlert[];
  thresholdMinutes?: number;
}

export const ContestDeadlineWarning = ({ alerts, thresholdMinutes = 15 }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const thresholdMs = thresholdMinutes * 60_000;

  const urgent = alerts
    .map((a) => ({ ...a, msLeft: new Date(a.endAt).getTime() - now }))
    .filter((a) => a.msLeft > 0 && a.msLeft <= thresholdMs)
    .sort((a, b) => a.msLeft - b.msLeft);

  if (urgent.length === 0) return null;

  return (
    <Stack spacing={1.5} sx={{ mb: 3 }}>
      {urgent.map((a) => {
        const minutesLeft = Math.max(1, Math.ceil(a.msLeft / 60_000));
        return (
          <Box
            key={a.contestId}
            role="alert"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              p: { xs: 1.5, sm: 2 },
              borderRadius: '14px',
              border: '1px solid #fca5a5',
              background: 'linear-gradient(90deg, #fff7ed 0%, #fef2f2 100%)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: '#fee2e2',
                color: '#a40f0fff',
                animation: 'cdw-pulse 1.6s ease-in-out infinite',
                '@keyframes cdw-pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.12)' },
                },
              }}
            >
              <AlertTriangle size={22} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, color: '#7f1d1d', fontSize: '14px' }}>
                {t(
                  'student.dashboard.contestWarning.title',
                  '⚠️ Hurry up! You still have unsolved problems and the contest is almost ending.',
                )}
              </Typography>
              <Typography sx={{ color: '#9a3412', fontSize: '13px', fontWeight: 600, mt: 0.25 }}>
                {t('student.dashboard.contestWarning.detail', {
                  title: a.title,
                  minutes: minutesLeft,
                  count: a.unsolvedCount,
                  defaultValue:
                    '"{{title}}" ends in {{minutes}} min — {{count}} problem(s) left',
                })}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate(`/student/contests?contestId=${a.contestId}`)}
              sx={{
                flexShrink: 0,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#8B1D23',
                borderRadius: '10px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' },
              }}
            >
              {t('student.dashboard.contestWarning.cta', 'Go to contest')}
            </Button>
          </Box>
        );
      })}
    </Stack>
  );
};

export default ContestDeadlineWarning;
