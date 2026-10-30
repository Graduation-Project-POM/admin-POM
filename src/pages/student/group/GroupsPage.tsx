import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, InputAdornment, Box, Alert } from '@mui/material';
import { Search, BookOpen, Users, Trophy, Target } from 'lucide-react';
import { GroupCard } from '../../../components/ui/card/studentGroupCard';
import type { GroupData } from '../../../types';
import type { Group } from '../../../types/group';
import { groupService } from '../../../services/groupService';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  StyledContainer,
  SearchWrapper,
  StyledSearchField,
  GroupsGrid,
  EmptyStateWrapper,
  StatsBar,
  StatCard,
} from './groupStyle';
import { GroupDetailsPage } from './GroupDetailsPage';
import { brand, neutral, statusTone } from '../../../theme';
import { LoadingState } from '../../../components/common/states';
import { PageHeader } from '../../../components/common/shell';

const toGroupData = (g: Group): GroupData => ({
  id: String(g.id),
  title: g.name,
  description: g.description ?? '',
  studentsCount: g.studentCount,
  trainerCount: g.trainerName ? 1 : 0,
  trainerName: g.trainerName ?? '',
  trainerEmail: g.trainerEmail ?? '',
  trainerSpecialization: g.trainerSpecialization ?? '',
  trainerId: g.trainerId,
  createdDate: g.startDate,
  status: 'active',
  progress: 0,
});

export const StudentGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingGroupDetails, setViewingGroupDetails] = useState(false);
  const [detailsGroup, setDetailsGroup] = useState<GroupData | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    groupService
      .getMyGroups()
      .then((data) => {
        if (cancelled) return;
        const groupData = data.map(toGroupData);
        setGroups(groupData);
        groupData.forEach((g) => {
          groupService
            .getProgress(Number(g.id))
            .then((progress) => {
              if (cancelled) return;
              setGroups((prev) =>
                prev.map((p) => (p.id === g.id ? { ...p, progress } : p)),
              );
            })
            .catch(() => {
            });
        });
      })
      .catch((err) => {
        if (!cancelled)
          setError(getApiErrorMessage(err, t('student.groups.loadFailed', 'Failed to load your groups')));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

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
      <PageHeader
        title={t('student.groups.title')}
        subtitle={t('student.groups.subtitle')}
      />

      <StatsBar>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color={brand[500]} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '22px', lineHeight: 1 }}>
                {groups.length}
              </Typography>
              <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.totalGroups')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: statusTone.success.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={20} color={statusTone.success.solid} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '22px', lineHeight: 1 }}>
                {activeGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
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
              <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '22px', lineHeight: 1 }}>
                {completedGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
                {t('student.groups.completed')}
              </Typography>
            </Box>
          </Box>
        </StatCard>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: statusTone.warning.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color={statusTone.warning.solid} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '22px', lineHeight: 1 }}>
                {groups.length - completedGroups}
              </Typography>
              <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>
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
                  <Search size={18} color={neutral[400]} />
                </InputAdornment>
              ),
            },
          }}
        />
      </SearchWrapper>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : filteredGroups.length === 0 ? (
        <EmptyStateWrapper>
          <BookOpen size={48} color={neutral[300]} style={{ marginBottom: 16 }} />
          <Typography variant="body1" sx={{ color: neutral[400], fontWeight: 600, mb: 1 }}>
            {t('student.groups.noGroupsFound')}
          </Typography>
          <Typography variant="body2" sx={{ color: neutral[300], fontWeight: 500 }}>
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
