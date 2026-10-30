import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { MemberPicker } from '../../../components/ui/MemberPicker/MemberPicker';
import type { GroupData } from '../../../types';
import { groupService } from '../../../services/groupService';
import { studentService } from '../../../services/studentService';
import type { StudentOption } from '../../../services/studentService';
import type { GroupStudent } from '../../../types/group';
import { getApiErrorMessage } from '../../../utils/apiError';
import { brand, neutral } from '../../../theme';

interface MembersProps {
  open: boolean;
  onClose: () => void;
  group: GroupData | null;
  onMembersChanged?: () => void;
}

const Members = ({ open, onClose, group, onMembersChanged }: MembersProps) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<GroupStudent[]>([]);
  const [allStudents, setAllStudents] = useState<StudentOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!group) return;
    setLoading(true);
    setError(null);
    try {
      const [m, s] = await Promise.all([
        groupService.getStudents(Number(group.id)),
        studentService.getAccepted(),
      ]);
      setMembers(m);
      setAllStudents(s);
    } catch (err) {
      setError(getApiErrorMessage(err, t('group.members.loadFailed', 'Failed to load members')));
    } finally {
      setLoading(false);
    }
  }, [group, t]);

  useEffect(() => {
    if (open && group) {
      setSelectedIds([]);
      void loadData();
    }
  }, [open, group, loadData]);

  const memberIds = new Set(members.map((m) => m.studentId));
  const available = allStudents.filter((s) => !memberIds.has(s.id));

  const handleAdd = async () => {
    if (!group || selectedIds.length === 0) return;
    setError(null);
    try {
      await groupService.addStudents(Number(group.id), selectedIds);
      setSelectedIds([]);
      await loadData();
      onMembersChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, t('group.members.addFailed', 'Failed to add members')));
    }
  };

  const handleRemove = async (studentId: number) => {
    if (!group) return;
    setError(null);
    try {
      await groupService.removeStudent(Number(group.id), studentId);
      await loadData();
      onMembersChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, t('group.members.removeFailed', 'Failed to remove member')));
    }
  };

  if (!group) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t('group.members.title', { title: group.title })}
      maxWidth="sm"
    >
      <Box sx={{ mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: brand[500] }} />
          </Box>
        ) : members.length === 0 ? (
          <Typography sx={{ color: neutral[400], fontWeight: 600, py: 2 }}>
            {t('group.members.noMembers', 'No members in this group yet')}
          </Typography>
        ) : (
          <List sx={{ mb: 4 }}>
            {members.map((member, index) => (
              <Box key={member.studentId}>
                <ListItem
                  sx={{ px: 0, py: 1.5 }}
                  secondaryAction={
                    <Button
                      variantType="danger"
                      size="small"
                      onClick={() => handleRemove(member.studentId)}
                      sx={{ fontSize: '12px', px: 1, py: 0.5, height: '28px' }}
                    >
                      {t('group.members.remove')}
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#fef2f2', color: brand[500], fontSize: '14px', fontWeight: 700 }}>
                      {member.fullName.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: neutral[800] }}>
                        {member.fullName}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: '12px', color: neutral[400] }}>
                        {t('group.members.joined', 'Joined')}{' '}
                        {new Date(member.joinDate).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < members.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        )}

        <Box sx={{ p: 2, bgcolor: neutral[50], borderRadius: '12px', border: `1px solid ${neutral[100]}` }}>
          <MemberPicker
            options={available}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            label={t('group.members.addNewMember')}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variantType="default"
              onClick={handleAdd}
              startIcon={<UserPlus size={16} />}
              disabled={selectedIds.length === 0}
            >
              {t('buttons.add')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variantType="outline" onClick={onClose}>
            {t('buttons.close')}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default Members;
