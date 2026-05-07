import { useState } from 'react';
import {
  Avatar,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Mail,
  Phone,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/tables';
import {
  PageContainer,
  HeaderSection,
  IconBadge,
  PendingCard,
  PendingBadge,
  UserAvatar,
  InfoItem,
  InfoIcon,
  InfoLabel,
  InfoValue,
  ActionButton,
  StatusChip,
  UserCell,
} from './ApprovalStyle';

const pendingRequest = {
  id: '0',
  name: 'David Wilson',
  email: 'david.wilson@example.com',
  phone: '+1 234 567 8903',
  submitted: '2026-03-28',
  specialization: 'Advanced Algorithms, Competitive Programming',
  initials: 'DW',
  bio: 'Passionate educator with 8+ years of experience in teaching competitive programming and algorithms.',
};

const approvals = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    specialization: 'Data Structures, Python',
    submitted: '2026-03-25',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    specialization: 'Web Development, JavaScript',
    submitted: '2026-03-22',
    status: 'Approved',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.r@example.com',
    specialization: 'Machine Learning, AI',
    submitted: '2026-03-20',
    status: 'Rejected',
  },
  {
    id: '4',
    name: 'James Kim',
    email: 'james.kim@example.com',
    specialization: 'Competitive Programming, C++',
    submitted: '2026-03-18',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@example.com',
    specialization: 'Database Design, SQL',
    submitted: '2026-03-15',
    status: 'Approved',
  },
];

export const AdminApprovalsPage = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  const handleView = () => setDetailsOpen(true);
  const handleApprove = () => setApprovalAction('approve');
  const handleReject = () => setApprovalAction('reject');
  const handleConfirm = () => {
    console.log(`${approvalAction} trainer`);
    setApprovalAction(null);
  };
  const handleCancel = () => setApprovalAction(null);

  const columns = [
    {
      id: 'name',
      label: 'Name',
      render: (row: any) => (
        <UserCell>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: '#8B1D23',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {row.name.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
              {row.email}
            </Typography>
          </Box>
        </UserCell>
      ),
    },
    { id: 'specialization', label: 'Specialization' },
    { id: 'submitted', label: 'Submitted' },
    {
      id: 'status',
      label: 'Status',
      render: (row: any) => <StatusChip label={row.status} status={row.status} />,
    },
  ];

  return (
    <PageContainer>
      <HeaderSection>
        <IconBadge>✓</IconBadge>
        <Box>
          <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
            Trainer Approvals
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, mt: '6px' }}>
            Review and approve trainer registration requests
          </Typography>
        </Box>
      </HeaderSection>

      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', mb: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="#81595bff" />
          Pending Requests
        </Typography>

        <PendingCard>
          <PendingBadge label="PENDING" />
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <UserAvatar>{pendingRequest.initials}</UserAvatar>
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                    {pendingRequest.name}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#94a3b8', mt: '2px' }}>
                    Trainer Application
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ display: { xs: 'none', md: 'block' }, height: '60px', bgcolor: '#e2e8f0' }} />

              <Box sx={{ flex: 1 }}>
                <InfoItem>
                  <InfoIcon><Mail size={16} /></InfoIcon>
                  <Box><InfoLabel>Email</InfoLabel><InfoValue>{pendingRequest.email}</InfoValue></Box>
                </InfoItem>
                <InfoItem>
                  <InfoIcon><Phone size={16} /></InfoIcon>
                  <Box><InfoLabel>Phone</InfoLabel><InfoValue>{pendingRequest.phone}</InfoValue></Box>
                </InfoItem>
                <InfoItem>
                  <InfoIcon><Calendar size={16} /></InfoIcon>
                  <Box><InfoLabel>Submitted</InfoLabel><InfoValue>{pendingRequest.submitted}</InfoValue></Box>
                </InfoItem>
              </Box>

              <Box sx={{ flex: 1 }}>
                <InfoItem>
                  <InfoIcon><Briefcase size={16} /></InfoIcon>
                  <Box><InfoLabel>Specialization</InfoLabel><InfoValue sx={{ fontSize: '13px' }}>{pendingRequest.specialization}</InfoValue></Box>
                </InfoItem>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <ActionButton variant="outlined" startIcon={<Eye size={16} />} onClick={handleView}>View</ActionButton>
                <ActionButton variant="contained" startIcon={<CheckCircle size={16} />} onClick={handleApprove}>Approve</ActionButton>
                <ActionButton variant="outlined" color="error" startIcon={<XCircle size={16} />} onClick={handleReject}>Reject</ActionButton>
              </Stack>
            </Stack>
          </Box>
        </PendingCard>
      </Box>

      <SharedTable data={approvals} columns={columns} title="Approval History" />

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>{pendingRequest.name} - Full Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Name</Typography> <Typography>{pendingRequest.name}</Typography> </Box>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Email</Typography> <Typography>{pendingRequest.email}</Typography> </Box>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Phone</Typography> <Typography>{pendingRequest.phone}</Typography> </Box>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Specialization</Typography> <Typography>{pendingRequest.specialization}</Typography> </Box>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Bio</Typography> <Typography>{pendingRequest.bio}</Typography> </Box>
            <Box> <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>Submitted Date</Typography> <Typography>{pendingRequest.submitted}</Typography> </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={approvalAction !== null} onClose={handleCancel}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>
          {approvalAction === 'approve' ? 'Approve Trainer' : 'Reject Application'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            {approvalAction === 'approve'
              ? `Are you sure you want to approve ${pendingRequest.name} as a trainer? They will be able to create and manage courses.`
              : `Are you sure you want to reject ${pendingRequest.name}'s application? They will be notified of the rejection.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: approvalAction === 'approve' ? '#8B1D23' : '#81595bff' }} onClick={handleConfirm}>
            {approvalAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AdminApprovalsPage;