import { useEffect, useState } from "react";
import { SharedTable } from "../../../components/ui/table/tables";
import { Avatar, Typography, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Create from "./Create";
import Edit from "./Edit";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";

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
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  fontSize: "11px",
  height: 22,
  fontWeight: 600,
  ...(status === "active" && {
    backgroundColor: "#e7f7ec",
    color: "#166534",
  }),
  ...(status === "inactive" && {
    backgroundColor: "#fdecec",
    color: "#991b1b",
  }),
  ...(status === "pending" && {
    backgroundColor: "#fff7e0",
    color: "#92400e",
  }),
}));

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  useEffect(() => {
    const mock = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "student",
        status: "active",
        group: "Algorithms",
        joinedDate: "2026-01-15",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "trainer",
        status: "inactive",
        group: "—",
        joinedDate: "2026-01-10",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "admin",
        status: "active",
        group: "—",
        joinedDate: "2025-12-05",
      },
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        role: "student",
        status: "pending",
        group: "Beginner Practice",
        joinedDate: "2026-02-20",
      },
      {
        id: "5",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "trainer",
        status: "active",
        group: "—",
        joinedDate: "2026-01-10",
      },
      {
        id: "6",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "admin",
        status: "active",
        group: "—",
        joinedDate: "2025-12-05",
      },
      {
        id: "7",
        name: "Sarah Williams",
        email: "sarah@example.com",
        role: "student",
        status: "active",
        group: "Beginner Practice",
        joinedDate: "2026-02-20",
      },
    ];

    setUsers(mock);
  }, []);

  const handleDelete = (selectedIds: string[]) => {
    setConfirmConfig({
      open: true,
      title: "Delete Users",
      message: `Are you sure you want to delete ${selectedIds.length} selected user(s)? This action cannot be undone.`,
      onConfirm: () => {
        setUsers(users.filter(u => !selectedIds.includes(u.id)));
      }
    });
  };

  const handleSingleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this user?`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEditClick = (user: User) => {
    // Transform table user to form user format
    const [firstName, ...lastNameParts] = user.name.split(' ');
    setSelectedUser({
      id: user.id,
      firstName,
      lastName: lastNameParts.join(' '),
      email: user.email,
      phone: '', // mock
      role: user.role.toUpperCase(),
      isActive: user.status === 'active'
    });
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      id: "name",
      label: "Name",
      render: (row: User) => (
        <UserCell>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#7A1E1E" }}>
            {row.name[0]}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
        </UserCell>
      ),
    },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    {
      id: "status",
      label: "Status",
      render: (row: User) => (
        <StatusChip label={row.status} status={row.status} />
      ),
    },
    { id: "group", label: "Group" },
    { id: "joinedDate", label: "Joined" },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Users
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#64748b", fontWeight: 500 }}
          >
            Manage users in the system
          </Typography>
        </Box>


      </Box>
      <SharedTable
        data={users}
        columns={columns}
        onAdd={() => setIsModalOpen(true)}
        onDelete={handleDelete}
        onEdit={handleEditClick}
        onSingleDelete={handleSingleDelete}
        searchPlaceholder="Search users..."
        addButtonLabel="Create User"
      />

      <Create open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {selectedUser && (
        <Edit
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
        />
      )}

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
