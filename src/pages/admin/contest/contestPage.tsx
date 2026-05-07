import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from '@mui/material';
import { Search, ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';

// استيراد المكونات الجاهزة
import {
  StyledContainer,
  HeaderWrapper,
  SubtitleWrapper,
  SearchWrapper,
  StyledSearchField,
  ContestsGrid,
  EmptyStateWrapper,
} from './constentStyle';

import { ContestCard } from '../../../components/ui/card/contestCard';
import type { ContestData } from '../../../types';

interface Problem {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studentsSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

const mockContests: ContestData[] = [
  {
    id: 1,
    title: 'Spring Programming 2026',
    status: 'Upcoming',        
    difficulty: 'Medium',
    participants: 156,
    problemsCount: 8,
    startDate: 'Apr 15, 2026 at 09:00 AM',
    endDate: 'Apr 22, 2026 at 09:00 PM',
  },
  {
    id: 2,
    title: 'Code Rush 2026',
    status: 'Ended',           
    difficulty: 'Hard',
    participants: 189,
    problemsCount: 6,
    startDate: 'Mar 20, 2026 at 10:00 AM',
    endDate: 'Mar 20, 2026 at 06:00 PM',
  },
  {
    id: 3,
    title: "Beginner's Challenge",
    status: 'Upcoming',        
    difficulty: 'Easy',
    participants: 67,
    problemsCount: 5,
    startDate: 'May 1, 2026 at 02:00 PM',
    endDate: 'May 3, 2026 at 02:00 PM',
  },
];

const contestProblemsMap: Record<number, Problem[]> = {
  1: [
    { id: 101, name: 'Two Sum', difficulty: 'Easy', studentsSolved: 120, totalSubmissions: 350, acceptanceRate: 78 },
    { id: 102, name: 'Reverse Linked List', difficulty: 'Medium', studentsSolved: 95, totalSubmissions: 210, acceptanceRate: 65 },
  ],
  2: [
    { id: 201, name: 'Maximum Subarray', difficulty: 'Medium', studentsSolved: 80, totalSubmissions: 180, acceptanceRate: 55 },
  ],
  3: [
    { id: 301, name: 'FizzBuzz', difficulty: 'Easy', studentsSolved: 200, totalSubmissions: 250, acceptanceRate: 92 },
  ],
};

export const ContestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [selectedContestTitle, setSelectedContestTitle] = useState<string>('');

  const filteredContests = mockContests.filter((contest) =>
    contest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id: number) => console.log('View contest', id);
  const handleEdit = (id: number) => console.log('Edit contest', id);
  const handleProblems = (id: number, title: string) => {
    setSelectedContestId(id);
    setSelectedContestTitle(title);
  };
  const handleDelete = (id: number) => console.log('Delete contest', id);

  const handleEditProblem = (problemId: number) => console.log('Edit problem', problemId);
  const handleDeleteProblem = (problemId: number) => console.log('Delete problem', problemId);
  const handleAddProblem = () => console.log('Add new problem to contest', selectedContestId);

  if (selectedContestId !== null) {
    const problems = contestProblemsMap[selectedContestId] || [];

    return (
      <StyledContainer maxWidth="xl">
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => setSelectedContestId(null)} sx={{ mb: 3, mt: 2 }}>
          Back to Contests
        </Button>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              🏆 Problems in "{selectedContestTitle}"
            </Typography>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={handleAddProblem} sx={{ bgcolor: '#8B1D23' }}>
              Add Problem
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell><strong>Problem Name</strong></TableCell>
                <TableCell><strong>Difficulty</strong></TableCell>
                <TableCell><strong>Students Solved</strong></TableCell>
                <TableCell><strong>Total Submissions</strong></TableCell>
                <TableCell><strong>Acceptance Rate</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{problem.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 4, bgcolor: problem.difficulty === 'Easy' ? '#16a34a15' : problem.difficulty === 'Medium' ? '#eab30815' : '#dc262615', color: problem.difficulty === 'Easy' ? '#16a34a' : problem.difficulty === 'Medium' ? '#eab308' : '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
                      {problem.difficulty}
                    </Box>
                  </TableCell>
                  <TableCell>{problem.studentsSolved}</TableCell>
                  <TableCell>{problem.totalSubmissions}</TableCell>
                  <TableCell><Typography sx={{ fontWeight: 700, color: '#8B1D23' }}>{problem.acceptanceRate}%</Typography></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEditProblem(problem.id)} sx={{ color: '#3b82f6' }}><Edit size={16} /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteProblem(problem.id)} sx={{ color: '#ef4444' }}><Trash2 size={16} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {problems.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No problems yet. Click "Add Problem".</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <HeaderWrapper><Typography variant="h4" sx={{ fontWeight: 800 }}>Contests Management</Typography></HeaderWrapper>
      <SubtitleWrapper><Typography variant="body2" sx={{ color: 'text.secondary' }}>Create, manage, and monitor programming contests</Typography></SubtitleWrapper>
      <SearchWrapper>
        <StyledSearchField fullWidth size="small" placeholder="Search contests by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} color="#9ca3af" /></InputAdornment> } }} />
      </SearchWrapper>
      {filteredContests.length === 0 ? (
        <EmptyStateWrapper><Typography variant="body1" color="text.secondary">No contests match your search.</Typography></EmptyStateWrapper>
      ) : (
        <ContestsGrid>
          {filteredContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} onView={() => handleView(contest.id)} onEdit={() => handleEdit(contest.id)} onProblems={() => handleProblems(contest.id, contest.title)} onDelete={() => handleDelete(contest.id)} />
          ))}
        </ContestsGrid>
      )}
    </StyledContainer>
  );
};

export default ContestsPage;