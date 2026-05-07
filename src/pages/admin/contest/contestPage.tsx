import React, { useState } from 'react';
import { InputAdornment, Typography } from '@mui/material';
import { Search } from 'lucide-react';

import {
  StyledContainer,
  HeaderWrapper,
  SubtitleWrapper,
  SearchWrapper,
  StyledSearchField,
  ContestsGrid,
  EmptyStateWrapper,
} from './constentStyle';

import type { ContestData } from '../../../types';
import { ContestCard } from '../../../components/ui/card/contestCard';

const mockContests: ContestData[] = [
  {
    id: 1,
    title: 'Spring Programming  2026',
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

export const ContestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleView = (id: number) => console.log('View contest', id);
  const handleEdit = (id: number) => console.log('Edit contest', id);
  const handleProblems = (id: number) => console.log('Problems contest', id);
  const handleDelete = (id: number) => console.log('Delete contest', id);

  const filteredContests = mockContests.filter(
    (contest) => contest.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) as ContestData[];

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
              onView={handleView}
              onEdit={handleEdit}
              onProblems={handleProblems}
              onDelete={handleDelete}
            />
          ))}
        </ContestsGrid>
      )}
    </StyledContainer>
  );
};

export default ContestsPage;