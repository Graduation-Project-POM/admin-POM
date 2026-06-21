import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Avatar,
    Chip,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import { groupService } from '../../../services/groupService';
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
import CreateProblem, { type ProblemFormValues } from '../problem/Create';
import EditProblem, { type ProblemEditValues } from '../problem/Edit';
import ProblemDetailModal from '../problem/ProblemDetailModal';
import { contestService } from '../../../services/contestService';
import { problemsService } from '../../../services/problemsService';
import { getApiErrorMessage } from '../../../utils/apiError';
import { DIFFICULTY_LABEL, DIFFICULTY_FROM_LABEL } from '../../../types/problem';
import { getContestStatus, getContestStatusNumber } from '../../../utils/contestStatus';

const toIso = (value: string): string => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

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

interface TrainerInfo {
    id: number;
    name: string;
    email: string;
    specialization: string;
}

// A problem row shown in a contest's problem table within the group view.
interface GroupContestProblem {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    successRate: number;
}

// Prefill object handed to the EditProblem modal.
interface ProblemEditPrefill {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    difficulty: string;
    visibility: string;
    tags: string[];
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [contestSearchQuery, setContestSearchQuery] = useState('');

    const [contests, setContests] = useState<ContestData[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
    const [tabsLoading, setTabsLoading] = useState(true);
    const [tabsError, setTabsError] = useState<string | null>(null);
    const [selectedContest, setSelectedContest] = useState<ContestData | null>(null);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    
    const [viewingProblems, setViewingProblems] = useState(false);
    const [contestProblems, setContestProblems] = useState<GroupContestProblem[]>([]);
    const [contestProblemIds, setContestProblemIds] = useState<number[]>([]);
    const [isCreateProblemOpen, setIsCreateProblemOpen] = useState(false);
    const [isEditProblemOpen, setIsEditProblemOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<ProblemEditPrefill | null>(null);
    const [detailProblemId, setDetailProblemId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

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

    
    const groupId = group?.id;
    const loadGroupData = useCallback(async () => {
        if (!groupId) return;
        setTabsLoading(true);
        setTabsError(null);
        try {
            const [s, c, g] = await Promise.all([
                groupService.getStudents(Number(groupId)),
                groupService.getContests(Number(groupId)),
                groupService.getById(Number(groupId)),
            ]);
            setTrainer(
                g.trainerName
                    ? {
                        id: g.trainerId,
                        name: g.trainerName,
                        email: g.trainerEmail ?? '',
                        specialization: g.trainerSpecialization ?? '',
                    }
                    : null,
            );
            setStudents(
                s.map((x) => ({
                    id: String(x.studentId),
                    name: x.fullName,
                    email: '',
                    joinDate: x.joinDate,
                    solvedProblems: x.problemSolved,
                })),
            );
            
            const details = await Promise.all(
                c.map((x) => contestService.getById(x.contestId).catch(() => null)),
            );
            setContests(
                c.map((x, i) => {
                    const d = details[i];
                    return {
                        id: String(x.contestId),
                        title: x.title,
                        status: getContestStatus(d?.startAt ?? x.addDate, d?.endAt ?? x.addDate),
                        difficulty: 'Medium',
                        participants: d?.studentCount ?? 0,
                        problemsCount: d?.problemCount ?? 0,
                        startDate: d?.startAt ?? x.addDate,
                        endDate: d?.endAt ?? x.addDate,
                    };
                }),
            );
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.loadFailed', 'Failed to load group details')));
        } finally {
            setTabsLoading(false);
        }
    }, [groupId, t]);

    useEffect(() => {
        void loadGroupData();
    }, [loadGroupData]);

    
    const loadContestQuestions = async (contestId: string) => {
        try {
            const data = await contestService.getProblems(Number(contestId));
            const ids: number[] = [];
            const mapped = data.map((p) => {
                const pid = Number(p.id ?? p.iD ?? p.ID);
                ids.push(pid);
                return {
                    id: String(pid),
                    title: String(p.title ?? ''),
                    category: String(p.topic ?? ''),
                    difficulty: DIFFICULTY_LABEL[Number(p.difficulty)] ?? 'Medium',
                    successRate: 0,
                };
            });
            setContestProblemIds(ids);
            setContestProblems(mapped);
        } catch (err) {
            setContestProblemIds([]);
            setContestProblems([]);
            setTabsError(getApiErrorMessage(err, t('group.details.loadProblemsFailed', 'Failed to load contest problems')));
        }
    };

    const handleCreateProblem = async (form: ProblemFormValues) => {
        if (!selectedContest) return;
        try {
            const newId = await problemsService.create({
                title: form.title,
                statement: form.description || '',
                solution: form.description || form.title,
                difficulty: DIFFICULTY_FROM_LABEL[form.difficulty] ?? 1,
                topic: form.category || 'General',
                photoFileKey: form.imageUrl || null,
                isPublished: form.isPublished,
            });
            await contestService.update(Number(selectedContest.id), {
                problemIds: [...contestProblemIds, newId],
            });
            await loadContestQuestions(selectedContest.id);
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.addProblemFailed', 'Failed to add problem')));
        }
    };

    const handleUpdateProblem = async (form: ProblemEditValues) => {
        if (!selectedContest) return;
        try {
            await problemsService.update(Number(form.id), {
                title: form.title,
                statement: form.description || '',
                difficulty: DIFFICULTY_FROM_LABEL[form.difficulty] ?? 1,
                topic: form.category || 'General',
                photoFileKey: form.imageUrl || null,
                isPublished: form.isPublished,
            });
            await loadContestQuestions(selectedContest.id);
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.updateProblemFailed', 'Failed to update problem')));
        }
    };


    const handleOpenEditProblem = async (row: GroupContestProblem) => {
        try {
            const detail = await problemsService.getById(Number(row.id));
            setSelectedProblem({
                id: String(detail.id),
                title: detail.title,
                description: detail.statement ?? '',
                imageUrl: detail.photoUrl ?? '',
                category: detail.topic,
                difficulty: DIFFICULTY_LABEL[detail.difficulty] ?? 'Medium',
                visibility: detail.isPublished ? 'general' : 'group-specific',
                tags: [],
            });
            setIsEditProblemOpen(true);
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.loadProblemFailed', 'Failed to load problem')));
        }
    };

    const handleSingleDeleteProblem = (id: string) => {
        setConfirmConfig({
            open: true,
            title: t('group.details.removeProblemTitle'),
            message: t('group.details.removeProblemMessage'),
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, open: false }));
                if (!selectedContest) return;
                try {
                    const ids = contestProblemIds.filter((x) => x !== Number(id));
                    await contestService.update(Number(selectedContest.id), { problemIds: ids });
                    await loadContestQuestions(selectedContest.id);
                } catch (err) {
                    setTabsError(getApiErrorMessage(err, t('group.details.removeProblemFailed', 'Failed to remove problem')));
                }
            }
        });
    };

    const handleBulkDeleteProblems = (ids: string[]) => {
        setConfirmConfig({
            open: true,
            title: t('group.details.removeProblemsTitle'),
            message: t('group.details.removeProblemsMessage', { count: ids.length }),
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, open: false }));
                if (!selectedContest) return;
                try {
                    const numIds = ids.map(Number);
                    const remaining = contestProblemIds.filter((x) => !numIds.includes(x));
                    await contestService.update(Number(selectedContest.id), { problemIds: remaining });
                    await loadContestQuestions(selectedContest.id);
                } catch (err) {
                    setTabsError(getApiErrorMessage(err, t('group.details.removeProblemsFailed', 'Failed to remove problems')));
                }
            }
        });
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );

    const filteredContests = contests.filter((contest) =>
        contest.title.toLowerCase().includes(contestSearchQuery.toLowerCase())
    );

    const handleCreateContest = async (newContest: ContestData) => {
        if (!group) return;
        setTabsError(null);
        try {
            const startAt = toIso(newContest.startDate);
            const endAt = toIso(newContest.endDate);
            const res = await contestService.create({
                title: newContest.title,
                description: '',
                status: getContestStatusNumber(startAt, endAt),
                startAt,
                endAt,
                problemIds: [],
            });
            await groupService.addContest(Number(group.id), res.contestID);
            await loadGroupData();
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.createContestFailed', 'Failed to create contest')));
        }
    };

    const handleUpdateContest = async (updated: ContestData) => {
        setTabsError(null);
        try {
            const startAt = toIso(updated.startDate);
            const endAt = toIso(updated.endDate);
            await contestService.update(Number(updated.id), {
                title: updated.title,
                status: getContestStatusNumber(startAt, endAt),
                startAt,
                endAt,
            });
            await loadGroupData();
        } catch (err) {
            setTabsError(getApiErrorMessage(err, t('group.details.updateContestFailed', 'Failed to update contest')));
        }
    };
    const handleDeleteContest = (id: string) => {
        setConfirmConfig({
            open: true,
            title: t('group.details.deleteContestTitle'),
            message: t('group.details.deleteContestMessage'),
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, open: false }));
                try {
                    await groupService.removeContest(Number(group.id), Number(id));
                    setContests(prev => prev.filter(c => c.id !== id));
                } catch (err) {
                    setTabsError(getApiErrorMessage(err, t('group.details.removeContestFailed', 'Failed to remove contest from group')));
                }
            }
        });
    };

    if (viewingProblems && selectedContest) {
        return (
            <StyledContainer maxWidth="xl">
                <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => setViewingProblems(false)} sx={{ mb: 3 }}>
                    {t('group.details.backToGroup')}
                </Button>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb', mb: 4, bgcolor: '#f8fafc' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {t('group.details.problemsTitle', { title: selectedContest.title })}
                    </Typography>
                </Paper>
                <SharedTable
                    data={contestProblems}
                    columns={[
                        {
                            id: 'title',
                            label: t('group.details.problemName'),
                            render: (row) => (
                                <Typography
                                    onClick={() => { setDetailProblemId(Number(row.id)); setIsDetailOpen(true); }}
                                    sx={{ fontWeight: 700, color: '#8B1D23', fontSize: '14px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                >
                                    {row.title}
                                </Typography>
                            )
                        },
                        { id: 'category', label: t('group.details.category') },
                        {
                            id: 'difficulty',
                            label: t('group.details.difficulty'),
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
                            label: t('group.details.successRate'),
                            render: (row) => <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{row.successRate}%</Typography>
                        }
                    ]}
                    onAdd={() => setIsCreateProblemOpen(true)}
                    onEdit={(row) => { void handleOpenEditProblem(row); }}
                    onSingleDelete={handleSingleDeleteProblem}
                    onDelete={handleBulkDeleteProblems}
                    addButtonLabel={t('group.details.addProblem')}
                    searchPlaceholder={t('group.details.searchProblems')}
                />

                <ProblemDetailModal
                    open={isDetailOpen}
                    onClose={() => { setIsDetailOpen(false); setDetailProblemId(null); }}
                    problemId={detailProblemId}
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
                {t('group.details.backToGroups')}
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
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('group.details.studentsCount', { count: students.length })}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Award size={18} color="#8B1D23" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{t('group.details.created', { date: new Date(group.createdDate).toLocaleDateString() })}</Typography>
                    </Box>
                </Box>
            </HeaderSection>

            {tabsError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setTabsError(null)}>
                    {tabsError}
                </Alert>
            )}

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
                    <Tab label={t('group.details.tabContests')} icon={<BookOpen size={16} />} iconPosition="start" />
                    <Tab label={t('group.details.tabStudents')} icon={<Users size={16} />} iconPosition="start" />
                    <Tab label={t('group.details.tabTrainer')} icon={<Award size={16} />} iconPosition="start" />
                </Tabs>

                <TabContentWrapper>
                    {/* Contests Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
                            <SearchInput
                                type="text"
                                placeholder={t('group.details.searchGroupContests')}
                                value={contestSearchQuery}
                                onChange={(e) => setContestSearchQuery(e.target.value)}
                                style={{ marginBottom: 0, flex: 1, maxWidth: '400px' }}
                            />
                            <Button variantType="default" startIcon={<Clock size={18} />} onClick={() => setIsCreateOpen(true)}>
                                {t('group.details.createContest')}
                            </Button>
                        </Box>
                        
                        {tabsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress sx={{ color: '#8B1D23' }} />
                            </Box>
                        ) : filteredContests.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 6, fontWeight: 600 }}>{t('group.details.noContests')}</Typography>
                        ) : (
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                                {filteredContests.map((c) => (
                                    <ContestCard
                                        key={c.id}
                                        contest={c}
                                        onView={() => { setSelectedContest(c); setIsViewOpen(true); }}
                                        onEdit={() => { setSelectedContest(c); setIsEditOpen(true); }}
                                        onProblems={() => { setSelectedContest(c); setViewingProblems(true); setContestProblems([]); setContestProblemIds([]); void loadContestQuestions(c.id); }}
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
                            placeholder={t('group.details.searchStudents')}
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                        />
                        {tabsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress sx={{ color: '#8B1D23' }} />
                        </Box>
                        ) : filteredStudents.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 6, fontWeight: 600 }}>
                            {t('group.details.noStudents', 'No students in this group')}
                        </Typography>
                        ) : (
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
                                            {t('group.details.joined')} <span>{new Date(student.joinDate).toLocaleDateString()}</span>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                            {t('group.details.solvedProblems')} <span style={{ fontWeight: 700, color: '#1e293b' }}>{student.solvedProblems}</span>
                                        </Typography>
                                    </Box>
                                    <Button
                                        variantType="outline"
                                        fullWidth
                                        onClick={() => navigate(`/profile/student/${student.id}`)}
                                    >
                                        {t('group.details.viewStudentProfile')}
                                    </Button>
                                </StudentCardStyled>
                            ))}
                        </Box>
                        )}
                    </TabPanel>

                    {/* Trainer Tab */}
                    <TabPanel value={tabValue} index={2}>
                        {tabsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                <CircularProgress sx={{ color: '#8B1D23' }} />
                            </Box>
                        ) : !trainer ? (
                            <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 6, fontWeight: 600 }}>
                                {t('group.details.noTrainer', 'No trainer assigned to this group')}
                            </Typography>
                        ) : (
                        <Paper elevation={0} sx={{ p: 4, maxWidth: 600, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: '#f8fafc' }}>
                            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                                <Avatar sx={{ width: 80, height: 88, bgcolor: '#8B1D23', fontSize: 30, fontWeight: 700, borderRadius: '16px' }}>
                                    {trainer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{trainer.name}</Typography>
                                    {trainer.email && (
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>{trainer.email}</Typography>
                                    )}
                                    <Button
                                        variantType="default"
                                        onClick={() => navigate(`/profile/trainer/${trainer.id}`)}
                                    >
                                        {t('group.details.viewProfile', 'View Profile')}
                                    </Button>
                                </Box>
                            </Box>
                            {trainer.specialization && (
                                <Box>
                                    <Typography sx={{ fontWeight: 700, mb: 2, color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('group.details.expertise')}</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip label={trainer.specialization} sx={{ bgcolor: '#ffffff', color: '#1e293b', fontWeight: 700, border: '1px solid #e2e8f0' }} />
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                        )}
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