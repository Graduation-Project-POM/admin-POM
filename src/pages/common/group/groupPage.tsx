import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, InputAdornment, Stack, Alert, CircularProgress } from '@mui/material';
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
import CreateGroups from './Create';
import EditGroups from './Edit';
import Members from './Members';
import ViewGroups from './View';
import { GroupDetailsPage } from './groupDetailsPage';
import { useGroups } from '../../../hooks/useGroups';
import { groupService } from '../../../services/groupService';
import { getApiErrorMessage } from '../../../utils/apiError';
import { useAuth } from '../../../services/AuthContext';
import type { Group } from '../../../types/group';

const toGroupData = (g: Group): GroupData => ({
  id: String(g.id),
  title: g.name,
  description: g.description ?? '',
  status: 'active',
  progress: 0,
  studentsCount: g.studentCount,
  trainerCount: g.trainerName ? 1 : 0,
  trainerName: g.trainerName ?? '',
  createdDate: g.startDate,
});

export const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const { role, trainerId } = useAuth();
  const { groups: apiGroups, loading, error, remove, reload } = useGroups();
  const [actionError, setActionError] = useState<string | null>(null);
  // A trainer only ever sees the groups they own (backend already enforces this;
  // this client-side filter mirrors it as defense-in-depth). Admins see all.
  const scopedGroups =
    role === 'Trainer' && trainerId != null
      ? apiGroups.filter((g) => g.trainerId === trainerId)
      : apiGroups;
  const groups = scopedGroups.map(toGroupData);
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

  const handleCreate = async (newGroup: any) => {
    setActionError(null);
    try {
      const res = await groupService.create({
        name: newGroup.title,
        description: newGroup.description,
        trainerId: Number(newGroup.trainerId) || 0,
      });
      if (newGroup.studentIds?.length) {
        await groupService.addStudents(res.groupId, newGroup.studentIds);
      }
      await reload();
    } catch (err) {
      setActionError(getApiErrorMessage(err, t('group.errors.createFailed', 'Failed to create group')));
    }
  };

  const handleUpdate = async (updatedGroup: any) => {
    setActionError(null);
    const id = Number(updatedGroup.id);
    try {
      await groupService.update(id, {
        name: updatedGroup.title,
        description: updatedGroup.description,
      });
      const current = await groupService.getStudents(id);
      const currentIds = current.map((s) => s.studentId);
      const selected: number[] = updatedGroup.studentIds ?? [];
      const toAdd = selected.filter((x) => !currentIds.includes(x));
      const toRemove = currentIds.filter((x) => !selected.includes(x));
      if (toAdd.length) await groupService.addStudents(id, toAdd);
      await Promise.all(toRemove.map((x) => groupService.removeStudent(id, x)));
      await reload();
    } catch (err) {
      setActionError(getApiErrorMessage(err, t('group.errors.updateFailed', 'Failed to update group')));
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmConfig({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmConfig.id;
    setConfirmConfig({ open: false, id: '' });
    setActionError(null);
    try {
      await remove(Number(id));
    } catch (err) {
      setActionError(getApiErrorMessage(err, t('group.errors.deleteFailed', 'Failed to delete group')));
    }
  };

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
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {t('group.list.title')}
        </Typography>
      </TitleWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          {t('group.list.subtitle')}
        </Typography>
      </SubtitleWrapper>

      <SearchWrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <StyledSearchField
          size="small"
          placeholder={t('group.list.searchPlaceholder')}
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
            {t('group.list.createGroup')}
          </Button>
        </Stack>
      </SearchWrapper>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#8B1D23' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : filteredGroups.length === 0 ? (
        <EmptyStateWrapper>
          <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {t('group.list.emptyState')}
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <GroupsGrid>
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onView={(id) => {
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

      <CreateGroups 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleCreate} 
      />

      <EditGroups 
        open={isEditOpen} 
        onClose={() => {
            setIsEditOpen(false);
            setSelectedGroup(null);
        }} 
        group={selectedGroup}
        onSave={handleUpdate} 
      />

      <ViewGroups 
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
        onMembersChanged={reload}
      />

      <ConfirmationModal 
        open={confirmConfig.open}
        onClose={() => setConfirmConfig({ open: false, id: '' })}
        onConfirm={handleConfirmDelete}
        title={t('group.list.deleteTitle')}
        message={t('group.list.deleteMessage')}
      />
    </StyledContainer>
  );
};

export default GroupsPage;