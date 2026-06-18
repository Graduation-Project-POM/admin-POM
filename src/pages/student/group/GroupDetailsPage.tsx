import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Alert } from '@mui/material';
import { groupService } from '../../../services/groupService';
import { contestService } from '../../../services/contestService';
import { problemsService } from '../../../services/problemsService';
import { getApiErrorMessage } from '../../../utils/apiError';
import { resolveMediaUrl } from '../../../utils/media';
import { getContestStatus } from '../../../utils/contestStatus';
import { DIFFICULTY_LABEL } from '../../../types/problem';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
} from '@mui/material';
import { ArrowLeft, Users, Award, BookOpen, Clock, CheckCircle2, Circle, Star, Send, X, FileText, Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { ContestCard } from '../../../components/ui/card/studentConstentCard';
import {
  StyledContainer,
  HeaderSection,
  TabContentWrapper,
  StudentCardStyled,
  SearchInput,
} from './groupDetailsStyle';
import type { ContestData, GroupData } from '../../../types';
import { Button } from '../../../components/ui/button/studentButton';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { useNavigate } from 'react-router-dom';


function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface GroupDetailsPageProps {
  group: GroupData;
  onBack: () => void;
}

export const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ group, onBack }) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [contestSearchQuery, setContestSearchQuery] = useState('');
  const navigate = useNavigate();

  const [viewingProblems, setViewingProblems] = useState(false);
  const [selectedContest, setSelectedContest] = useState<ContestData | null>(null);

  const [contestProblems, setContestProblems] = useState<any[]>([]);
  const [, setProblemsLoading] = useState(false);
  const [problemsError, setProblemsError] = useState<string | null>(null);

  const loadContestProblems = async (contestId: string) => {
    setProblemsLoading(true);
    setProblemsError(null);
    setContestProblems([]);
    try {
      const data = await contestService.getMyProblems(Number(contestId));
      setContestProblems(
        data.map((p) => ({
          id: String(p.problemId),
          title: String(p.title ?? ''),
          category: String(p.topic ?? ''),
          difficulty: DIFFICULTY_LABEL[Number(p.difficulty)] ?? 'Medium',
          status: p.submitted ? 'submitted' : 'not_submitted',
          submittedAt: p.submittedAt ?? '',
          textSolution: p.solutionText ?? '',
          imageSolution: resolveMediaUrl(p.solutionPhotoUrl) ?? '',
          questionText: p.statement ?? '',
          questionImage: resolveMediaUrl(p.photoUrl) ?? '',
          grade: p.score ?? 0,
          maxGrade: 100,
          feedback: p.feedback ?? '',
        })),
      );
    } catch (err) {
      setProblemsError(getApiErrorMessage(err, t('student.groupDetails.loadProblemsFailed', 'Failed to load problems')));
    } finally {
      setProblemsLoading(false);
    }
  };

  const [contests, setContests] = useState<ContestData[]>([]);
  const [contestsLoading, setContestsLoading] = useState(true);
  const [contestsError, setContestsError] = useState<string | null>(null);

  const [members, setMembers] = useState<{ id: string; name: string; email: string; joinDate: string; solvedProblems: number }[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    if (!group?.id) return;
    let cancelled = false;
    setMembersLoading(true);
    setMembersError(null);
    groupService
      .getStudents(Number(group.id))
      .then((data) => {
        if (cancelled) return;
        setMembers(
          data.map((x) => ({
            id: String(x.studentId),
            name: x.fullName,
            email: '',
            joinDate: x.joinDate,
            solvedProblems: 0,
          })),
        );
      })
      .catch((err) => {
        if (!cancelled)
          setMembersError(getApiErrorMessage(err, t('student.groupDetails.loadStudentsFailed', 'Failed to load students')));
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [group?.id, t]);

  useEffect(() => {
    if (!group?.id) return;
    let cancelled = false;
    setContestsLoading(true);
    setContestsError(null);
    groupService
      .getContests(Number(group.id))
      .then((data) => {
        if (cancelled) return;
        const base = data.map<ContestData>((x) => {
          return {
            id: String(x.contestId),
            title: x.title,
            status: getContestStatus(x.startAt, x.endAt),
            difficulty: 'Medium',
            participants: group.studentsCount,
            problemsCount: 0,
            startDate: x.startAt,
            endDate: x.endAt,
          };
        });
        setContests(base);
        base.forEach((c) => {
          Promise.all([
            contestService.getById(Number(c.id)).catch(() => null),
            contestService.getMyProblems(Number(c.id)).catch(() => [] as Record<string, any>[]),
          ]).then(([info, problems]) => {
            if (cancelled) return;
            const difficulty = problems.length
              ? DIFFICULTY_LABEL[
                  Math.round(
                    problems.reduce((sum, p) => sum + (Number(p.difficulty) || 2), 0) / problems.length,
                  )
                ] ?? 'Medium'
              : 'Medium';
            setContests((prev) =>
              prev.map((p) =>
                p.id === c.id
                  ? {
                      ...p,
                      participants: group.studentsCount,
                      problemsCount: info?.problemCount ?? problems.length,
                      difficulty,
                    }
                  : p,
              ),
            );
          });
        });
      })
      .catch((err) => {
        if (!cancelled)
          setContestsError(getApiErrorMessage(err, t('student.groupDetails.loadContestsFailed', 'Failed to load contests')));
      })
      .finally(() => {
        if (!cancelled) setContestsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [group?.id, t]);

  const [courseProgress, setCourseProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!group?.id) return;
    let cancelled = false;
    groupService
      .getProgress(Number(group.id))
      .then((value) => {
        if (!cancelled) setCourseProgress(value);
      })
      .catch(() => {
        if (!cancelled) setCourseProgress(0);
      });
    return () => {
      cancelled = true;
    };
  }, [group?.id]);

  // Submit solution modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [solutionText, setSolutionText] = useState('');
  const [solutionImage, setSolutionImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionProblem, setQuestionProblem] = useState<any>(null);

  // View feedback modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackProblem, setFeedbackProblem] = useState<any>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const filteredStudents = members.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const filteredContests = contests.filter((contest) =>
    contest.title.toLowerCase().includes(contestSearchQuery.toLowerCase())
  );

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const url = await problemsService.uploadImage(file);
      setSolutionImage(url);
    } catch (err) {
      setProblemsError(getApiErrorMessage(err, t('student.groupDetails.imageUploadFailed', 'Failed to upload image')));
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedProblem) return;
    if (!solutionText.trim() && !solutionImage) {
      setProblemsError(t('student.groupDetails.solutionRequired', 'Provide a text solution or an image'));
      return;
    }
    setProblemsError(null);
    try {
      await problemsService.submitSolution(Number(selectedProblem.id), {
        solutionText: solutionText.trim() || undefined,
        photoFileKey: solutionImage || undefined,
      });
      setSubmitModalOpen(false);
      setSolutionText('');
      setSolutionImage(null);
      setSelectedProblem(null);
      if (selectedContest) await loadContestProblems(selectedContest.id);
    } catch (err) {
      setProblemsError(getApiErrorMessage(err, t('student.groupDetails.submitFailed', 'Failed to submit solution')));
    }
  };

  const openSubmitModal = (problem: any) => {
    setSelectedProblem(problem);
    setSolutionText(problem.textSolution || '');
    setSolutionImage(problem.imageSolution || null);
    setSubmitModalOpen(true);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#059669';
    if (grade >= 70) return '#d97706';
    return '#dc2626';
  };

  // Problems view for ongoing contest
  if (viewingProblems && selectedContest?.status === 'Ongoing') {
    return (
      <StyledContainer>
        <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => setViewingProblems(false)} sx={{ mb: 3 }}>
          {t('student.groupDetails.backToGroup')}
        </Button>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', mb: 4, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                🏆 {selectedContest.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {t('student.groupDetails.ongoingInstructions')}
              </Typography>
            </Box>
            <Chip
              label={t('student.groupDetails.statusOngoing')}
              sx={{
                bgcolor: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                border: '1px solid #a7f3d0',
              }}
            />
          </Box>
        </Paper>

        {problemsError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setProblemsError(null)}>{problemsError}</Alert>
        )}

        <SharedTable
          data={contestProblems}
          columns={[
            {
              id: 'title',
              label: t('student.groupDetails.columns.problem'),
              render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {row.status === 'submitted' ? (
                    <CheckCircle2 size={18} color="#059669" />
                  ) : (
                    <Circle size={18} color="#cbd5e1" />
                  )}
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
                      {row.title}
                    </Typography>
                    {row.status === 'submitted' && (
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px' }}>
                        {t('student.groupDetails.submittedOn', { date: new Date(row.submittedAt).toLocaleDateString() })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )
            },
            { id: 'category', label: t('student.groupDetails.columns.category') },
            {
              id: 'difficulty',
              label: t('student.groupDetails.columns.difficulty'),
              render: (row) => (
                <Chip
                  label={row.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '11px',
                    bgcolor: row.difficulty === 'Easy' ? '#ecfdf5' : row.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                    color: row.difficulty === 'Easy' ? '#059669' : row.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  }}
                />
              )
            },
            {
              id: 'status',
              label: t('student.groupDetails.columns.status'),
              render: (row) => (
                <Chip
                  label={row.status === 'submitted' ? t('student.groupDetails.statusSubmitted') : t('student.groupDetails.statusNotSubmitted')}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '11px',
                    bgcolor: row.status === 'submitted' ? '#ecfdf5' : '#fef2f2',
                    color: row.status === 'submitted' ? '#059669' : '#dc2626',
                  }}
                />
              )
            },
            {
              id: 'action',
              label: t('student.groupDetails.columns.action'),
              render: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variantType="outline"
                    size="small"
                    startIcon={<FileText size={14} />}
                    onClick={() => {
                      setQuestionProblem(row);
                      setQuestionModalOpen(true);
                    }}
                    sx={{ py: 0.5, px: 2, fontSize: '12px' }}
                  >
                    {t('student.groupDetails.viewQuestion')}
                  </Button>
                  <Button
                    variantType={row.status === 'submitted' ? 'outline' : 'default'}
                    size="small"
                    startIcon={row.status === 'submitted' ? <Send size={14} /> : <Send size={14} />}
                    onClick={() => openSubmitModal(row)}
                    sx={{ py: 0.5, px: 1.5, fontSize: '12px' }}
                  >
                    {row.status === 'submitted' ? t('student.groupDetails.edit') : t('student.groupDetails.submit')}
                  </Button>
                </Box>
              )
            }
          ]}
          searchPlaceholder={t('student.groupDetails.searchProblems')}
        />

        {/* View Question Modal */}
        <Dialog
          open={questionModalOpen}
          onClose={() => setQuestionModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: '20px', p: 1 },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#1e293b' }}>
                {questionProblem?.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={questionProblem?.category} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                <Chip
                  label={questionProblem?.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: questionProblem?.difficulty === 'Easy' ? '#ecfdf5' : questionProblem?.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                    color: questionProblem?.difficulty === 'Easy' ? '#059669' : questionProblem?.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  }}
                />
              </Box>
            </Box>
            <IconButton onClick={() => setQuestionModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Question Text */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('student.groupDetails.question')}
              </Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, fontSize: '15px' }}>
                  {questionProblem?.questionText}
                </Typography>
              </Paper>
            </Box>

            {/* Question Image */}
            {questionProblem?.questionImage && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t('student.groupDetails.diagram')}
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <img
                    src={questionProblem.questionImage}
                    alt={t('student.groupDetails.questionImageAlt')}
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  />
                </Paper>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button variantType="outline" onClick={() => setQuestionModalOpen(false)}>
                {t('buttons.close')}
              </Button>
              <Button
                variantType="default"
                startIcon={<Send size={16} />}
                onClick={() => {
                  setQuestionModalOpen(false);
                  openSubmitModal(questionProblem);
                }}
              >
                {t('student.groupDetails.submitSolution')}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Submit Solution Modal */}
        <Dialog
          open={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: '20px', p: 1 },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#1e293b' }}>
                {t('student.groupDetails.submitSolution')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {selectedProblem?.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setSubmitModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Question Summary */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '12px', mb: 1, textTransform: 'uppercase' }}>
                {t('student.groupDetails.question')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                {selectedProblem?.questionText?.substring(0, 200)}...
              </Typography>
              {selectedProblem?.questionImage && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ImageIcon size={14} color="#8B1D23" />
                  <Typography variant="body2" sx={{ color: '#8B1D23', fontWeight: 600, fontSize: '12px' }}>
                    {t('student.groupDetails.questionHasImage')}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Text Solution */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={16} color="#8B1D23" />
                {t('student.groupDetails.textSolution')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '13px' }}>
                {t('student.groupDetails.textSolutionHint')}
              </Typography>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder={t('student.groupDetails.textSolutionPlaceholder')}
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&.Mui-focused fieldset': { borderColor: '#8B1D23', borderWidth: '1.5px' },
                  },
                }}
              />
            </Box>

            {/* Image Solution */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Camera size={16} color="#8B1D23" />
                {t('student.groupDetails.imageSolution')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '13px' }}>
                {t('student.groupDetails.imageSolutionHint')}
              </Typography>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {solutionImage ? (
                <Box sx={{ position: 'relative' }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <img
                      src={resolveMediaUrl(solutionImage) ?? solutionImage}
                      alt={t('student.groupDetails.solutionImageAlt')}
                      style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }}
                    />
                  </Paper>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                    <Button
                      variantType="outline"
                      size="small"
                      startIcon={<Upload size={14} />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ flex: 1 }}
                    >
                      {t('student.groupDetails.replaceImage')}
                    </Button>
                    <Button
                      variantType="danger"
                      size="small"
                      startIcon={<X size={14} />}
                      onClick={() => setSolutionImage(null)}
                      sx={{ flex: 1 }}
                    >
                      {t('student.groupDetails.remove')}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: '#fafafa',
                    borderRadius: '12px',
                    border: '2px dashed #e5e7eb',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#8B1D23',
                      bgcolor: '#fef2f2',
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
                  <Typography sx={{ fontWeight: 600, color: '#64748b', mb: 0.5 }}>
                    {t('student.groupDetails.clickToUpload')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '12px' }}>
                    {t('student.groupDetails.uploadHint')}
                  </Typography>
                </Paper>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Submit Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '13px' }}>
                {!solutionText && !solutionImage ? t('student.groupDetails.provideAtLeastOne') : t('student.groupDetails.readyToSubmit')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variantType="outline" onClick={() => setSubmitModalOpen(false)}>
                  {t('buttons.cancel')}
                </Button>
                <Button
                  variantType="default"
                  startIcon={<Send size={16} />}
                  onClick={handleSubmitSolution}
                  disabled={!solutionText.trim() && !solutionImage}
                  sx={{ py: 0.5, px: 2, fontSize: '12px', backgroundColor: '#fff', color: '#8B1D23', '&:hover': { backgroundColor: '#fff', color: '#8B1D23' } }}
                >
                  {selectedProblem?.status === 'submitted' ? t('student.groupDetails.updateSolution') : t('student.groupDetails.submitSolution')}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </StyledContainer>
    );
  }

  // Problems view for ended contest (graded by trainer)
  if (viewingProblems && selectedContest?.status === 'Ended') {
    const totalGrade = contestProblems.reduce((sum, p) => sum + (p.grade || 0), 0);
    const maxTotalGrade = contestProblems.reduce((sum, p) => sum + (p.maxGrade || 0), 0);
    const averageGrade = maxTotalGrade > 0 ? Math.round((totalGrade / maxTotalGrade) * 100) : 0;

    return (
      <StyledContainer>
        <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => setViewingProblems(false)} sx={{ mb: 3 }}>
          {t('student.groupDetails.backToGroup')}
        </Button>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', mb: 4, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                📊 {t('student.groupDetails.resultsTitle', { title: selectedContest.title })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {t('student.groupDetails.endedDescription')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <Typography sx={{ fontWeight: 800, color: getGradeColor(averageGrade), fontSize: '28px', lineHeight: 1 }}>
                {averageGrade}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groupDetails.averageGrade')}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {problemsError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setProblemsError(null)}>{problemsError}</Alert>
        )}

        <SharedTable
          data={contestProblems}
          columns={[
            {
              id: 'title',
              label: t('student.groupDetails.columns.problem'),
              render: (row) => (
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
                    {row.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px' }}>
                    {t('student.groupDetails.submittedOn', { date: new Date(row.submittedAt).toLocaleDateString() })}
                  </Typography>
                </Box>
              )
            },
            { id: 'category', label: t('student.groupDetails.columns.category') },
            {
              id: 'difficulty',
              label: t('student.groupDetails.columns.difficulty'),
              render: (row) => (
                <Chip
                  label={row.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '11px',
                    bgcolor: row.difficulty === 'Easy' ? '#ecfdf5' : row.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                    color: row.difficulty === 'Easy' ? '#059669' : row.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  }}
                />
              )
            },
            {
              id: 'grade',
              label: t('student.groupDetails.columns.grade'),
              render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: getGradeColor(row.grade), fontSize: '16px' }}>
                    {row.grade}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '12px' }}>
                    / {row.maxGrade}
                  </Typography>
                  {row.grade >= 90 && <Star size={14} color="#059669" fill="#059669" />}
                </Box>
              )
            },
            {
              id: 'actions',
              label: t('student.groupDetails.columns.details'),
              render: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variantType="outline"
                    size="small"
                    startIcon={<FileText size={14} />}
                    onClick={() => {
                      setQuestionProblem(row);
                      setQuestionModalOpen(true);
                    }}
                    sx={{ py: 0.5, px: 1.5, fontSize: '11px' }}
                  >
                    {t('student.groupDetails.question')}
                  </Button>
                  <Button
                    variantType="default"
                    size="small"
                    startIcon={<Award size={14} />}
                    onClick={() => {
                      setFeedbackProblem(row);
                      setFeedbackModalOpen(true);
                    }}
                    sx={{ py: 0.5, px: 1.5, fontSize: '11px' }}
                  >
                    {t('student.groupDetails.feedback')}
                  </Button>
                </Box>
              )
            }
          ]}
          searchPlaceholder={t('student.groupDetails.searchProblems')}
        />

        {/* View Question Modal (for ended contest) */}
        <Dialog
          open={questionModalOpen}
          onClose={() => setQuestionModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: '20px', p: 1 },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#1e293b' }}>
                {questionProblem?.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={questionProblem?.category} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                <Chip
                  label={questionProblem?.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: questionProblem?.difficulty === 'Easy' ? '#ecfdf5' : questionProblem?.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                    color: questionProblem?.difficulty === 'Easy' ? '#059669' : questionProblem?.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  }}
                />
              </Box>
            </Box>
            <IconButton onClick={() => setQuestionModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Question Text */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('student.groupDetails.question')}
              </Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, fontSize: '15px' }}>
                  {questionProblem?.questionText}
                </Typography>
              </Paper>
            </Box>

            {/* Question Image */}
            {questionProblem?.questionImage && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t('student.groupDetails.diagram')}
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <img
                    src={questionProblem.questionImage}
                    alt={t('student.groupDetails.questionImageAlt')}
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  />
                </Paper>
              </Box>
            )}

            {/* Your Solution */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('student.groupDetails.yourSolution')}
              </Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                  {questionProblem?.textSolution}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variantType="default" onClick={() => setQuestionModalOpen(false)}>
                {t('buttons.close')}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Feedback Modal */}
        <Dialog
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: '20px', p: 1 },
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#1e293b' }}>
              {t('student.groupDetails.trainerFeedback')}
            </Typography>
            <IconButton onClick={() => setFeedbackModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                {feedbackProblem?.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={feedbackProblem?.category} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                <Chip
                  label={feedbackProblem?.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: feedbackProblem?.difficulty === 'Easy' ? '#ecfdf5' : feedbackProblem?.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2',
                    color: feedbackProblem?.difficulty === 'Easy' ? '#059669' : feedbackProblem?.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                  {t('student.groupDetails.yourGrade')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 800, color: getGradeColor(feedbackProblem?.grade || 0), fontSize: '36px', lineHeight: 1 }}>
                  {feedbackProblem?.grade}
                </Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '18px', fontWeight: 600 }}>
                  / {feedbackProblem?.maxGrade}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('student.groupDetails.trainerComments')}
              </Typography>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                  {feedbackProblem?.trainerFeedback}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variantType="default" onClick={() => setFeedbackModalOpen(false)}>
                {t('buttons.close')}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </StyledContainer>
    );
  }

  // Main group details view
  return (
    <StyledContainer>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={onBack} sx={{ mb: 3 }}>
        {t('student.groupDetails.backToMyGroups')}
      </Button>

      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              {group.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 2, maxWidth: '800px' }}>
              {group.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={18} color="#8B1D23" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('student.groupDetails.studentsCount', { count: group.studentsCount })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Award size={18} color="#8B1D23" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('student.groupDetails.trainerLabel', { name: group.trainerName })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={18} color="#8B1D23" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('student.groupDetails.since', { date: new Date(group.createdDate).toLocaleDateString() })}</Typography>
              </Box>
            </Box>
          </Box>
          {courseProgress !== null && (
            <Box sx={{ minWidth: 200 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                  {t('student.groupDetails.courseProgress')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#8B1D23', fontWeight: 800, fontSize: '12px' }}>
                  {courseProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={courseProgress}
                sx={{
                  height: 8,
                  borderRadius: '999px',
                  bgcolor: '#fee2e2',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#8B1D23',
                    borderRadius: '999px',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </HeaderSection>

      <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 2,
            borderBottom: '1px solid #e5e7eb',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              color: '#64748b',
              minHeight: 64,
              '&.Mui-selected': { color: '#8B1D23' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#8B1D23', height: 3, borderRadius: '999px' },
          }}
        >
          <Tab label={t('student.groupDetails.tabContests')} icon={<BookOpen size={16} />} iconPosition="start" />
          <Tab label={t('student.groupDetails.tabStudents')} icon={<Users size={16} />} iconPosition="start" />
          <Tab label={t('student.groupDetails.tabTrainer')} icon={<Award size={16} />} iconPosition="start" />
        </Tabs>

        <TabContentWrapper>
          {/* Contests Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <SearchInput
                type="text"
                placeholder={t('student.groupDetails.searchContests')}
                value={contestSearchQuery}
                onChange={(e) => setContestSearchQuery(e.target.value)}
                style={{ marginBottom: 0, maxWidth: '400px' }}
              />
            </Box>

            {contestsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#8B1D23' }} />
              </Box>
            ) : contestsError ? (
              <Alert severity="error" sx={{ mt: 2 }}>{contestsError}</Alert>
            ) : filteredContests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>{t('student.groupDetails.noContestsFound')}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {filteredContests.map((c) => (
                  <ContestCard
                    key={c.id}
                    contest={c}
                    onViewProblems={() => { setSelectedContest(c); setViewingProblems(true); void loadContestProblems(c.id); }}
                  />
                ))}
              </Box>
            )}
          </TabPanel>

          {/* Students Tab */}
          <TabPanel value={tabValue} index={1}>
            <SearchInput
              type="text"
              placeholder={t('student.groupDetails.searchStudents')}
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
            />
            {membersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#8B1D23' }} />
              </Box>
            ) : membersError ? (
              <Alert severity="error" sx={{ mt: 2 }}>{membersError}</Alert>
            ) : filteredStudents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Users size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>{t('student.groupDetails.noStudents', 'No students in this group')}</Typography>
              </Box>
            ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {filteredStudents.map((student) => (
                <StudentCardStyled key={student.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#fef2f2', color: '#8B1D23', width: 48, height: 48, fontWeight: 700, fontSize: '16px' }}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{student.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '12px' }}>{student.email}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      {t('student.groupDetails.joined')} <span style={{ fontWeight: 600, color: '#1e293b' }}>{new Date(student.joinDate).toLocaleDateString()}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', justifyContent: 'space-between', fontSize: '12px', mb: 2 }}>
                      {t('student.groupDetails.solved')} <span style={{ fontWeight: 700, color: '#8B1D23' }}>{student.solvedProblems}</span>
                    </Typography>
                  </Box>
                  <Button
                    variantType="outline"
                    size="small"
                    fullWidth
                    onClick={() => navigate(`/profile/${student.id}`)}
                    sx={{
                      mt: 1,
                      borderColor: '#8B1D23',
                      color: '#ffffff',
                      '&:hover': {
                        borderColor: '#6B141A',
                        backgroundColor: '#fef2f2',
                        color: '#8B1D23'
                      }
                    }}
                  >
                    {t('student.groupDetails.viewProfile')}
                  </Button>
                </StudentCardStyled>
              ))}
            </Box>
            )}
          </TabPanel>
          {/* Trainer Tab */}
          <TabPanel value={tabValue} index={2}>
            {!group.trainerName ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Award size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>{t('student.groupDetails.noTrainer', 'No trainer assigned to this group')}</Typography>
              </Box>
            ) : (
            <Paper elevation={0} sx={{ p: 4, maxWidth: 600, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 88,
                    bgcolor: '#8B1D23',
                    fontSize: 30,
                    fontWeight: 700,
                    borderRadius: '16px',
                  }}
                >
                  {group.trainerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{group.trainerName}</Typography>
                  {group.trainerEmail && (
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>{group.trainerEmail}</Typography>
                  )}
                </Box>
              </Box>
              {group.trainerSpecialization && (
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t('student.groupDetails.expertise')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={group.trainerSpecialization}
                      sx={{
                        bgcolor: '#ffffff',
                        color: '#1e293b',
                        fontWeight: 700,
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
            )}
          </TabPanel>
        </TabContentWrapper>
      </Paper>
    </StyledContainer>
  );
};

export default GroupDetailsPage;
