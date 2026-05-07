import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  Paper,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';

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
import { SharedTable } from '../../../components/ui/table/tables';
import type { ContestData } from '../../../types';
import { Search } from 'lucide-react';

interface Problem {
  id: string;
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
    { id: '101', name: 'Two Sum', difficulty: 'Easy', studentsSolved: 120, totalSubmissions: 350, acceptanceRate: 78 },
    { id: '102', name: 'Reverse Linked List', difficulty: 'Medium', studentsSolved: 95, totalSubmissions: 210, acceptanceRate: 65 },
  ],
  2: [
    { id: '201', name: 'Maximum Subarray', difficulty: 'Medium', studentsSolved: 80, totalSubmissions: 180, acceptanceRate: 55 },
  ],
  3: [
    { id: '301', name: 'FizzBuzz', difficulty: 'Easy', studentsSolved: 200, totalSubmissions: 250, acceptanceRate: 92 },
  ],
};

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const difficultyStyles = {
    Easy: { bgcolor: '#16a34a15', color: '#16a34a' },
    Medium: { bgcolor: '#eab30815', color: '#eab308' },
    Hard: { bgcolor: '#dc262615', color: '#dc2626' },
  };

  const style = difficultyStyles[difficulty as keyof typeof difficultyStyles] || difficultyStyles.Medium;

  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.3,
        borderRadius: 4,
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {difficulty}
    </Box>
  );
};

const AcceptanceRateDisplay: React.FC<{ rate: number }> = ({ rate }) => (
  <Typography sx={{ fontWeight: 700, color: '#8B1D23' }}>
    {rate}%
  </Typography>
);

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

  const handleEditProblem = (problem: Problem) => {
    console.log('Edit problem', problem.id);
  };

  const handleDeleteProblem = (problemIds: string[]) => {
    console.log('Delete problems', problemIds);
  };

  const handleAddProblem = () => {
    console.log('Add new problem to contest', selectedContestId);
  };

  if (selectedContestId !== null) {
    const problems = contestProblemsMap[selectedContestId] || [];

    const problemColumns = [
      {
        id: 'name',
        label: 'Problem Name',
      },
      {
        id: 'difficulty',
        label: 'Difficulty',
        render: (row: Problem) => <DifficultyBadge difficulty={row.difficulty} />,
      },
      {
        id: 'studentsSolved',
        label: 'Students Solved',
      },
      {
        id: 'totalSubmissions',
        label: 'Total Submissions',
      },
      {
        id: 'acceptanceRate',
        label: 'Acceptance Rate',
        render: (row: Problem) => <AcceptanceRateDisplay rate={row.acceptanceRate} />,
      },
    ];

    return (
      <StyledContainer maxWidth="xl">
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => setSelectedContestId(null)}
          sx={{ mb: 3, mt: 2 }}
        >
          Back to Contests
        </Button>

        <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              🏆 Problems in "{selectedContestTitle}"
            </Typography>
          </Box>
        </Paper>

        <SharedTable
          data={problems}
          columns={problemColumns}
          onEdit={handleEditProblem}
          onDelete={handleDeleteProblem}
          onAdd={handleAddProblem}
          addButtonLabel="Add Problem"
          searchPlaceholder="Search problems..."
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <HeaderWrapper>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Contests Management
        </Typography>
      </HeaderWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Create, manage, and monitor programming contests
        </Typography>
      </SubtitleWrapper>
      <SearchWrapper>
        <StyledSearchField
          fullWidth
          size="small"
          placeholder="Search contests by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9ca3af" />
                </InputAdornment>
              ),
            },
          }}
        />
      </SearchWrapper>
      {filteredContests.length === 0 ? (
        <EmptyStateWrapper>
          <Typography variant="body1" color="text.secondary">
            No contests match your search.
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <ContestsGrid>
          {filteredContests.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onView={() => handleView(contest.id)}
              onEdit={() => handleEdit(contest.id)}
              onProblems={() => handleProblems(contest.id, contest.title)}
              onDelete={() => handleDelete(contest.id)}
            />
          ))}
        </ContestsGrid>
      )}
    </StyledContainer>
  );
};

export default ContestsPage;