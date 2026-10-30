import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { Button } from '../../../components/ui/button/Button';
import { neutral, statusTone } from '../../../theme';

interface StudentSubmission {
  id: string;
  name: string;
  email: string;
  status: 'Solved' | 'Not Solved' | 'Checked';
  solutionCode?: string;
  score?: number;
  result?: string;
}

interface StudentProgressModalProps {
  open: boolean;
  onClose: () => void;
  problemTitle: string;
  submissions?: StudentSubmission[];
  onViewSolution: (submission: StudentSubmission) => void;
}

export const StudentProgressModal = ({ open, onClose, problemTitle, submissions = [], onViewSolution }: StudentProgressModalProps) => {
  const [filter, setFilter] = useState<'All' | 'Solved' | 'Not Solved'>('All');

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`${problemTitle} - Student Progress`}
      maxWidth="md"
    >
      <Box sx={{ mt: 1 }}>
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button 
            variantType={filter === 'All' ? 'default' : 'outline'} 
            onClick={() => setFilter('All')}
            size="small"
          >
            All Students
          </Button>
          <Button 
            variantType={filter === 'Solved' ? 'default' : 'outline'} 
            onClick={() => setFilter('Solved')}
            size="small"
            startIcon={<CheckCircle2 size={16} color={filter === 'Solved' ? 'white' : statusTone.success.fg} />}
            sx={filter !== 'Solved' ? { color: statusTone.success.fg, bgcolor: statusTone.success.bg, border: 'none' } : {}}
          >
            Solved
          </Button>
          <Button 
            variantType={filter === 'Not Solved' ? 'default' : 'outline'} 
            onClick={() => setFilter('Not Solved')}
            size="small"
            startIcon={<XCircle size={16} color={filter === 'Not Solved' ? 'white' : statusTone.danger.fg} />}
            sx={filter !== 'Not Solved' ? { color: statusTone.danger.fg, bgcolor: statusTone.danger.bg, border: 'none' } : {}}
          >
            Not Solved
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <List>
          {filteredSubmissions.map((student, index) => (
            <Box key={student.id}>
              <ListItem
                sx={{ px: 0, py: 2 }}
                secondaryAction={
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                    <Chip 
                      label={student.status} 
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '11px',
                        bgcolor: student.status === 'Solved' ? statusTone.success.bg : statusTone.danger.bg,
                        color: student.status === 'Solved' ? statusTone.success.fg : statusTone.danger.fg,
                      }} 
                    />
                    <Button 
                      variantType="outline" 
                      size="small"
                      startIcon={<FileText size={16} />}
                      onClick={() => onViewSolution(student)}
                      sx={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      View Solution
                    </Button>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: neutral[50], color: neutral[800], border: `1px solid ${neutral[200]}`, fontSize: '14px', fontWeight: 700 }}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '15px', color: neutral[800] }}>{student.name}</Typography>}
                  secondary={<Typography sx={{ fontSize: '13px', color: neutral[400] }}>{student.email}</Typography>}
                />
              </ListItem>
              {index < filteredSubmissions.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variantType="outline" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
