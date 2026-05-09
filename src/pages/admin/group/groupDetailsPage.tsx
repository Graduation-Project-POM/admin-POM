import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Tabs,
    Tab,
    Avatar,
    CardContent,
    Chip,
} from '@mui/material';
import { ArrowLeft, Users, Award, BookOpen } from 'lucide-react';
import { ContestCard } from '../../../components/ui/card/contestCard';
import {
    StyledContainer,
    HeaderSection,
    TabContentWrapper,
    StudentCardStyled,
    SearchInput,
} from './groupDetailsStyle';
import type { ContestData } from '../../../types/index';

// -------------------------------
// Types
// -------------------------------
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

// -------------------------------
// Mock Data
// -------------------------------
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

// تأكد من أن قيم status مطابقة للنوع المطلوب في ContestData
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

// -------------------------------
// TabPanel Component
// -------------------------------
function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

// -------------------------------
// Main Component
// -------------------------------
interface GroupDetailsPageProps {
    group?: GroupData;
    onBack: () => void;
}

export const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ group = mockGroupDetails, onBack }) => {
    const [tabValue, setTabValue] = useState(0);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [contestSearchQuery, setContestSearchQuery] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

    const filteredStudents = mockStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );

    const filteredContests = mockContests.filter((contest) =>
        contest.title.toLowerCase().includes(contestSearchQuery.toLowerCase())
    );

    const handleViewContest = (id: number) => console.log('View contest', id);
    const handleEditContest = (id: number) => console.log('Edit contest', id);
    const handleProblemsContest = (id: number) => console.log('Problems contest', id);
    const handleDeleteContest = (id: number) => console.log('Delete contest', id);

    return (
        <StyledContainer maxWidth="xl">
            <Button startIcon={<ArrowLeft size={18} />} onClick={onBack} sx={{ mb: 3 }}>
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
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{group.studentsCount} Students</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Award size={18} color="#8B1D23" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Created {new Date(group.createdDate).toLocaleDateString()}</Typography>
                    </Box>
                </Box>
            </HeaderSection>

            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
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
                    {/* ========================= Contests Tab ========================= */}
                    <TabPanel value={tabValue} index={0}>
                        <SearchInput
                            type="text"
                            placeholder="Search contests..."
                            value={contestSearchQuery}
                            onChange={(e) => setContestSearchQuery(e.target.value)}
                        />
                        {filteredContests.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 6 }}>No contests found.</Typography>
                        ) : (
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
                                {filteredContests.map((contest) => (
                                    <Box key={contest.id} sx={{ display: 'flex' }}>
                                        <ContestCard
                                            contest={contest}
                                            onView={handleViewContest}
                                            onEdit={handleEditContest}
                                            onProblems={handleProblemsContest}
                                            onDelete={handleDeleteContest}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </TabPanel>

                    {/* ========================= Students Tab ========================= */}
                    <TabPanel value={tabValue} index={1}>
                        <SearchInput
                            type="text"
                            placeholder="Search students..."
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                        />
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
                            {filteredStudents.map((student) => (
                                <Box key={student.id} sx={{ display: 'flex' }}>
                                    <StudentCardStyled sx={{ width: '100%' }}>
                                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 0 }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#8B1D23', width: 52, height: 52, fontWeight: 700 }}>
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{student.name}</Typography>
                                                        <Typography variant="body2" sx={{ color: '#64748b', wordBreak: 'break-word' }}>{student.email}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>Joined: {new Date(student.joinDate).toLocaleDateString()}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>Solved Problems: {student.solvedProblems}</Typography>
                                                </Box>
                                            </Box>
                                            <Button variant="outlined" fullWidth sx={{ borderColor: '#d1d5db', color: '#8B1D23', textTransform: 'none', fontWeight: 700, borderRadius: '10px', '&:hover': { borderColor: '#8B1D23', backgroundColor: '#fff7f8' } }}>
                                                View Profile
                                            </Button>
                                        </CardContent>
                                    </StudentCardStyled>
                                </Box>
                            ))}
                        </Box>
                    </TabPanel>

                    {/* ========================= Trainer Tab ========================= */}
                    <TabPanel value={tabValue} index={2}>
                        <Paper sx={{ p: 4, maxWidth: 600, borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                                <Avatar sx={{ width: 88, height: 88, bgcolor: '#8B1D23', fontSize: 30, fontWeight: 700 }}>{mockTrainer.avatar}</Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{mockTrainer.name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>{mockTrainer.email}</Typography>
                                    <Button variant="contained" sx={{ bgcolor: '#8B1D23', textTransform: 'none', borderRadius: '10px', fontWeight: 700, '&:hover': { bgcolor: '#74151c' } }}>
                                        Contact Trainer
                                    </Button>
                                </Box>
                            </Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>Bio</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>{mockTrainer.bio}</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>Expertise</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {mockTrainer.expertise.map((skill) => (
                                        <Chip key={skill} label={skill} sx={{ bgcolor: '#f8fafc', color: '#8B1D23', fontWeight: 600, borderRadius: '8px' }} />
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </TabPanel>
                </TabContentWrapper>
            </Paper>
        </StyledContainer>
    );
};

export default GroupDetailsPage;