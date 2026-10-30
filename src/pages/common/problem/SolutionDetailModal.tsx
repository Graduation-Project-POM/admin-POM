import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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

interface SolutionDetailModalProps {
  open: boolean;
  onClose: () => void;
  submission: StudentSubmission | null;
  problemTitle: string;
  onSaveMark: (id: string, score: number) => void;
}

export const SolutionDetailModal = ({ open, onClose, submission, problemTitle, onSaveMark }: SolutionDetailModalProps) => {
  const [score, setScore] = useState<number>(submission?.score || 0);

  if (!submission) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`${submission.name} - ${problemTitle}`}
      maxWidth="sm"
    >
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800] }}>Status:</Typography>
            <Chip 
              label={submission.status} 
              size="small"
              sx={{ 
                fontWeight: 700, 
                fontSize: '11px',
                bgcolor: submission.status === 'Solved' ? statusTone.success.bg : statusTone.danger.bg,
                color: submission.status === 'Solved' ? statusTone.success.fg : statusTone.danger.fg,
              }} 
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800] }}>Score:</Typography>
             <input 
                type="number" 
                value={score} 
                onChange={(e) => setScore(Number(e.target.value))}
                style={{
                    width: '60px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: `1.5px solid ${neutral[200]}`,
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none'
                }}
             />
          </Box>
        </Box>

        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800], mb: 1.5 }}>Solution:</Typography>
        
        {submission.solutionCode ? (
            <Box sx={{ 
                p: 2.5, 
                bgcolor: neutral[50], 
                borderRadius: '12px', 
                border: `1px solid ${neutral[200]}`,
                mb: 3,
                fontFamily: 'monospace',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                color: neutral[700]
            }}>
                {submission.solutionCode}
            </Box>
        ) : (
            <Box sx={{ py: 4, textAlign: 'center', bgcolor: neutral[50], borderRadius: '12px', border: `1px dashed ${neutral[200]}`, mb: 3 }}>
                <AlertCircle size={32} color={neutral[400]} style={{ marginBottom: 8 }} />
                <Typography sx={{ fontWeight: 700, color: neutral[800], mb: 0.5 }}>No submission found.</Typography>
                <Typography variant="body2" sx={{ color: neutral[500] }}>This student has not submitted a solution yet.</Typography>
            </Box>
        )}

        {submission.result && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: neutral[800] }}>Result:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: statusTone.success.fg }}>
                    <CheckCircle2 size={16} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{submission.result}</Typography>
                </Box>
            </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Button 
            variantType="default" 
            startIcon={<CheckCircle2 size={18} />}
            onClick={() => onSaveMark(submission.id, score)}
            sx={{ px: 3, bgcolor: statusTone.success.fg, '&:hover': { bgcolor: statusTone.success.fg } }}
          >
            Mark as Done
          </Button>
          <Button variantType="outline" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
