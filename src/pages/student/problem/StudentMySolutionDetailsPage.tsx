import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowLeft, BookOpen, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getAllProblemSolutions,
  difficultyIdToLabel,
  type MyProblemSolutions,
  type Submission,
} from '../../../services/problemService';
import { CommunitySubmissionCard } from './CommunitySubmissionCard';
import { brand, neutral, statusTone } from '../../../theme';
import { LoadingState } from '../../../components/common/states';

type TaggedSubmission = { submission: Submission; source: 'bank' | 'contest' };

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
      const result = await getAllProblemSolutions(id);
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

  const { mine, others, totalCount } = useMemo(() => {
    const all: TaggedSubmission[] = [];
    if (data) {
      data.bankSubmissions.forEach((s) => all.push({ submission: s, source: 'bank' }));
      data.contestSubmissions.forEach((s) => all.push({ submission: s, source: 'contest' }));
    }
    return {
      mine: all.filter((x) => x.submission.isMine),
      others: all.filter((x) => !x.submission.isMine),
      totalCount: all.length,
    };
  }, [data]);

  if (loading) {
    return (
      <LoadingState />
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

  return (
    <Box sx={{ pb: 8 }}>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t('student.mySolutionDetails.back')}
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: `1px solid ${neutral[200]}`, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: neutral[800], mb: 1 }}>
              {data.title}
            </Typography>
            {data.topic && (
              <Chip label={data.topic} size="small" sx={{ bgcolor: neutral[100], color: neutral[600], fontWeight: 600 }} />
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
          {t('student.mySolutionDetails.statement')}
        </Typography>
        <Typography sx={{ color: neutral[600], lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-wrap' }}>
          {data.statement || t('student.mySolutionDetails.noStatement')}
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 700, color: neutral[800], mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FileCode size={24} color={brand[500]} />
        {t('student.problemDetails.allSubmissions', { count: totalCount })}
      </Typography>

      {totalCount === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: `1px dashed ${neutral[200]}`, textAlign: 'center', color: neutral[500] }}>
          <Typography sx={{ fontWeight: 700, color: neutral[800] }}>
            {t('student.problemDetails.noSolutionsYet')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {mine.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t('student.problemDetails.yourSubmissions', { count: mine.length })}
              </Typography>
              {mine.map((x) => (
                <CommunitySubmissionCard
                  key={`${x.source}-${x.submission.id}`}
                  submission={x.submission}
                  source={x.source}
                  onChanged={load}
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
                  onChanged={load}
                />
              ))}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentMySolutionDetailsPage;
