import React, { useState } from 'react';
import { Box, Typography, Container, styled } from '@mui/material';
import { GroupCard } from '../../../components/ui/card/GroupCard'; 
import type { GroupData } from '../../../types';

const PageContainer = styled(Container)({
  padding: '40px 24px',
  minHeight: '100vh',
  maxWidth: '100%',
  marginLeft: 0,
  marginRight: 0,
  paddingLeft: 'max(24px, env(safe-area-inset-left))',
  paddingRight: 'max(24px, env(safe-area-inset-right))',
});

const HeaderSection = styled(Box)({
  marginBottom: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});

const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.15) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '32px',
});

const HeaderStats = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
});

const StatCard = styled(Box)({
  padding: '12px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
});

const StatValue = styled(Typography)({
  fontSize: '20px',
  fontWeight: 700,
  color: '#8B1D23',
});

const StatLabel = styled(Typography)({
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
});

const GroupsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '28px',
  '@media (max-width: 900px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
  },
});

// بيانات تجريبية للمجموعات
const mockGroups: GroupData[] = [
  {
    id: '1',
    title: 'React Advanced',
    description: 'Master React hooks, context, and performance optimization',
    studentsCount: 28,
    trainerCount: 1,
    trainerName: 'Ahmed Mansour',
    createdDate: '2025-02-10',
  },
  {
    id: '2',
    title: 'Node.js Backend',
    description: 'Build scalable APIs with Express, MongoDB, and JWT',
    studentsCount: 22,
    trainerCount: 1,
    trainerName: 'Sara Kamal',
    createdDate: '2025-02-15',
  },
  {
    id: '3',
    title: 'UI/UX Design System',
    description: 'Learn Figma, design tokens, and accessible components',
    studentsCount: 18,
    trainerCount: 1,
    trainerName: 'Omar Hisham',
    createdDate: '2025-03-01',
  },
];

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>(mockGroups);

  const totalStudents = groups.reduce((sum, g) => sum + g.studentsCount, 0);
  const totalGroups = groups.length;
  const totalTrainers = groups.reduce((sum, g) => sum + g.trainerCount, 0);

  const handleView = (id: string) => {
    console.log('View group', id);
    // انتقل إلى صفحة التفاصيل
  };

  const handleEdit = (group: GroupData) => {
    console.log('Edit group', group);
    // افتح modal أو توجه لصفحة التحرير
  };

  const handleMembers = (group: GroupData) => {
    console.log('Show members of', group.title);
    // افتح نافذة جانبية لعرض الأعضاء
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>👥</IconBadge>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Groups
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
              Manage your learning groups and track members
            </Typography>
          </Box>
        </TitleBox>

        <HeaderStats>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>📚</Box>
            <Box>
              <StatValue>{totalGroups}</StatValue>
              <StatLabel>Groups</StatLabel>
            </Box>
          </StatCard>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>👥</Box>
            <Box>
              <StatValue>{totalStudents}</StatValue>
              <StatLabel>Students</StatLabel>
            </Box>
          </StatCard>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>👨‍🏫</Box>
            <Box>
              <StatValue>{totalTrainers}</StatValue>
              <StatLabel>Trainers</StatLabel>
            </Box>
          </StatCard>
        </HeaderStats>
      </HeaderSection>

      <GroupsGrid>
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onView={handleView}
            onEdit={handleEdit}
            onMembers={handleMembers}
            onDelete={handleDelete}
          />
        ))}
      </GroupsGrid>
    </PageContainer>
  );
};

export default GroupsPage;