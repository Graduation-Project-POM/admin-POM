import { Stack, Typography, Box, Divider } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { Users, User, Calendar, Info } from 'lucide-react';
import type { GroupData } from '../../../types';

interface ViewGroupProps {
  open: boolean;
  onClose: () => void;
  group: GroupData | null;
}

const DetailItem = ({ icon, label, value }: { icon: any; label: string; value?: string | number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '8px', color: '#8B1D23' }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ color: '#1e293b', fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const View = ({ open, onClose, group }: ViewGroupProps) => {
  if (!group) return null;

  return (
    <ModalWrapper open={open} onClose={onClose} title="Group Details" maxWidth="sm">
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            {group.title}
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
            {group.description}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <DetailItem icon={<Users size={20} />} label="Total Students" value={group.studentsCount} />
          <DetailItem icon={<User size={20} />} label="Trainer" value={group.trainerName} />
          <DetailItem icon={<Calendar size={20} />} label="Created On" value={group.createdDate} />
          <DetailItem icon={<Info size={20} />} label="Group ID" value={`#${group.id}`} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variantType="outline" onClick={onClose}>Close</Button>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default View;
