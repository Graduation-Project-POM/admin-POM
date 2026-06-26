import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material';
import { ArrowLeft, CheckCircle2, FileCode } from 'lucide-react';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getProblemById,
  getSubmissions,
  difficultyIdToLabel,
  type BackendProblem,
  type Submission,
} from '../../../services/problemService';
import { problemsService, type ProblemSubmission } from '../../../services/problemsService';
import { resolveMediaUrl } from '../../../utils/media';

const contestToSubmission = (s: ProblemSubmission): Submission => ({
  id: s.id,
  problemId: s.problemId,
  studentName: s.studentName,
  studentEmail: null,
  solutionText: s.solutionText,
  photoUrl: s.solutionPhotoUrl,
  grade: s.score,
  feedback: s.feedback,
  submittedAt: s.submittedAt,
  problemPoints: s.problemPoints,
});

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

const SubmissionCard = ({
  submission,
  canGrade = false,
  onGrade,
}: {
  submission: Submission;
  canGrade?: boolean;
  onGrade?: (submissionId: number, score: number, feedback: string) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const maxPts = submission.problemPoints ?? 100;
  const [grade, setGrade] = useState<string>(submission.grade != null ? String(submission.grade) : '');
  const [feedback, setFeedback] = useState<string>(submission.feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const handleSave = async () => {
    const value = Number(grade);
    if (grade === '' || Number.isNaN(value) || value < 0 || value > maxPts) {
      setGradeError(t('problem.details.gradeRange', `Grade must be between 0 and ${maxPts}.`));
      return;
    }
    setGradeError(null);
    setSaving(true);
    try {
      await onGrade?.(submission.id, value, feedback);
    } catch (err: unknown) {
      setGradeError(getApiErrorMessage(err, t('problem.details.saveGradeError', 'Failed to save grade.')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#fef2f2', color: '#8B1D23', fontWeight: 700 }}>
              {initials(submission.studentName)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{submission.studentName}</Typography>
              {submission.studentEmail && (
                <Typography variant="body2" sx={{ color: '#64748b' }}>{submission.studentEmail}</Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
          {canGrade ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{t('problem.details.status', 'Status')}</Typography>
                <Chip
                  label={submission.grade != null ? t('problem.details.graded', 'Graded') : t('problem.details.pending', 'Pending')}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: submission.grade != null ? '#e7f7ec' : '#fef3c7',
                    color: submission.grade != null ? '#166534' : '#92400e',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{t('problem.details.grade', 'Grade')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    slotProps={{ htmlInput: { min: 0, max: maxPts, style: { width: 60, textAlign: 'center', fontWeight: 700 } } }}
                  />
                  <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>/ {maxPts}</Typography>
                </Box>
              </Box>
              <TextField
                size="small"
                multiline
                minRows={2}
                placeholder={t('problem.details.feedbackPlaceholder', 'Feedback (optional)')}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {gradeError && (
                <Typography variant="caption" sx={{ color: '#dc2626' }}>{gradeError}</Typography>
              )}
              <Button
                variantType="default"
                fullWidth
                startIcon={<CheckCircle2 size={16} />}
                sx={{ bgcolor: '#166534', '&:hover': { bgcolor: '#14532d' } }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? t('problem.details.saving', 'Saving...') : t('problem.details.saveGrade', 'Save grade')}
              </Button>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {t('problem.details.submittedAt', { date: new Date(submission.submittedAt).toLocaleString() })}
              </Typography>
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {t('problem.details.submittedAt', { date: new Date(submission.submittedAt).toLocaleString() })}
            </Typography>
          )}
        </Box>

        <Box sx={{ bgcolor: '#8b1d2325', p: 2, borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: '#8B1D23' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('problem.details.solution')}
            </Typography>
            <FileCode size={16} />
          </Box>
          <Typography
            component="pre"
            sx={{ color: '#8B1D23', fontSize: '13px', lineHeight: 1.6, m: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}
          >
            {submission.solutionText || t('problem.details.noSolution')}
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

interface ProblemDetailsPageProps {

  problemId?: number;
  onBack?: () => void;
  source?: 'bank' | 'contest';
}

export const ProblemDetailsPage = ({ problemId: problemIdProp, onBack, source = 'bank' }: ProblemDetailsPageProps = {}) => {
  const { t } = useTranslation();
  const { problemId: routeProblemId } = useParams();
  const navigate = useNavigate();
  const problemId = problemIdProp != null ? String(problemIdProp) : routeProblemId;
  const [problem, setProblem] = useState<BackendProblem | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = Number(problemId);
        const prob = await getProblemById(id);
        setProblem(prob);
        const isBankView = problemIdProp == null;
        if (!isBankView || (prob.canModify ?? false)) {
          try {
            if (source === 'contest') {
              const subs = await problemsService.getSubmissions(id);
              setSubmissions(subs.map(contestToSubmission));
            } else {
              setSubmissions(await getSubmissions(id));
            }
          } catch {
            setSubmissions([]);
          }
        } else {
          setSubmissions([]);
        }
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, t('problem.details.notFound')));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [problemId, problemIdProp, source, t]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8B1D23' }} />
      </Box>
    );
  }
  if (error || !problem) {
    return <Box sx={{ p: 4 }}>{error || t('problem.details.notFound')}</Box>;
  }

  const difficulty = difficultyIdToLabel(problem.difficulty);
  const canViewSubmissions = problemIdProp != null || (problem.canModify ?? false);
  const canGrade = source === 'contest';

  const handleGrade = async (submissionId: number, score: number, feedback: string) => {
    await problemsService.gradeSubmission(submissionId, { score, feedback });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, grade: score, feedback } : s)),
    );
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Button
        variantType="outline"
        startIcon={<ArrowLeft size={18} />}
        onClick={() => (onBack ? onBack() : navigate(-1))}
        sx={{ mb: 3 }}
      >
        {t('problem.details.back')}
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              {problem.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={problem.topic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
              <Chip
                label={problem.isPublished ? t('problem.details.published') : t('problem.details.draft')}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: problem.isPublished ? '#e7f7ec' : '#f3f4f6',
                  color: problem.isPublished ? '#166534' : '#374151',
                }}
              />
            </Box>
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

        <Typography sx={{ color: '#475569', lineHeight: 1.8, fontSize: '16px', mb: 2, whiteSpace: 'pre-wrap' }}>
          {problem.statement || t('problem.details.noStatement')}
        </Typography>

        {problem.photoUrl && (
          <Box sx={{ mb: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={resolveMediaUrl(problem.photoUrl) ?? undefined} alt={problem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        )}
      </Paper>

      {canViewSubmissions && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FileCode size={24} color="#8B1D23" />
            {t('problem.details.submissionsTitle', { count: submissions.length })}
          </Typography>

          {submissions.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ p: 6, borderRadius: '16px', border: '1px dashed #e2e8f0', textAlign: 'center', color: '#64748b' }}
            >
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>{t('problem.details.noSubmissions')}</Typography>
              <Typography variant="body2">{t('problem.details.noSubmissionsHint')}</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {submissions.map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} canGrade={canGrade} onGrade={handleGrade} />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProblemDetailsPage;
