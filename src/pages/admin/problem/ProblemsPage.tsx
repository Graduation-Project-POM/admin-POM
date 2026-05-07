import { SharedTable } from '../../../components/ui/table/tables';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { ConfirmationModal } from '../../../components/common/modal/ConfirmationModal';
import Edit from './Edit';
import Create from './Create';

const primaryColor = '#7A1E1E';

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
});

const SmallChip = styled(Chip)({
  fontSize: '11px',
  height: '22px',
  fontWeight: 500,
  backgroundColor: '#f3f4f6',
  color: '#374151',
});

const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => ({
  fontSize: '11px',
  height: '22px',
  fontWeight: 600,
  ...(difficulty === 'Easy' && { backgroundColor: '#e7f7ec', color: '#166534' }),
  ...(difficulty === 'Medium' && { backgroundColor: '#fff7e0', color: '#92400e' }),
  ...(difficulty === 'Hard' && { backgroundColor: '#fdecec', color: '#991b1b' }),
}));

type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  visibility: 'general' | 'group-specific';
  submissions: number;
  successRate: number;
};

const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array'],
    visibility: 'general',
    submissions: 245,
    successRate: 78,
  },
  {
    id: '2',
    title: 'Binary Tree Maximum Path Sum',
    category: 'Tree',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Tree'],
    visibility: 'group-specific',
    submissions: 87,
    successRate: 42,
  },
  {
    id: '3',
    title: 'Merge Intervals',
    category: 'Array',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    visibility: 'general',
    submissions: 156,
    successRate: 65,
  },
];

export const AdminProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  
  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleCreate = (newProblem: Problem) => {
    setProblems([newProblem, ...problems]);
  };

  const handleEdit = (updatedProblem: Problem) => {
    setProblems(problems.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      title: 'Delete Problem',
      message: 'Are you sure you want to delete this problem? This action cannot be undone.',
      onConfirm: () => {
        setProblems(problems.filter(p => p.id !== id));
      }
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmConfig({
      open: true,
      title: 'Delete Problems',
      message: `Are you sure you want to delete ${ids.length} selected problems? This action cannot be undone.`,
      onConfirm: () => {
        setProblems(problems.filter(p => !ids.includes(p.id)));
      }
    });
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 600, color: primaryColor }}>
          {row.title}
        </Typography>
      ),
    },
    { id: 'category', label: 'Category' },
    {
      id: 'difficulty',
      label: 'Difficulty',
      render: (row: Problem) => (
        <DifficultyChip label={row.difficulty} difficulty={row.difficulty} />
      ),
    },
    {
      id: 'tags',
      label: 'Tags',
      render: (row: Problem) => (
        <TagsContainer>
          {row.tags.map((tag, idx) => (
            <SmallChip key={idx} label={tag} />
          ))}
        </TagsContainer>
      ),
    },
    {
      id: 'visibility',
      label: 'Visibility',
      render: (row: Problem) => (
        <Chip
          label={row.visibility === 'general' ? 'General' : 'Group-specific'}
          sx={{
            fontSize: '11px',
            height: '22px',
            bgcolor: row.visibility === 'general' ? '#e7f7ec' : '#ffe0e0',
            color: row.visibility === 'general' ? '#166534' : '#991b1b',
          }}
        />
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      render: (row: Problem) => (
        <Box>
          <Typography variant="caption" display="block">
            {row.submissions} submissions
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {row.successRate}% success
          </Typography>
        </Box>
      ),
    },
  ];

  return (

    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Problem Bank
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          Manage the collection of mathematical problems
        </Typography>
      </Box>
      <SharedTable
        data={problems}
        columns={columns}
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={(row) => {
          setSelectedProblem(row);
          setIsEditModalOpen(true);
        }}
        onSingleDelete={handleDelete}
        onDelete={handleBulkDelete}
        addButtonLabel="Add Problem"
        searchPlaceholder="Search problems..."
      />

      <Create 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleCreate} 
      />

      <Edit 
        open={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProblem(null);
        }} 
        problem={selectedProblem} 
        onSave={handleEdit} 
      />

      <ConfirmationModal 
        open={confirmConfig.open}
        onClose={() => setConfirmConfig(prev => ({ ...prev, open: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </Box>    
  );
};

export default AdminProblemsPage;