import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
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
import { ProblemDiscussion } from '../../../components/discussion/ProblemDiscussion';
import { brand, neutral, statusTone } from '../../../theme';
import { LoadingState } from '../../../components/common/states';

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
      <LoadingState />
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

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${neutral[200]}`, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: neutral[800], mb: 1 }}>
              {problem.title}
            </Typography>
            {problem.topic && (
              <Chip label={problem.topic} size="small" sx={{ bgcolor: neutral[100], color: neutral[600], fontWeight: 600 }} />
            )}
          </Box>
          <Chip
            label={difficulty}
            sx={{
              bgcolor: difficulty === 'Easy' ? statusTone.success.bg : difficulty === 'Medium' ? statusTone.warning.bg : statusTone.danger.bg,
              color: difficulty === 'Easy' ? statusTone.success.fg : difficulty === 'Medium' ? statusTone.warning.fg : statusTone.danger.fg,
              fontWeight: 700,
            }}
          />
        </Box>

        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: neutral[800], fontWeight: 700, mb: 1 }}>
          <BookOpen size={18} color={brand[500]} />
          {t('student.problemDetails.statement')}
        </Typography>
        <Typography sx={{ color: neutral[600], lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-wrap', mb: 3 }}>
          {problem.statement || t('student.problemDetails.noStatement')}
        </Typography>

        {hasConstraints && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: neutral[800], fontWeight: 700, mb: 1 }}>
              <ListChecks size={18} color={brand[500]} />
              {t('student.problemDetails.constraints')}
            </Typography>
            <Typography
              component="pre"
              sx={{ color: neutral[600], lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap', m: 0, fontFamily: 'inherit' }}
            >
              {problem.constraints}
            </Typography>
          </>
        )}

        {hasExamples && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ color: neutral[800], fontWeight: 700, mb: 2 }}>
              {t('student.problemDetails.examples')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {problem.examples!.map((ex, i) => (
                <Box
                  key={i}
                  sx={{ p: 2, borderRadius: '12px', border: `1px solid ${neutral[200]}`, bgcolor: neutral[50] }}
                >
                  <Typography sx={{ fontWeight: 700, color: neutral[600], fontSize: '13px', mb: 1 }}>
                    {t('student.problemDetails.exampleN', { n: i + 1 })}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: ex.explanation ? 1.5 : 0 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                        {t('student.problemDetails.input')}
                      </Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, borderRadius: '8px', bgcolor: neutral[0], border: `1px solid ${neutral[200]}`, fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {ex.input}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                        {t('student.problemDetails.output')}
                      </Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, borderRadius: '8px', bgcolor: neutral[0], border: `1px solid ${neutral[200]}`, fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {ex.output}
                      </Box>
                    </Box>
                  </Box>
                  {ex.explanation && (
                    <Box>
                      <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                        {t('student.problemDetails.explanation')}
                      </Typography>
                      <Typography sx={{ color: neutral[600], fontSize: '13px', whiteSpace: 'pre-wrap' }}>
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
          <Box sx={{ mt: 3, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${neutral[200]}` }}>
            <img src={resolveMediaUrl(problem.photoUrl) ?? undefined} alt={problem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variantType="default" startIcon={<Send size={16} />} onClick={() => setSolveOpen(true)}>
            {t('student.problems.solve')}
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 800, color: neutral[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FileCode size={24} color={brand[500]} />
        {t('student.problemDetails.allSubmissions', { count: totalCount })}
      </Typography>

      {totalCount === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: `1px dashed ${neutral[200]}`, textAlign: 'center', color: neutral[500] }}>
          <Typography sx={{ fontWeight: 700, color: neutral[800], mb: 0.5 }}>
            {t('student.problemDetails.noSolutionsYet')}
          </Typography>
          <Typography variant="body2">{t('student.problemDetails.beFirst')}</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mine.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand[500] }}>
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
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: neutral[600] }}>
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

      <ProblemDiscussion problemId={problem.id} />

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
