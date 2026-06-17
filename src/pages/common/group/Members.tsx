import { useState } from 'react';
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
  MenuItem,
  Stack,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { FormField } from '../../../components/ui/Forms/FormField';
import type { GroupData } from '../../../types';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'trainer';
}

const mockMembers: Member[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'student' },
  { id: '3', name: 'Charlie Lee', email: 'charlie@example.com', role: 'student' },
];

interface MembersProps {
  open: boolean;
  onClose: () => void;
  group: GroupData | null;
}

const Members = ({ open, onClose, group }: MembersProps) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [newMemberId, setNewMemberId] = useState('');

  const handleRemove = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAdd = () => {
    if (!newMemberId) return;
    // Mock add
    setMembers([...members, { id: Date.now().toString(), name: 'New User', email: 'new@user.ps', role: 'student' }]);
    setNewMemberId('');
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
        <List sx={{ mb: 4 }}>
          {members.map((member, index) => (
            <Box key={member.id}>
              <ListItem
                sx={{ px: 0, py: 1.5 }}
                secondaryAction={
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'lowercase' }}>
                        {member.role}
                    </Typography>
                    <Button 
                        variantType="danger" 
                        size="small" 
                        onClick={() => handleRemove(member.id)}
                        sx={{ fontSize: '11px', px: 1, py: 0.5, height: '28px' }}
                    >
                        {t('group.members.remove')}
                    </Button>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#fef2f2', color: '#8B1D23', fontSize: '14px', fontWeight: 700 }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{member.name}</Typography>}
                  secondary={<Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>{member.email}</Typography>}
                />
              </ListItem>
              {index < members.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>

        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
            {t('group.members.addNewMember')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
            <Box sx={{ flex: 1 }}>
                <FormField
                    select
                    label=""
                    name="newMember"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    placeholder={t('group.members.selectUser')}
                >
                    <MenuItem value="101">Zaid Hassan (Student)</MenuItem>
                    <MenuItem value="102">Laila Mahmoud (Student)</MenuItem>
                    <MenuItem value="103">Omar Khalid (Trainer)</MenuItem>
                </FormField>
            </Box>
            <Button 
                variantType="default" 
                onClick={handleAdd}
                startIcon={<UserPlus size={16} />}
                sx={{ mb: 0.5, height: '42px' }}
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
