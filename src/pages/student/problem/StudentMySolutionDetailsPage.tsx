import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowLeft, BookOpen, Layers, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getMyProblemSolutions,
  difficultyIdToLabel,
  type MyProblemSolutions,
  type Submission,
} from '../../../services/problemService';
import { resolveMediaUrl } from '../../../utils/media';

const SubmissionCard = ({
  submission,
  source,
}: {
  submission: Submission;
  source: 'bank' | 'contest';
}) => {
  const { t } = useTranslation();
  const showPoints = source === 'contest' && submission.grade != null;
  const showPending = source === 'contest' && submission.grade == null;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {source === 'bank' ? (
            <Chip
              icon={<Layers size={12} />}
              label={t('student.mySolutionDetails.bankBadge')}
              size="small"
              sx={{ bgcolor: '#eef2ff', color: '#4338ca', fontWeight: 700, fontSize: '11px' }}
            />
          ) : (
            <Chip
              icon={<Trophy size={12} />}
              label={t('student.mySolutionDetails.contestBadge')}
              size="small"
              sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '11px' }}
            />
          )}
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
            {t('student.mySolutionDetails.submittedAt', { date: new Date(submission.submittedAt).toLocaleString() })}
          </Typography>
        </Box>
        {showPoints && (
          <Chip
            label={t('student.mySolutionDetails.points', { score: submission.grade })}
            sx={{ bgcolor: '#e7f7ec', color: '#166534', fontWeight: 700 }}
          />
        )}
        {showPending && (
          <Chip
            label={t('student.mySolutionDetails.pending')}
            sx={{ bgcolor: '#fff7e0', color: '#92400e', fontWeight: 700 }}
          />
        )}
      </Box>
      <Box sx={{ bgcolor: '#8b1d2325', p: 2.5, borderRadius: '12px', overflow: 'hidden' }}>
        <Typography
          component="pre"
          sx={{ color: '#8B1D23', fontSize: '13px', lineHeight: 1.6, m: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
        >
          {submission.solutionText || t('student.mySolutionDetails.noSolution')}
        </Typography>
        {submission.photoUrl && (
          <Box sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden' }}>
            <img src={resolveMediaUrl(submission.photoUrl) ?? undefined} alt="solution" style={{ width: '100%', display: 'block' }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export const StudentMySolutionDetailsPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<MyProblemSolutions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = Number(problemId);
      const result = await getMyProblemSolutions(id);
      setData(result);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.mySolutionDetails.notFound')));
    } finally {
      setLoading(false);
    }
  }, [problemId, t]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8B1D23' }} />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Box sx={{ p: 4 }}>
        <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          {t('student.mySolutionDetails.back')}
        </Button>
        <Typography>{error || t('student.mySolutionDetails.notFound')}</Typography>
      </Box>
    );
  }

  const difficulty = difficultyIdToLabel(data.difficulty);
  const totalSubmissions = data.bankSubmissions.length + data.contestSubmissions.length;

  return (
    <Box sx={{ pb: 8 }}>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('student.mySolutionDetails.back')}
      </Button>

      {/* ─── Problem statement (only) ────────────────────────────────── */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              {data.title}
            </Typography>
            {data.topic && (
              <Chip label={data.topic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
            )}
          </Box>
          <Chip
            label={difficulty}
            sx={{
              bgcolor: difficulty === 'Easy' ? '#e7f7ec' : difficulty === 'Medium' ? '#fff7e0' : '#fdecec',
              color: difficulty === 'Easy' ? '#166534' : difficulty === 'Medium' ? '#92400e' : '#991b1b',
              fontWeight: 700,
            }}
          />
        </Box>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, mb: 1 }}>
          <BookOpen size={18} color="#8B1D23" />
          {t('student.mySolutionDetails.statement')}
        </Typography>
        <Typography sx={{ color: '#475569', lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          {data.statement || t('student.mySolutionDetails.noStatement')}
        </Typography>
      </Paper>

      {/* ─── My solutions (bank + contest, no community) ─────────────── */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3 }}>
        {t('student.mySolutionDetails.mySolutions', { count: totalSubmissions })}
      </Typography>

      {totalSubmissions === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: '1px dashed #e2e8f0', textAlign: 'center', color: '#64748b' }}>
          <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
            {t('student.mySolutionDetails.noMine')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.contestSubmissions.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Trophy size={16} color="#92400e" />
                {t('student.mySolutionDetails.contestSection', { count: data.contestSubmissions.length })}
              </Typography>
              {data.contestSubmissions.map((sub) => (
                <SubmissionCard key={`c-${sub.id}`} submission={sub} source="contest" />
              ))}
            </>
          )}

          {data.contestSubmissions.length > 0 && data.bankSubmissions.length > 0 && <Divider />}

          {data.bankSubmissions.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layers size={16} color="#4338ca" />
                {t('student.mySolutionDetails.bankSection', { count: data.bankSubmissions.length })}
              </Typography>
              {data.bankSubmissions.map((sub) => (
                <SubmissionCard key={`b-${sub.id}`} submission={sub} source="bank" />
              ))}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentMySolutionDetailsPage;
