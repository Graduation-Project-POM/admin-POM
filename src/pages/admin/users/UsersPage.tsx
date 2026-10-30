import { useCallback, useEffect, useState } from "react";
import { SharedTable } from "../../../components/ui/table/tables";
import { Avatar, Typography, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Create from "./Create";
import Edit from "./Edit";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  getUsers,
  deleteUser,
  roleIdToLabel,
  type BackendUser,
} from "../../../services/userService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { brand, statusTone } from '../../../theme';
import { PageHeader } from "../../../components/common/shell";
import { ErrorState, LoadingState } from '../../../components/common/states';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  group?: string;
  joinedDate: string;
};

/** Shape passed to the Edit user modal. */
interface EditUserData {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  profileImageUrl: string;
  isActive: boolean;
}

const UserCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  fontSize: "12px",
  height: 22,
  fontWeight: 600,
  ...(status === "active" && {
    backgroundColor: statusTone.success.bg,
    color: statusTone.success.fg,
  }),
  ...(status === "inactive" && {
    backgroundColor: statusTone.danger.bg,
    color: statusTone.danger.fg,
  }),
  ...(status === "pending" && {
    backgroundColor: statusTone.warning.bg,
    color: statusTone.warning.fg,
  }),
}));

const toTableRow = (u: BackendUser): User => ({
  id: String(u.id),
  name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
  email: u.email,
  role: roleIdToLabel(u.roleID),
  status: u.isActive ? "active" : "inactive",
  group: "—",
  joinedDate: u.createdAt ? u.createdAt.split("T")[0] : "—",
});

export const AdminUsersPage = () => {
  const { t } = useTranslation();
  const [rawUsers, setRawUsers] = useState<BackendUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EditUserData | null>(null);

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

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Newest first: most recently created user at the top of the table.
      const data = [...(await getUsers())].sort(
        (a, b) =>
          (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) ||
          b.id - a.id,
      );
      setRawUsers(data);
      setUsers(data.map(toTableRow));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("admin.users.form.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const removeUsers = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteUser(Number(id))));
      await loadUsers();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("admin.users.form.deleteError")));
    }
  };

  const handleDelete = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;
    setConfirmConfig({
      open: true,
      title: t("admin.users.delete.bulkTitle"),
      message: t("admin.users.delete.bulkMessage", { count: selectedIds.length }),
      onConfirm: () => removeUsers(selectedIds),
    });
  };

  const handleSingleDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("admin.users.delete.singleTitle"),
      message: t("admin.users.delete.singleMessage"),
      onConfirm: () => removeUsers([id]),
    });
  };

  const handleEditClick = (user: User) => {
    const raw = rawUsers.find((u) => String(u.id) === user.id);
    if (!raw) return;
    setSelectedUser({
      id: raw.id,
      firstName: raw.firstName,
      middleName: raw.middleName ?? "",
      lastName: raw.lastName,
      userName: raw.userName,
      email: raw.email,
      phone: raw.phoneNumber ?? "",
      gender: (raw.gender ?? "").toLowerCase(),
      role: roleIdToLabel(raw.roleID).toUpperCase(),
      profileImageUrl: raw.profileImageUrl ?? "",
      isActive: raw.isActive,
    });
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      id: "name",
      label: t("admin.users.columns.name"),
      render: (row: User) => (
        <UserCell>
          <Avatar sx={{ width: 34, height: 34, bgcolor: brand[500], fontSize: "0.875rem" }}>
            {row.name[0]}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
        </UserCell>
      ),
    },
    { id: "email", label: t("admin.users.columns.email") },
    {
      id: "role",
      label: t("admin.users.columns.role"),
      render: (row: User) => t(`admin.users.roles.${row.role}`, row.role),
    },
    {
      id: "status",
      label: t("admin.users.columns.status"),
      render: (row: User) => (
        <StatusChip
          label={t(`admin.users.status.${row.status}`, row.status)}
          status={row.status}
          size="small"
        />
      ),
    },
    { id: "group", label: t("admin.users.columns.group") },
    { id: "joinedDate", label: t("admin.users.columns.joined") },
  ];

  return (
    <Box>
      <PageHeader title={t("admin.users.title")} subtitle={t("admin.users.subtitle")} />

      {error && (
        <ErrorState message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <SharedTable
          data={users}
          columns={columns}
          onAdd={() => setIsModalOpen(true)}
          onDelete={handleDelete}
          onEdit={handleEditClick}
          onSingleDelete={handleSingleDelete}
          searchPlaceholder={t("admin.users.searchPlaceholder")}
          addButtonLabel={t("admin.users.createButton")}
        />
      )}

      <Create
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadUsers}
      />

      {selectedUser && (
        <Edit
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
          onSuccess={loadUsers}
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
