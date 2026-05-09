import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Avatar,
    Chip,
    Divider,
} from '@mui/material';
import { ArrowLeft, Users, Award, BookOpen, Clock } from 'lucide-react';
import { ContestCard } from '../../../components/ui/card/contestCard';
import {
    StyledContainer,
    HeaderSection,
    TabContentWrapper,
    StudentCardStyled,
    SearchInput,
} from './groupDetailsStyle';
import type { ContestData } from '../../../types/index';
import { Button } from '../../../components/ui/button/Button';
import { SharedTable } from '../../../components/ui/table/tables';
import CreateContest from '../contest/Create';
import EditContest from '../contest/Edit';
import ViewContest from '../contest/View';
import { ConfirmationModal } from '../../../components/common/modal/ConfirmationModal';
import CreateProblem from '../problem/Create';
import EditProblem from '../problem/Edit';

interface GroupData {
    id: string;
    title: string;
    description: string;
    studentsCount: number;
    trainerCount: number;
    trainerName: string;
    createdDate: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    solvedProblems: number;
}

interface Trainer {
    id: string;
    name: string;
    email: string;
    avatar: string;
    expertise: string[];
    bio: string;
}

const mockGroupDetails: GroupData = {
    id: '1',
    title: 'Advanced Algorithms',
    description: 'Focus on advanced algorithmic concepts and competitive programming',
    studentsCount: 24,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-01-15',
};

const mockTrainer: Trainer = {
    id: 'trainer-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'JS',
    expertise: ['Algorithms', 'Data Structures', 'Competitive Programming'],
    bio: 'Experienced trainer with 8+ years in programming education',
};

const mockStudents: Student[] = [
    { id: 'student-1', name: 'Ahmed Ali', email: 'ahmed@example.com', joinDate: '2026-01-20', solvedProblems: 45 },
    { id: 'student-2', name: 'Fatima Mohamed', email: 'fatima@example.com', joinDate: '2026-01-22', solvedProblems: 38 },
    { id: 'student-3', name: 'Omar Hassan', email: 'omar@example.com', joinDate: '2026-01-25', solvedProblems: 52 },
    { id: 'student-4', name: 'Layla Ibrahim', email: 'layla@example.com', joinDate: '2026-02-01', solvedProblems: 31 },
    { id: 'student-5', name: 'Karim Saeed', email: 'karim@example.com', joinDate: '2026-02-03', solvedProblems: 47 },
];

const mockContests: ContestData[] = [
    {
        id: 1,
        title: 'Sorting & Searching',
        problemsCount: 5,
        participants: 24,
        startDate: '2026-01-20',
        endDate: '2026-01-27',
        status: 'Ended',
        difficulty: 'Medium',
    },
    {
        id: 2,
        title: 'Greedy Algorithms',
        problemsCount: 6,
        participants: 22,
        startDate: '2026-01-27',
        endDate: '2026-02-03',
        status: 'Ended',
        difficulty: 'Medium',
    },
    {
        id: 3,
        title: 'Dynamic Programming',
        problemsCount: 8,
        participants: 20,
        startDate: '2026-02-03',
        endDate: '2026-02-10',
        status: 'Ongoing',
        difficulty: 'Hard',
    },
    {
        id: 4,
        title: 'Final Challenge',
        problemsCount: 10,
        participants: 0,
        startDate: '2026-02-17',
        endDate: '2026-02-24',
        status: 'Upcoming',
        difficulty: 'Hard',
    },
];

const mockProblems: any[] = [
    { id: '1', title: 'Binary Search', category: 'Algorithms', difficulty: 'Easy', tags: ['Search'], visibility: 'general', submissions: 120, successRate: 85 },
    { id: '2', title: 'Quick Sort', category: 'Sorting', difficulty: 'Medium', tags: ['Divide & Conquer'], visibility: 'general', submissions: 95, successRate: 60 },
];

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

interface GroupDetailsPageProps {
    group?: GroupData;
    onBack: () => void;
}

