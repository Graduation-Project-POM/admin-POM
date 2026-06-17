import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

const mockTrainer = {
  id: 'trainer-1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: 'JS',
  expertise: ['Algorithms', 'Data Structures', 'Competitive Programming'],
  bio: 'Experienced trainer with 8+ years in programming education. Specializes in algorithmic problem solving and competitive programming training.',
  rating: 4.8,
  totalStudents: 156,
};

const mockStudents = [
  { id: 'student-1', name: 'Ahmed Ali', email: 'ahmed@example.com', joinDate: '2026-01-20', solvedProblems: 45 },
  { id: 'student-2', name: 'Fatima Mohamed', email: 'fatima@example.com', joinDate: '2026-01-22', solvedProblems: 38 },
  { id: 'student-3', name: 'Omar Hassan', email: 'omar@example.com', joinDate: '2026-01-25', solvedProblems: 52 },
  { id: 'student-4', name: 'Layla Ibrahim', email: 'layla@example.com', joinDate: '2026-02-01', solvedProblems: 31 },
  { id: 'student-5', name: 'Karim Saeed', email: 'karim@example.com', joinDate: '2026-02-03', solvedProblems: 47 },
  { id: 'student-6', name: 'Nour Ahmed', email: 'nour@example.com', joinDate: '2026-02-05', solvedProblems: 29 },
];

const mockContests: ContestData[] = [
  {
    id: '1',
    title: 'Sorting & Searching',
    problemsCount: 5,
    participants: 24,
    startDate: '2026-01-20',
    endDate: '2026-01-27',
    status: 'Ended',
    difficulty: 'Medium',
  },
  {
    id: '2',
    title: 'Greedy Algorithms',
    problemsCount: 6,
    participants: 22,
    startDate: '2026-01-27',
    endDate: '2026-02-03',
    status: 'Ended',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Dynamic Programming',
    problemsCount: 8,
    participants: 20,
    startDate: '2026-02-03',
    endDate: '2026-02-10',
    status: 'Ongoing',
    difficulty: 'Hard',
  },
  {
    id: '4',
    title: 'Final Challenge',
    problemsCount: 10,
    participants: 0,
    startDate: '2026-02-17',
    endDate: '2026-02-24',
    status: 'Upcoming',
    difficulty: 'Hard',
  },
];

// Problems for ongoing contest (student can submit)
const ongoingProblems = [
  {
    id: '1',
    title: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    status: 'submitted',
    questionText: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',
    questionImage: 'https://miro.medium.com/max/1400/1*2qNJm1QwYVHqQqVLFbQ3Qg.png',
    textSolution: 'I used a bottom-up dynamic programming approach with a 2D table dp[i][j] representing the LCS length of text1[0..i-1] and text2[0..j-1]. Time complexity: O(n*m), Space: O(n*m).',
    imageSolution: '',
    submittedAt: '2026-02-05',
  },
  {
    id: '2',
    title: 'Knapsack Problem',
    category: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    status: 'submitted',
    questionText: 'Given n items, each with a weight and a value, determine the maximum value that can be obtained by selecting a subset of items such that the total weight does not exceed the capacity W.',
    questionImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Knapsack.svg/450px-Knapsack.svg.png',
    textSolution: 'Classic 0/1 knapsack solved with memoization. Created a recursive function with two parameters: current index and remaining capacity.',
    imageSolution: '',
    submittedAt: '2026-02-06',
  },
  {
    id: '3',
    title: 'Coin Change',
    category: 'Dynamic Programming',
    difficulty: 'Easy' as const,
    status: 'not_submitted',
    questionText: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount. If it cannot be made up, return -1.',
    questionImage: '',
    textSolution: '',
    imageSolution: '',
    submittedAt: '',
  },
  {
    id: '4',
    title: 'Edit Distance',
    category: 'Dynamic Programming',
    difficulty: 'Hard' as const,
    status: 'not_submitted',
    questionText: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.',
    questionImage: 'https://www.educative.io/api/edpresso/shot/6697204883701760/image/5669498796941312',
    textSolution: '',
    imageSolution: '',
    submittedAt: '',
  },
  {
    id: '5',
    title: 'Matrix Chain Multiplication',
    category: 'Dynamic Programming',
    difficulty: 'Hard' as const,
    status: 'not_submitted',
    questionText: 'Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not actually to perform the multiplications, but merely to decide the sequence of the matrix multiplications involved.',
    questionImage: '',
    textSolution: '',
    imageSolution: '',
    submittedAt: '',
  },
];

