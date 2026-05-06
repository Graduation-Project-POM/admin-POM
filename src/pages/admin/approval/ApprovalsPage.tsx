
import { SharedTable } from '../../../components/ui/tables';
import {
  Avatar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const primaryColor = '#7A1E1E';

const UserCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  height: '22px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '6px',

  ...(status === 'Approved' && {
    backgroundColor: '#e7f7ec',
    color: '#166534',
  }),

  ...(status === 'Rejected' && {
    backgroundColor: '#fdecec',
    color: '#991b1b',
  }),

  ...(status === 'Pending' && {
    backgroundColor: '#fff7e0',
    color: '#92400e',
  }),
}));

export const AdminApprovalsPage = () => {
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
  ];

  const columns = [
    {
      id: 'name',
      label: 'Name',
      render: (row: any) => (
        <UserCell>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: primaryColor,
            }}
          >
            {row.name[0]}
          </Avatar>

          <Typography sx={{ fontWeight: 600 }}>
            {row.name}
          </Typography>
        </UserCell>
      ),
    },

    {
      id: 'email',
      label: 'Email',
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
        <StatusChip
          label={row.status}
          status={row.status}
        />
      ),
    }
  ];

  return (
    <SharedTable
      data={approvals}
      columns={columns}
    />
  );
};

export default AdminApprovalsPage;