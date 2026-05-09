import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  TitleBox,
  IconBadge,
  BackButton,
  TableContainer,
  TableHeader,
  TableTitle,
  TableSubtitle,
  DifficultyChip,
  contestsData,
  contestProblemsMap,
} from './contestStyle';
import { ContestCard } from '../../../components/ui/card/contestCard';
import { SharedTable } from '../../../components/ui/table/tables'; // استيراد الجدول المشترك

export const ContestsManager: React.FC = () => {
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [contests, setContests] = useState(contestsData);
  const [currentProblems, setCurrentProblems] = useState<any[]>([]);

  const handleView = (id: number) => {
    console.log('View contest', id);
    alert(`View contest ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit contest', id);
    alert(`Edit contest ${id}`);
  };

  const handleProblems = (id: number) => {
    const problems = contestProblemsMap[id] || [];
    const problemsWithId = problems.map((p, idx) => ({
      id: `${id}-${idx}`,
      problem: p.problem,
      difficulty: p.difficulty,
      studentsSolved: p.studentsSolved,
      totalSubmissions: p.totalSubmissions,
      acceptanceRate: p.acceptanceRate,
    }));
    setCurrentProblems(problemsWithId);
    setSelectedContestId(id);
  };

  const handleDelete = (id: number) => {
    setContests((prev) => prev.filter((c) => c.id !== id));
    if (selectedContestId === id) {
      setSelectedContestId(null);
    }
  };

  const handleEditProblem = (row: any) => {
    console.log('Edit problem', row);
    alert(`Edit problem: ${row.problem}`);
  };

  const handleSingleDeleteProblem = (problemId: string) => {
    setCurrentProblems((prev) => prev.filter((p) => p.id !== problemId));
  };

  const handleBulkDeleteProblems = (selectedIds: string[]) => {
    setCurrentProblems((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
  };

  const problemColumns = [
    { id: 'problem', label: 'Problem' },
    { id: 'difficulty', label: 'Difficulty' },
    { id: 'studentsSolved', label: 'Students Solved' },
    { id: 'totalSubmissions', label: 'Total Submissions' },
    { id: 'acceptanceRate', label: 'Acceptance Rate' },
  ];

  if (selectedContestId !== null) {
    const contestName = contests.find((c) => c.id === selectedContestId)?.name || 'Contest';

    return (
      <PageContainer>
        <BackButton
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => setSelectedContestId(null)}
        >
          Back to Contests
        </BackButton>

        <TableContainer >
          <TableHeader>
            <TableTitle>🏆 {contestName}</TableTitle>
            <TableSubtitle>Manage and monitor contest problems</TableSubtitle>
          </TableHeader>

          <Box sx={{ m: 2 }}>
          <SharedTable 
            data={currentProblems}
            columns={problemColumns}
            onEdit={handleEditProblem}
            onSingleDelete={handleSingleDeleteProblem}
            onDelete={handleBulkDeleteProblems}
            searchPlaceholder="Search problems..."
            addButtonLabel="Add Problem"
            onAdd={() => alert('Add new problem')}
          />
          </Box>
        </TableContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>🏆</IconBadge>
          <Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Contests
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '6px' }}>
              Create and manage coding contests
            </Typography>
          </Box>
        </TitleBox>
      </HeaderSection>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {contests.map((contest) => {
          const contestForCard = {
            id: String(contest.id),
            title: contest.name,
            participants: Number(contest.participants) || 0,
            problemsCount: contest.problems,
            startDate: contest.startDate,
            endDate: contest.endDate,
            status: contest.status,
            difficulty: 'Medium',
          };
          return (
            <ContestCard
              key={contest.id}
              contest={contestForCard}
              onView={handleView}
              onEdit={handleEdit}
              onProblems={handleProblems}
              onDelete={handleDelete}
            />
          );
        })}
      </Box>
    </PageContainer>
  );
};

export default ContestsManager;