// Problems for ended contest (trainer graded)
const endedProblems = [
  {
    id: '1',
    title: 'Binary Search',
    category: 'Algorithms',
    difficulty: 'Easy' as const,
    questionText: 'Implement binary search to find a target value in a sorted array. Return the index if found, otherwise return -1.',
    questionImage: '',
    textSolution: 'Implemented iterative binary search with left and right pointers. Compare middle element with target and narrow down the search space.',
    imageSolution: '',
    grade: 95,
    maxGrade: 100,
    trainerFeedback: 'Good solution! Clean implementation. Consider adding edge case handling for empty arrays.',
    submittedAt: '2026-01-22',
    gradedAt: '2026-01-28',
  },
  {
    id: '2',
    title: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'Medium' as const,
    questionText: 'Implement the merge sort algorithm to sort an array of integers in ascending order.',
    questionImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Merge-sort-example-300px.gif/220px-Merge-sort-example-300px.gif',
    textSolution: 'Divide and conquer approach. Split array into halves, recursively sort each half, then merge the sorted halves.',
    imageSolution: '',
    grade: 80,
    maxGrade: 100,
    trainerFeedback: 'Correct approach but could optimize space complexity. Try to do it in-place.',
    submittedAt: '2026-01-23',
    gradedAt: '2026-01-28',
  },
  {
    id: '3',
    title: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'Medium' as const,
    questionText: 'Implement quicksort with an efficient pivot selection strategy.',
    questionImage: '',
    textSolution: 'Used median-of-three pivot selection. Partition the array around the pivot, then recursively sort the two halves.',
    imageSolution: '',
    grade: 100,
    maxGrade: 100,
    trainerFeedback: 'Perfect solution! Excellent pivot selection strategy. Very well explained.',
    submittedAt: '2026-01-24',
    gradedAt: '2026-01-28',
  },
  {
    id: '4',
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'Easy' as const,
    questionText: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    questionImage: '',
    textSolution: 'Used a hash map to store each number and its index. For each number, check if target - num exists in the map.',
    imageSolution: '',
    grade: 100,
    maxGrade: 100,
    trainerFeedback: 'Great use of hash map for O(n) solution! Clean and efficient.',
    submittedAt: '2026-01-21',
    gradedAt: '2026-01-28',
  },
  {
    id: '5',
    title: 'Container With Most Water',
    category: 'Two Pointers',
    difficulty: 'Medium' as const,
    questionText: 'Given n non-negative integers representing heights, find two lines that together with the x-axis form a container that holds the most water.',
    questionImage: 'https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg',
    textSolution: 'Two pointer approach starting from both ends. Move the pointer with smaller height inward.',
    imageSolution: '',
    grade: 70,
    maxGrade: 100,
    trainerFeedback: 'Correct but consider edge cases more carefully. Also, explain why moving the shorter pointer is optimal.',
    submittedAt: '2026-01-25',
    gradedAt: '2026-01-28',
  },
];

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

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const filteredContests = mockContests.filter((contest) =>
    contest.title.toLowerCase().includes(contestSearchQuery.toLowerCase())
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSolutionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSolution = () => {
    // In real app, this would send to API
    console.log('Submitting solution:', { text: solutionText, image: solutionImage });
    setSubmitModalOpen(false);
    setSolutionText('');
    setSolutionImage(null);
    setSelectedProblem(null);
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

        <SharedTable
          data={ongoingProblems}
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
                      src={solutionImage}
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
    const totalGrade = endedProblems.reduce((sum, p) => sum + (p.grade || 0), 0);
    const maxTotalGrade = endedProblems.reduce((sum, p) => sum + (p.maxGrade || 0), 0);
    const averageGrade = Math.round((totalGrade / maxTotalGrade) * 100);

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

        <SharedTable
          data={endedProblems}
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
          {group.progress !== undefined && (
            <Box sx={{ minWidth: 200 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                  {t('student.groupDetails.courseProgress')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#8B1D23', fontWeight: 800, fontSize: '12px' }}>
                  {group.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={group.progress}
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

            {filteredContests.length === 0 ? (
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
                    onViewProblems={() => { setSelectedContest(c); setViewingProblems(true); }}
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
          </TabPanel>
          {/* Trainer Tab */}
          <TabPanel value={tabValue} index={2}>
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
                  {mockTrainer.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{mockTrainer.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>{mockTrainer.email}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={16} color="#d97706" fill="#d97706" />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {mockTrainer.rating}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {t('student.groupDetails.studentsTrained', { count: mockTrainer.totalStudents })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 700, mb: 1, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t('student.groupDetails.bio')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, fontWeight: 500 }}>
                  {mockTrainer.bio}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t('student.groupDetails.expertise')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {mockTrainer.expertise.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        bgcolor: '#ffffff',
                        color: '#1e293b',
                        fontWeight: 700,
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </TabPanel>
        </TabContentWrapper>
      </Paper>
    </StyledContainer>
  );
};

export default GroupDetailsPage;
