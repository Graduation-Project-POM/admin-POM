import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface PageProps {
  title: string;
}

export const Page: React.FC<PageProps> = ({ title }) => {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          {title}
        </Typography>
        <Chip 
          label="Year: 2024" 
          variant="outlined" 
          sx={{ 
            fontWeight: 600, 
            color: '#64748b',
            borderColor: '#e2e8f0',
            bgcolor: '#ffffff'
          }} 
        />
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ffffff'
        }}
      >
        <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>
          Content for {title} will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};
