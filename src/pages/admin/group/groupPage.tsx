import React, { useState } from 'react';
import { Typography, InputAdornment, Stack } from '@mui/material';
import { Plus, Search  } from 'lucide-react';
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
import { Button } from '../../../components/ui/button/Button';
import { ConfirmationModal } from '../../../components/common/modal/ConfirmationModal';
import Create from './Create';
import Edit from './Edit';
import Members from './Members';
import View from './View';
import { GroupDetailsPage } from './groupDetailsPage';

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
  const [groups, setGroups] = useState<GroupData[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [viewingGroupDetails, setViewingGroupDetails] = useState(false);
  const [detailsGroup, setDetailsGroup] = useState<GroupData | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    id: string;
  }>({
    open: false,
    id: '',
  });

  const handleCreate = (newGroup: GroupData) => {
    setGroups([newGroup, ...groups]);
  };

  const handleUpdate = (updatedGroup: GroupData) => {
    setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const handleDeleteClick = (id: string) => {
    setConfirmConfig({ open: true, id });
  };

  const handleConfirmDelete = () => {
    setGroups(groups.filter(g => g.id !== confirmConfig.id));
    setConfirmConfig({ open: false, id: '' });
  };

  // Handler for viewing group details
  const handleViewGroupDetails = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      setDetailsGroup(group);
      setViewingGroupDetails(true);
    }
  };

  // Handler for going back from details page
  const handleBackFromDetails = () => {
    setViewingGroupDetails(false);
    setDetailsGroup(null);
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If viewing group details, show details page
  if (viewingGroupDetails && detailsGroup) {
    return (
      <GroupDetailsPage 
        group={detailsGroup} 
        onBack={handleBackFromDetails}
      />
    );
  }

  // Otherwise show groups list
  return (
    <StyledContainer>
      <TitleWrapper>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Training Groups
        </Typography>
      </TitleWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          Manage student groups, trainers, and learning cohorts
        </Typography>
      </SubtitleWrapper>

      <SearchWrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <StyledSearchField
          size="small"
          placeholder="Search groups by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 400 }}
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

        <Stack direction="row" spacing={2}>
          <Button 
            variantType="default" 
            onClick={() => setIsCreateOpen(true)}
            startIcon={<Plus size={18} />}
          >
            Create Group
          </Button>
        </Stack>
      </SearchWrapper>

      {filteredGroups.length === 0 ? (
        <EmptyStateWrapper>
          <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            No groups found matching your search.
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <GroupsGrid>
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onView={(id) => {
                // Navigate to details page when clicking on a group card
                handleViewGroupDetails(id);
              }}
              onEdit={(g) => {
                setSelectedGroup(g);
                setIsEditOpen(true);
              }}
              onMembers={(g) => {
                setSelectedGroup(g);
                setIsMembersOpen(true);
              }}
              onDelete={handleDeleteClick}
            />
          ))}
        </GroupsGrid>
      )}

      {/* Modals */}
      <Create 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleCreate} 
      />

      <Edit 
        open={isEditOpen} 
        onClose={() => {
            setIsEditOpen(false);
            setSelectedGroup(null);
        }} 
        group={selectedGroup}
        onSave={handleUpdate} 
      />

      <View 
        open={isViewOpen} 
        onClose={() => {
            setIsViewOpen(false);
            setSelectedGroup(null);
        }} 
        group={selectedGroup}
      />

      <Members 
        open={isMembersOpen} 
        onClose={() => {
            setIsMembersOpen(false);
            setSelectedGroup(null);
        }} 
        group={selectedGroup}
      />

      <ConfirmationModal 
        open={confirmConfig.open}
        onClose={() => setConfirmConfig({ open: false, id: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        message="Are you sure you want to delete this group? This will also unassign all members."
      />
    </StyledContainer>
  );
};

export default GroupsPage;