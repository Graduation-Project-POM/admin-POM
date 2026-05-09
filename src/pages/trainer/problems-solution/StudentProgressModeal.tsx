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


interface StudentSubmission {
  id: string;
  name: string;
  email: string;
  status: 'Solved' | 'Not Solved' | 'Checked';
  solutionCode?: string;
  score?: number;
  result?: string;
}

const mockSubmissions: StudentSubmission[] = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    status: 'Solved',
    solutionCode: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
    result: 'Correct - All test cases passed',
    score: 100
  },
  { 
    id: '2', 
    name: 'Bob Williams', 
    email: 'bob@example.com', 
    status: 'Solved',
    solutionCode: 'def twoSum(nums, target):\n    # suboptimal solution\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
    result: 'Correct - All test cases passed',
    score: 85
  },
  { id: '3', name: 'Charlie Lee', email: 'charlie@example.com', status: 'Not Solved' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', status: 'Solved' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', status: 'Solved' },
];

interface StudentProgressModalProps {
  open: boolean;
  onClose: () => void;
  problemTitle: string;
  onViewSolution: (submission: StudentSubmission) => void;
}

export const StudentProgressModal = ({ open, onClose, problemTitle, onViewSolution }: StudentProgressModalProps) => {
  const [filter, setFilter] = useState<'All' | 'Solved' | 'Not Solved'>('All');

  const filteredSubmissions = mockSubmissions.filter(s => {
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
            startIcon={<CheckCircle2 size={16} color={filter === 'Solved' ? 'white' : '#166534'} />}
            sx={filter !== 'Solved' ? { color: '#166534', bgcolor: '#e7f7ec', border: 'none' } : {}}
          >
            Solved
          </Button>
          <Button 
            variantType={filter === 'Not Solved' ? 'default' : 'outline'} 
            onClick={() => setFilter('Not Solved')}
            size="small"
            startIcon={<XCircle size={16} color={filter === 'Not Solved' ? 'white' : '#991b1b'} />}
            sx={filter !== 'Not Solved' ? { color: '#991b1b', bgcolor: '#fdecec', border: 'none' } : {}}
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
                        bgcolor: student.status === 'Solved' ? '#e7f7ec' : '#fdecec',
                        color: student.status === 'Solved' ? '#166534' : '#991b1b',
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
                  <Avatar sx={{ bgcolor: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 700 }}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{student.name}</Typography>}
                  secondary={<Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>{student.email}</Typography>}
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
