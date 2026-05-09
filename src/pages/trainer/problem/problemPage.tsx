import React, { useState } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { Search, TrendingUp } from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  TitleBox,
  IconBadge,
  SearchFilterBox,
  StyledFormControl,
} from './problemStyle';
import { SharedTable } from '../../../components/ui/table//tables'; 
import { problemsData } from './problemStyle'; 

export const ProblemBank: React.FC = () => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredProblems = problemsData.filter((problem) => {
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesDifficulty;
  });

  const tableData = filteredProblems.map((problem) => ({
    ...problem,
    id: String(problem.id),
  }));
  const stats = {
    total: problemsData.length,
    easy: problemsData.filter((p) => p.difficulty === 'Easy').length,
    medium: problemsData.filter((p) => p.difficulty === 'Medium').length,
    hard: problemsData.filter((p) => p.difficulty === 'Hard').length,
  };

  const problemColumns = [
    { id: 'title', label: 'Title' },
    { id: 'difficulty', label: 'Difficulty' },
    { id: 'tags', label: 'Tags' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'acceptance', label: 'Acceptance Rate (%)' },
  ];

  const handleEditProblem = (row: any) => {
    console.log('Edit problem', row);
    alert(`Edit problem: ${row.title}`);
  };

  const handleSingleDelete = (problemId: string) => {
    console.log('Delete single problem', problemId);
    alert(`Delete problem with ID: ${problemId}`);
  };

  const handleBulkDelete = (selectedIds: string[]) => {
    console.log('Bulk delete problems', selectedIds);
    alert(`Delete ${selectedIds.length} problem(s): ${selectedIds.join(', ')}`);
  };

  const handleAddProblem = () => {
    alert('Add new problem');
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>📚</IconBadge>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Problem Bank
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
              Master algorithms with our curated problem collection
            </Typography>
          </Box>
        </TitleBox>

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: 2,
              py: 1.5,
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <TrendingUp size={18} color="#8B1D23" />
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              {stats.total} Problems
            </Typography>
          </Box>
        </Box>
      </HeaderSection>

      <SearchFilterBox>
        <StyledFormControl>
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </StyledFormControl>
      </SearchFilterBox>

      <SharedTable
        data={tableData}
        columns={problemColumns}
        onEdit={handleEditProblem}
        onSingleDelete={handleSingleDelete}
        onDelete={handleBulkDelete}
        onAdd={handleAddProblem}
        addButtonLabel="Add Problem"
        searchPlaceholder="Search by title, difficulty, tags..."
      />
    </PageContainer>
  );
};

export default ProblemBank;