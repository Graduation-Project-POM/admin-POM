import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowLeft, FileCode, Send, BookOpen, Eye, EyeOff, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getProblemById,
  getStudentProblemSolutions,
  difficultyIdToLabel,
  type BackendProblem,
  type Submission,
  type SubmissionLists,
} from '../../../services/problemService';
import { resolveMediaUrl } from '../../../utils/media';
import { SubmitSolutionModal } from './SubmitSolutionModal';
import { CommunitySubmissionCard } from './CommunitySubmissionCard';
import { ProblemDiscussion } from '../../../components/discussion/ProblemDiscussion';
import { ProblemConstraintsExamples } from '../../../components/problem/ProblemConstraintsExamples';
import { brand, neutral, statusTone } from '../../../theme';
import { LoadingState } from '../../../components/common/states';

type TaggedSubmission = { submission: Submission; source: 'bank' | 'contest' };

const tagSubmissions = (lists: SubmissionLists | null | undefined): TaggedSubmission[] => [
  ...(lists?.bankSubmissions ?? []).map((s) => ({ submission: s, source: 'bank' as const })),
  ...(lists?.contestSubmissions ?? []).map((s) => ({ submission: s, source: 'contest' as const })),
];

export const StudentProblemDetailsPage = () => {
  const { problemId } = useParams();
  // Keyed by problem so all page state, including the "other students'
  // solutions" toggle, starts fresh (hidden) whenever another problem opens.
  return <StudentProblemDetails key={problemId} problemId={Number(problemId)} />;
};

const StudentProblemDetails = ({ problemId }: { problemId: number }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [problem, setProblem] = useState<BackendProblem | null>(null);
  const [mine, setMine] = useState<TaggedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solveOpen, setSolveOpen] = useState(false);

  // Other students' solutions are hidden by default and are only requested
  // from the server once the student asks for them.
  const [showOthers, setShowOthers] = useState(false);
  const [others, setOthers] = useState<TaggedSubmission[] | null>(null);
  const [othersLoading, setOthersLoading] = useState(false);
  const [othersError, setOthersError] = useState<string | null>(null);
  // Ignores a response that arrives after the student already hid the list again.
  const requestSeq = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prob, solutions] = await Promise.all([
        getProblemById(problemId),
        getStudentProblemSolutions(problemId, false),
      ]);
      setProblem(prob);
      setMine(tagSubmissions(solutions.mine));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.problemDetails.notFound')));
    } finally {
      setLoading(false);
    }
  }, [problemId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const fetchSolutions = async (includeOthers: boolean) => {
    const seq = ++requestSeq.current;
    if (includeOthers) {
      setOthersLoading(true);
      setOthersError(null);
    }
    try {
      const solutions = await getStudentProblemSolutions(problemId, includeOthers);
      if (seq !== requestSeq.current) return;
      setMine(tagSubmissions(solutions.mine));
      if (includeOthers) setOthers(tagSubmissions(solutions.others));
    } catch (err: unknown) {
      if (seq !== requestSeq.current) return;
      if (includeOthers) setOthersError(getApiErrorMessage(err, t('student.problemDetails.othersLoadError')));
    } finally {
      if (seq === requestSeq.current) setOthersLoading(false);
    }
  };

  const toggleOthers = () => {
    if (showOthers) {
      // Hiding drops other students' rows entirely; the student's own stay.
      requestSeq.current++;
      setShowOthers(false);
      setOthers(null);
      setOthersError(null);
      setOthersLoading(false);
    } else {
      setShowOthers(true);
      void fetchSolutions(true);
    }
  };

  // After the student submits, edits visibility, or deletes one of their own
  // submissions: refresh without changing the toggle state.
  const refreshSolutions = () => void fetchSolutions(showOthers);

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

        <ProblemConstraintsExamples constraints={problem.constraints} examples={problem.examples} />

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

      <Box sx={{ mb: 4 }}>
        <Button
          variantType="outline"
          startIcon={showOthers ? <EyeOff size={16} /> : <Eye size={16} />}
          onClick={toggleOthers}
          aria-expanded={showOthers}
          aria-controls="other-students-solutions"
        >
          {showOthers ? t('student.problemDetails.hideOthers') : t('student.problemDetails.showOthers')}
        </Button>
      </Box>

      {/* The student's own submissions are always shown, whatever the toggle state. */}
      <Typography variant="h5" sx={{ fontWeight: 800, color: neutral[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FileCode size={24} color={brand[500]} />
        {t('student.problemDetails.yourSubmissions', { count: mine.length })}
      </Typography>

      {mine.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: `1px dashed ${neutral[200]}`, textAlign: 'center', color: neutral[500] }}>
          <Typography sx={{ fontWeight: 700, color: neutral[800], mb: 0.5 }}>
            {t('student.problemDetails.noMySubmissionsYet')}
          </Typography>
          <Typography variant="body2">{t('student.problemDetails.beFirst')}</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mine.map((x) => (
            <CommunitySubmissionCard
              key={`${x.source}-${x.submission.id}`}
              submission={x.submission}
              source={x.source}
              onChanged={refreshSolutions}
            />
          ))}
        </Box>
      )}

      {showOthers && (
        <Box id="other-students-solutions" sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: neutral[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Users size={24} color={brand[500]} />
            {t('student.problemDetails.communityHeading', { count: others?.length ?? 0 })}
          </Typography>

          {othersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: brand[500] }} />
            </Box>
          ) : othersError ? (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>{othersError}</Alert>
          ) : !others || others.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px dashed ${neutral[200]}`, textAlign: 'center', color: neutral[500] }}>
              <Typography variant="body2">{t('student.problemDetails.noOtherSolutions')}</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {others.map((x) => (
                <CommunitySubmissionCard
                  key={`${x.source}-${x.submission.id}`}
                  submission={x.submission}
                  source={x.source}
                />
              ))}
            </Box>
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
          refreshSolutions();
        }}
      />
    </Box>
  );
};

export default StudentProblemDetailsPage;
