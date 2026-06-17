import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, InputAdornment, Box } from '@mui/material';
import { Search, BookOpen, Users, Trophy, Target } from 'lucide-react';
import { GroupCard } from '../../../components/ui/card/studentGroupCard';
import type { GroupData } from '../../../types';
import {
  StyledContainer,
  TitleWrapper,
  SubtitleWrapper,
  SearchWrapper,
  StyledSearchField,
  GroupsGrid,
  EmptyStateWrapper,
  StatsBar,
  StatCard,
} from './groupStyle';
import { GroupDetailsPage } from './GroupDetailsPage';

const mockGroups: GroupData[] = [
  {
    id: '1',
    title: 'Advanced Algorithms',
    description: 'Focus on advanced algorithmic concepts and competitive programming. Master sorting, searching, and dynamic programming techniques.',
    studentsCount: 24,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-01-15',
    status: 'active',
    progress: 65,
  },
  {
    id: '2',
    title: 'Data Structures Fundamentals',
    description: 'Learn fundamental data structures and their applications in real-world problem solving scenarios.',
    studentsCount: 18,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-02-01',
    status: 'active',
    progress: 40,
  },
  {
    id: '3',
    title: 'Beginner Practice',
    description: 'Entry-level problem solving and programming basics for those starting their coding journey.',
    studentsCount: 32,
    trainerCount: 1,
    trainerName: 'Emily Davis',
    createdDate: '2026-01-20',
    status: 'completed',
    progress: 100,
  },
  {
    id: '4',
    title: 'Competitive Programming',
    description: 'Advanced competitive programming techniques for contest preparation and ICPC training.',
    studentsCount: 15,
    trainerCount: 1,
    trainerName: 'Ahmed Khan',
    createdDate: '2026-03-01',
    status: 'upcoming',
    progress: 0,
  },
];

export const StudentGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const [groups] = useState<GroupData[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingGroupDetails, setViewingGroupDetails] = useState(false);
  const [detailsGroup, setDetailsGroup] = useState<GroupData | null>(null);

  const handleViewGroupDetails = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      setDetailsGroup(group);
      setViewingGroupDetails(true);
    }
  };

  const handleBackFromDetails = () => {
    setViewingGroupDetails(false);
    setDetailsGroup(null);
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGroups = groups.filter(g => g.status === 'active').length;
  const completedGroups = groups.filter(g => g.status === 'completed').length;

  if (viewingGroupDetails && detailsGroup) {
    return (
      <GroupDetailsPage
        group={detailsGroup}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <StyledContainer>
      <TitleWrapper>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          {t('student.groups.title')}
        </Typography>
      </TitleWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          {t('student.groups.subtitle')}
        </Typography>
      </SubtitleWrapper>

      <StatsBar>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#8B1D23" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '22px', lineHeight: 1 }}>
                {groups.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.totalGroups')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={20} color="#059669" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '22px', lineHeight: 1 }}>
                {activeGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.active')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={20} color="#0284c7" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '22px', lineHeight: 1 }}>
                {completedGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.completed')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#d97706" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '22px', lineHeight: 1 }}>
                {groups.length - completedGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.inProgress')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
      </StatsBar>

      <SearchWrapper>
        <StyledSearchField
          size="small"
          placeholder={t('student.groups.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '100%', maxWidth: 450 }}
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
          <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600, mb: 1 }}>
            {t('student.groups.noGroupsFound')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
            {searchQuery ? t('student.groups.adjustSearch') : t('student.groups.notEnrolled')}
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <GroupsGrid>
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onView={handleViewGroupDetails}
            />
          ))}
        </GroupsGrid>
      )}
    </StyledContainer>
  );
};

export default StudentGroupsPage;
