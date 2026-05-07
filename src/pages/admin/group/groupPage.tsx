import React, { useState } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import { GroupCard } from '../../../components/ui/card/GroupCard';
import type { GroupData } from '../../../types/index';
import {
  StyledContainer,
  TitleWrapper,
  SubtitleWrapper,
  SearchWrapper,
  StyledSearchField,
  GroupsGrid,
  EmptyStateWrapper,
} from './groupStyle';

const mockGroups: GroupData[] = [
  {
    id: '1',
    title: 'Advanced Algorithms',
    description: 'Focus on advanced algorithmic concepts and competitive programming',
    studentsCount: 24,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-01-15',
  },
  {
    id: '2',
    title: 'Data Structures Fundamentals',
    description: 'Learn fundamental data structures and their applications',
    studentsCount: 18,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-02-01',
  },
  {
    id: '3',
    title: 'Beginner Practice',
    description: 'Entry-level problem solving and programming basics',
    studentsCount: 32,
    trainerCount: 1,
    trainerName: 'Emily Davis',
    createdDate: '2026-01-20',
  },
];

export const GroupsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleView = (id: string) => console.log('View group', id);
  const handleEdit = (id: string) => console.log('Edit group', id);
  const handleMembers = (id: string) => console.log('Members group', id);

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StyledContainer maxWidth="xl">
      <TitleWrapper>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          My Groups
        </Typography>
      </TitleWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Groups you are participating in or managing
        </Typography>
      </SubtitleWrapper>

      <SearchWrapper>
        <StyledSearchField
          fullWidth
          size="small"
          placeholder="Search by title or description..."
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

      {filteredGroups.length === 0 ? (
        <EmptyStateWrapper>
          <Typography variant="body1" color="text.secondary">
            No groups match your search.
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <GroupsGrid>
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onView={handleView}
              onEdit={handleEdit}
              onMembers={handleMembers}
            />
          ))}
        </GroupsGrid>
      )}
    </StyledContainer>
  );
};

export default GroupsPage;