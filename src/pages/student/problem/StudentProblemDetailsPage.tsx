import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowLeft, FileCode, Send, BookOpen, ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getProblemById,
  getAllProblemSolutions,
  difficultyIdToLabel,
  type BackendProblem,
  type Submission,
  type MyProblemSolutions,
} from '../../../services/problemService';
import { resolveMediaUrl } from '../../../utils/media';
import { SubmitSolutionModal } from './SubmitSolutionModal';
import { CommunitySubmissionCard } from './CommunitySubmissionCard';

type TaggedSubmission = { submission: Submission; source: 'bank' | 'contest' };

export const StudentProblemDetailsPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [problem, setProblem] = useState<BackendProblem | null>(null);
  const [solutions, setSolutions] = useState<MyProblemSolutions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solveOpen, setSolveOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = Number(problemId);
      const [prob, all] = await Promise.all([
        getProblemById(id),
        getAllProblemSolutions(id),
      ]);
      setProblem(prob);
      setSolutions(all);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.problemDetails.notFound')));
    } finally {
      setLoading(false);
    }
  }, [problemId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const { mine, others, totalCount } = useMemo(() => {
    const all: TaggedSubmission[] = [];
    if (solutions) {
      solutions.bankSubmissions.forEach((s) => all.push({ submission: s, source: 'bank' }));
      solutions.contestSubmissions.forEach((s) => all.push({ submission: s, source: 'contest' }));
    }
    const mineList = all.filter((x) => x.submission.isMine);
    const othersList = all.filter((x) => !x.submission.isMine);
    return { mine: mineList, others: othersList, totalCount: all.length };
  }, [solutions]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8B1D23' }} />
      </Box>
    );
  }
  if (error || !problem) {
    return (
      <Box sx={{ p: 4 }}>
        <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          {t('student.problemDetails.back')}
        </Button>
        <Typography>{error || t('student.problemDetails.notFound')}</Typography>
      </Box>
    );
  }

  const difficulty = difficultyIdToLabel(problem.difficulty);
  const hasConstraints = Boolean(problem.constraints && problem.constraints.trim());
  const hasExamples = Array.isArray(problem.examples) && problem.examples.length > 0;

  return (
    <Box sx={{ pb: 8 }}>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('student.problemDetails.back')}
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              {problem.title}
            </Typography>
            {problem.topic && (
              <Chip label={problem.topic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
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
          {t('student.problemDetails.statement')}
        </Typography>
        <Typography sx={{ color: '#475569', lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-wrap', mb: 3 }}>
          {problem.statement || t('student.problemDetails.noStatement')}
        </Typography>

        {hasConstraints && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, mb: 1 }}>
              <ListChecks size={18} color="#8B1D23" />
              {t('student.problemDetails.constraints')}
            </Typography>
            <Typography
              component="pre"
              sx={{ color: '#475569', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap', m: 0, fontFamily: 'inherit' }}
            >
              {problem.constraints}
            </Typography>
          </>
        )}

        {hasExamples && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700, mb: 2 }}>
              {t('student.problemDetails.examples')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {problem.examples!.map((ex, i) => (
                <Box
                  key={i}
                  sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#fafafa' }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '13px', mb: 1 }}>
                    {t('student.problemDetails.exampleN', { n: i + 1 })}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: ex.explanation ? 1.5 : 0 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                        {t('student.problemDetails.input')}
                      </Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, borderRadius: '8px', bgcolor: '#fff', border: '1px solid #e2e8f0', fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {ex.input}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                        {t('student.problemDetails.output')}
                      </Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, borderRadius: '8px', bgcolor: '#fff', border: '1px solid #e2e8f0', fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {ex.output}
                      </Box>
                    </Box>
                  </Box>
                  {ex.explanation && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                        {t('student.problemDetails.explanation')}
                      </Typography>
                      <Typography sx={{ color: '#475569', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                        {ex.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </>
        )}

        {problem.photoUrl && (
          <Box sx={{ mt: 3, borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={resolveMediaUrl(problem.photoUrl) ?? undefined} alt={problem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variantType="default" startIcon={<Send size={16} />} onClick={() => setSolveOpen(true)}>
            {t('student.problems.solve')}
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FileCode size={24} color="#8B1D23" />
        {t('student.problemDetails.allSubmissions', { count: totalCount })}
      </Typography>

      {totalCount === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: '1px dashed #e2e8f0', textAlign: 'center', color: '#64748b' }}>
          <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            {t('student.problemDetails.noSolutionsYet')}
          </Typography>
          <Typography variant="body2">{t('student.problemDetails.beFirst')}</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mine.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#8B1D23' }}>
                {t('student.problemDetails.yourSubmissions', { count: mine.length })}
              </Typography>
              {mine.map((x) => (
                <CommunitySubmissionCard
                  key={`${x.source}-${x.submission.id}`}
                  submission={x.submission}
                  source={x.source}
                />
              ))}
              {others.length > 0 && <Divider sx={{ my: 1 }} />}
            </>
          )}
          {others.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#475569' }}>
                {t('student.problemDetails.communityHeading', { count: others.length })}
              </Typography>
              {others.map((x) => (
                <CommunitySubmissionCard
                  key={`${x.source}-${x.submission.id}`}
                  submission={x.submission}
                  source={x.source}
                />
              ))}
            </>
          )}
        </Box>
      )}

      <SubmitSolutionModal
        open={solveOpen}
        onClose={() => setSolveOpen(false)}
        problem={problem}
        onSubmitted={() => {
          setSolveOpen(false);
          void load();
        }}
      />
    </Box>
  );
};

export default StudentProblemDetailsPage;
