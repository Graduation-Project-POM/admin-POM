import React, { useEffect, useState } from 'react';
import { SharedTable } from '../../../components/ui/tables';
import {
    Avatar,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    group?: string;
    joinedDate: string;
};

const UserCell = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
    fontSize: '11px',
    height: 22,
    fontWeight: 600,
    ...(status === 'active' && {
        backgroundColor: '#e7f7ec',
        color: '#166534',
    }),
    ...(status === 'inactive' && {
        backgroundColor: '#fdecec',
        color: '#991b1b',
    }),
    ...(status === 'pending' && {
        backgroundColor: '#fff7e0',
        color: '#92400e',
    }),
}));

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const mock = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'student',
                status: 'active',
                group: 'Algorithms',
                joinedDate: '2026-01-15',
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'trainer',
                status: 'inactive',
                group: '—',
                joinedDate: '2026-01-10',
            },
            {
                id: '3',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                role: 'admin',
                status: 'active',
                group: '—',
                joinedDate: '2025-12-05',
            },
            {
                id: '4',
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                role: 'student',
                status: 'pending',
                group: 'Beginner Practice',
                joinedDate: '2026-02-20',
            },
            {
                id: '5',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'trainer',
                status: 'active',
                group: '—',
                joinedDate: '2026-01-10',
            },
            {
                id: '6',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                role: 'admin',
                status: 'active',
                group: '—',
                joinedDate: '2025-12-05',
            },
            {
                id: '7',
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                role: 'student',
                status: 'active',
                group: 'Beginner Practice',
                joinedDate: '2026-02-20',
            },
        ];

        setUsers(mock);
    }, []);

    const columns = [
        {
            id: 'name',
            label: 'Name',
            render: (row: User) => (
                <UserCell>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#7A1E1E' }}>
                        {row.name[0]}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600 }}>
                        {row.name}
                    </Typography>
                </UserCell>
            ),
        },
        { id: 'email', label: 'Email' },
        { id: 'role', label: 'Role' },
        {
            id: 'status',
            label: 'Status',
            render: (row: User) => (
                <StatusChip label={row.status} status={row.status} />
            ),
        },
        { id: 'group', label: 'Group' },
        { id: 'joinedDate', label: 'Joined' },
    ];


    return (
        <SharedTable
            title="User Management"
            data={users}
            columns={columns}
            searchPlaceholder="Search users..."
        />
    );
};