import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowLeft, FileCode, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button/Button';
import {
  getMySubmissions,
  difficultyIdToLabel,
  type Submission,
} from '../../../services/problemService';

export const StudentProblemDetailsPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mine = await getMySubmissions();
        const found = mine.find((s) => s.problemId === Number(problemId)) || null;
        if (!found) setError(t('student.problemDetails.notFound'));
        setSubmission(found);
      } catch (err: any) {
        setError(err?.response?.data?.message || t('student.problemDetails.notFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [problemId, t]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8B1D23' }} />
      </Box>
    );
  }
  if (error || !submission) {
    return (
      <Box sx={{ p: 4 }}>
        <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          {t('student.problemDetails.back')}
        </Button>
        <Typography>{error || t('student.problemDetails.notFound')}</Typography>
      </Box>
    );
  }

  const difficulty = difficultyIdToLabel(submission.problemDifficulty ?? 1);
  const graded = submission.grade != null;

  return (
    <Box sx={{ pb: 8 }}>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('student.problemDetails.back')}
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              {submission.problemTitle}
            </Typography>
            {submission.problemTopic && (
              <Chip label={submission.problemTopic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
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
        <Typography sx={{ color: '#475569', lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          {submission.problemStatement || t('student.problemDetails.noStatement')}
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileCode size={20} color="#8B1D23"  />
            {t('student.problemDetails.mySolution')}
          </Typography>
          {graded ? (
            <Chip
              icon={submission.grade === 100 ? <Award size={14} /> : undefined}
              label={t('student.problemDetails.grade', { grade: submission.grade })}
              sx={{ bgcolor: '#e7f7ec', color: '#166534', fontWeight: 700 }}
            />
          ) : (
            <Chip label={t('student.problemDetails.pending')} sx={{ bgcolor: '#fff7e0', color: '#92400e', fontWeight: 700 }} />
          )}
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
          {t('student.problemDetails.submittedAt', { date: new Date(submission.submittedAt).toLocaleString() })}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ bgcolor: '#8b1d233a', p: 2.5, borderRadius: '12px', overflow: 'hidden' }}>
          <Typography
            component="pre"
            sx={{ color: '#8B1D23', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, m: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}
          >
            {submission.solutionText || t('student.problemDetails.noSolution')}
          </Typography>
        </Box>
        {submission.photoUrl && (
          <Box sx={{ mt: 2, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={submission.photoUrl} alt="solution" style={{ width: '100%', display: 'block' }} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentProblemDetailsPage;