export const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ group = mockGroupDetails, onBack }) => {
    const [tabValue, setTabValue] = useState(0);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [contestSearchQuery, setContestSearchQuery] = useState('');

    const [contests, setContests] = useState<ContestData[]>(mockContests);
    const [selectedContest, setSelectedContest] = useState<ContestData | null>(null);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    
    const [viewingProblems, setViewingProblems] = useState(false);
    const [contestProblems, setContestProblems] = useState<any[]>(mockProblems);
    const [isCreateProblemOpen, setIsCreateProblemOpen] = useState(false);
    const [isEditProblemOpen, setIsEditProblemOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<any>(null);

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

    const handleCreateProblem = (p: any) => setContestProblems([p, ...contestProblems]);
    const handleUpdateProblem = (p: any) => setContestProblems(contestProblems.map(x => x.id === p.id ? p : x));
    const handleSingleDeleteProblem = (id: string) => {
        setConfirmConfig({
            open: true,
            title: 'Remove Problem',
            message: 'Are you sure you want to remove this problem from the contest?',
            onConfirm: () => setContestProblems(contestProblems.filter(x => x.id !== id))
        });
    };
    const handleBulkDeleteProblems = (ids: string[]) => {
        setConfirmConfig({
            open: true,
            title: 'Remove Problems',
            message: `Are you sure you want to remove ${ids.length} selected problems?`,
            onConfirm: () => setContestProblems(contestProblems.filter(x => !ids.includes(x.id)))
        });
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

    const filteredStudents = mockStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );

    const filteredContests = mockContests.filter((contest) =>
        contest.title.toLowerCase().includes(contestSearchQuery.toLowerCase())
    );

    const handleCreateContest = (newContest: ContestData) => setContests([newContest, ...contests]);
    const handleUpdateContest = (updated: ContestData) => setContests(contests.map(c => c.id === updated.id ? updated : c));
    const handleDeleteContest = (id: number) => {
        setConfirmConfig({
            open: true,
            title: 'Delete Contest',
            message: 'Are you sure you want to delete this contest from this group?',
            onConfirm: () => setContests(contests.filter(c => c.id !== id))
        });
    };

    if (viewingProblems && selectedContest) {
        return (
            <StyledContainer maxWidth="xl">
                <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => setViewingProblems(false)} sx={{ mb: 3 }}>
                    Back to Group Details
                </Button>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', mb: 4, bgcolor: '#f8fafc' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        🏆 Problems in "{selectedContest.title}"
                    </Typography>
                </Paper>
                <SharedTable
                    data={contestProblems}
                    columns={[
                        { 
                            id: 'title', 
                            label: 'Problem Name',
                            render: (row) => <Typography sx={{ fontWeight: 700, color: '#8B1D23', fontSize: '14px' }}>{row.title}</Typography>
                        },
                        { id: 'category', label: 'Category' },
                        { 
                            id: 'difficulty', 
                            label: 'Difficulty',
                            render: (row) => (
                                <Chip 
                                    label={row.difficulty} 
                                    size="small" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '11px',
                                        bgcolor: row.difficulty === 'Easy' ? '#e7f7ec' : row.difficulty === 'Medium' ? '#fff7e0' : '#fdecec',
                                        color: row.difficulty === 'Easy' ? '#166534' : row.difficulty === 'Medium' ? '#92400e' : '#991b1b'
                                    }} 
                                />
                            )
                        },
                        { 
                            id: 'stats', 
                            label: 'Success Rate',
                            render: (row) => <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{row.successRate}%</Typography>
                        }
                    ]}
                    onAdd={() => setIsCreateProblemOpen(true)}
                    onEdit={(row) => {
                        setSelectedProblem(row);
                        setIsEditProblemOpen(true);
                    }}
                    onSingleDelete={handleSingleDeleteProblem}
                    onDelete={handleBulkDeleteProblems}
                    addButtonLabel="Add Problem"
                    searchPlaceholder="Search contest problems..."
                />

                <CreateProblem 
                    open={isCreateProblemOpen} 
                    onClose={() => setIsCreateProblemOpen(false)} 
                    onSave={handleCreateProblem} 
                />
                
                <EditProblem 
                    open={isEditProblemOpen} 
                    onClose={() => {
                        setIsEditProblemOpen(false);
                        setSelectedProblem(null);
                    }} 
                    problem={selectedProblem} 
                    onSave={handleUpdateProblem} 
                />

                <ConfirmationModal 
                    open={confirmConfig.open} 
                    onClose={() => setConfirmConfig(prev => ({ ...prev, open: false }))} 
                    onConfirm={confirmConfig.onConfirm} 
                    title={confirmConfig.title} 
                    message={confirmConfig.message} 
                />
            </StyledContainer>
        );
    }

    return (
        <StyledContainer maxWidth="xl">
            <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={onBack} sx={{ mb: 3 }}>
                Back to Groups
            </Button>

            <HeaderSection>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    {group.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 2, maxWidth: '800px' }}>
                    {group.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={18} color="#8B1D23" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{group.studentsCount} Students</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Award size={18} color="#8B1D23" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Created {new Date(group.createdDate).toLocaleDateString()}</Typography>
                    </Box>
                </Box>
            </HeaderSection>

            <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        px: 2,
                        borderBottom: '1px solid #e5e7eb',
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, color: '#64748b', minHeight: 64, '&.Mui-selected': { color: '#8B1D23' } },
                        '& .MuiTabs-indicator': { backgroundColor: '#8B1D23', height: 3, borderRadius: '999px' },
                    }}
                >
                    <Tab label="Contests" icon={<BookOpen size={16} />} iconPosition="start" />
                    <Tab label="Students" icon={<Users size={16} />} iconPosition="start" />
                    <Tab label="Trainer" icon={<Award size={16} />} iconPosition="start" />
                </Tabs>

                <TabContentWrapper>
                    {/* Contests Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
                            <SearchInput
                                type="text"
                                placeholder="Search group contests..."
                                value={contestSearchQuery}
                                onChange={(e) => setContestSearchQuery(e.target.value)}
                                style={{ marginBottom: 0, flex: 1, maxWidth: '400px' }}
                            />
                            <Button variantType="default" startIcon={<Clock size={18} />} onClick={() => setIsCreateOpen(true)}>
                                Create Contest
                            </Button>
                        </Box>
                        
                        {filteredContests.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 6, fontWeight: 600 }}>No contests found for this group.</Typography>
                        ) : (
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                                {filteredContests.map((c) => (
                                    <ContestCard
                                        key={c.id}
                                        contest={c}
                                        onView={() => { setSelectedContest(c); setIsViewOpen(true); }}
                                        onEdit={() => { setSelectedContest(c); setIsEditOpen(true); }}
                                        onProblems={() => { setSelectedContest(c); setViewingProblems(true); }}
                                        onDelete={() => handleDeleteContest(c.id)}
                                    />
                                ))}
                            </Box>
                        )}
                    </TabPanel>

                    {/* Students Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <SearchInput
                            type="text"
                            placeholder="Search students in this group..."
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                            {filteredStudents.map((student) => (
                                <StudentCardStyled key={student.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#fef2f2', color: '#8B1D23', width: 52, height: 52, fontWeight: 700 }}>
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{student.name}</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>{student.email}</Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                                            Joined: <span>{new Date(student.joinDate).toLocaleDateString()}</span>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                            Solved Problems: <span style={{ fontWeight: 700, color: '#1e293b' }}>{student.solvedProblems}</span>
                                        </Typography>
                                    </Box>
                                    <Button variantType="outline" fullWidth>
                                        View Student Profile
                                    </Button>
                                </StudentCardStyled>
                            ))}
                        </Box>
                    </TabPanel>

                    {/* Trainer Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Paper elevation={0} sx={{ p: 4, maxWidth: 600, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: '#f8fafc' }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                                <Avatar sx={{ width: 80, height: 88, bgcolor: '#8B1D23', fontSize: 30, fontWeight: 700, borderRadius: '16px' }}>{mockTrainer.avatar}</Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{mockTrainer.name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>{mockTrainer.email}</Typography>
                                    <Button variantType="default">
                                        Message Trainer
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontWeight: 700, mb: 1, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Bio</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, fontWeight: 500 }}>{mockTrainer.bio}</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Expertise</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {mockTrainer.expertise.map((skill) => (
                                        <Chip key={skill} label={skill} sx={{ bgcolor: '#ffffff', color: '#1e293b', fontWeight: 700, border: '1px solid #e2e8f0' }} />
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </TabPanel>
                </TabContentWrapper>
            </Paper>

            {/* Reuse Contest Modals */}
            <CreateContest open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleCreateContest} />
            <EditContest open={isEditOpen} onClose={() => setIsEditOpen(false)} contest={selectedContest} onSave={handleUpdateContest} />
            <ViewContest open={isViewOpen} onClose={() => setIsViewOpen(false)} contest={selectedContest} />
            
            <ConfirmationModal 
                open={confirmConfig.open} 
                onClose={() => setConfirmConfig(prev => ({ ...prev, open: false }))} 
                onConfirm={confirmConfig.onConfirm} 
                title={confirmConfig.title} 
                message={confirmConfig.message} 
            />
        </StyledContainer>
    );
};

export default GroupDetailsPage;