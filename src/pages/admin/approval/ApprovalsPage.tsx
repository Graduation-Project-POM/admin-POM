import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Card,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
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

const PageContainer = styled(Box)({
  padding: '40px 24px',
  minHeight: '100vh',
});

const HeaderSection = styled(Box)({
  marginBottom: '40px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
});

const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.15) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '28px',
  flexShrink: 0,
});

const PendingCard = styled(Card)({
  borderRadius: '16px',
  border: '2px solid #e2e8f0',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: '40px',
  position: 'relative',
  overflow: 'hidden',

   '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #b68083ff 100%)',
  },

});

const PendingBadge = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: '#fef3c7',
  color: '#92400e',
  fontWeight: 700,
  fontSize: '12px',
  height: '32px',
  border: '1px solid #fde047',
});

const UserAvatar = styled(Avatar)({
  width: 56,
  height: 56,
  backgroundColor: '#8B1D23',
  fontSize: '24px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(139, 29, 35, 0.2)',
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
});

const InfoIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
  color: '#8B1D23',
  flexShrink: 0,
});

const InfoLabel = styled(Typography)({
  fontSize: '12px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const InfoValue = styled(Typography)({
  fontSize: '14px',
  color: '#1e293b',
  fontWeight: 600,
});

const ActionButton = styled(Button)(({ variant, color }: any) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '12px',
  borderRadius: '8px',
  transition: 'all 0.25s ease',

  minWidth: 'unset',
  height: '34px',
  padding: '6px 12px',

  '& .MuiButton-startIcon': {
    marginRight: '4px',
  },

  ...(variant === 'contained' && {
    backgroundColor: '#8B1D23',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(139, 29, 35, 0.18)',

    '&:hover': {
      backgroundColor: '#6d1620',
      boxShadow: '0 4px 14px rgba(139, 29, 35, 0.22)',
      transform: 'translateY(-1px)',
    },
  }),

  ...(color === 'error' && {
    borderColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fee2e2',

    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
  }),
}));

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => {
  const statusMap: Record<string, any> = {
    Approved: {
      bg: '#dcfce7',
      text: '#166534',
    },
    Rejected: {
      bg: '#fee2e2',
      text: '#991b1b',
    },
    Pending: {
      bg: '#fef3c7',
      text: '#92400e',
    },
  };

  const statusColor = statusMap[status];
  return {
    height: '28px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: statusColor.bg,
    color: statusColor.text,
    border: 'none',
  };
});

const UserCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

// ========== Data ==========
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

// ========== Component ==========
export const AdminApprovalsPage = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  const handleView = () => {
    setDetailsOpen(true);
  };

  const handleApprove = () => {
    setApprovalAction('approve');
  };

  const handleReject = () => {
    setApprovalAction('reject');
  };

  const handleConfirm = () => {
    console.log(`${approvalAction} trainer`);
    setApprovalAction(null);
  };

  const handleCancel = () => {
    setApprovalAction(null);
  };

  // ========== SharedTable Columns Configuration ==========
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
            {row.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
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
    {
      id: 'specialization',
      label: 'Specialization',
    },
    {
      id: 'submitted',
      label: 'Submitted',
    },
    {
      id: 'status',
      label: 'Status',
      render: (row: any) => (
        <StatusChip label={row.status} status={row.status} />
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <HeaderSection>
        <IconBadge>✓</IconBadge>
        <Box>
          <Typography
            sx={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-0.5px',
            }}
          >
            Trainer Approvals
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 500,
              marginTop: '6px',
            }}
          >
            Review and approve trainer registration requests
          </Typography>
        </Box>
      </HeaderSection>

      {/* Pending Requests Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={20} color="#81595bff" />
          Pending Requests
        </Typography>

        <PendingCard>
          <PendingBadge label="PENDING" />

          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* User Avatar and Basic Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <UserAvatar>{pendingRequest.initials}</UserAvatar>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    {pendingRequest.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#94a3b8',
                      marginTop: '2px',
                    }}
                  >
                    Trainer Application
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ display: { xs: 'none', md: 'block' }, height: '60px', bgcolor: '#e2e8f0' }} />

              {/* Contact & Details */}
              <Box sx={{ flex: 1 }}>
                <InfoItem>
                  <InfoIcon>
                    <Mail size={16} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{pendingRequest.email}</InfoValue>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <Phone size={16} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{pendingRequest.phone}</InfoValue>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <Calendar size={16} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Submitted</InfoLabel>
                    <InfoValue>{pendingRequest.submitted}</InfoValue>
                  </Box>
                </InfoItem>
              </Box>

              {/* Specialization */}
              <Box sx={{ flex: 1 }}>
                <InfoItem>
                  <InfoIcon>
                    <Briefcase size={16} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Specialization</InfoLabel>
                    <InfoValue sx={{ fontSize: '13px' }}>
                      {pendingRequest.specialization}
                    </InfoValue>
                  </Box>
                </InfoItem>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1.5} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <ActionButton
                  variant="outlined"
                  startIcon={<Eye size={16} />}
                  onClick={handleView}
                >
                  View
                </ActionButton>
                <ActionButton
                  variant="contained"
                  startIcon={<CheckCircle size={16} />}
                  onClick={handleApprove}
                >
                  Approve
                </ActionButton>
                <ActionButton
                  variant="outlined"
                  color="error"
                  startIcon={<XCircle size={16} />}
                  onClick={handleReject}
                >
                  Reject
                </ActionButton>
              </Stack>
            </Stack>
          </Box>
        </PendingCard>
      </Box>

      {/* SharedTable for Approvals History */}
      <SharedTable
        data={approvals}
        columns={columns}
        title="Approval History"
      />

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>
          {pendingRequest.name} - Full Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Name
              </Typography>
              <Typography>{pendingRequest.name}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Email
              </Typography>
              <Typography>{pendingRequest.email}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Phone
              </Typography>
              <Typography>{pendingRequest.phone}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Specialization
              </Typography>
              <Typography>{pendingRequest.specialization}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Bio
              </Typography>
              <Typography>{pendingRequest.bio}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', mb: 0.5, textTransform: 'uppercase' }}>
                Submitted Date
              </Typography>
              <Typography>{pendingRequest.submitted}</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approval Action Dialog */}
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: approvalAction === 'approve' ? '#8B1D23' : '#81595bff',
            }}
            onClick={handleConfirm}
          >
            {approvalAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AdminApprovalsPage;