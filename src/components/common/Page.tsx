import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from './states';

interface PageProps {
  title: string;
}

/**
 * Placeholder route shell for screens that are not built yet. Uses the shared
 * page header and the standard empty state so an unbuilt screen still looks
 * like part of the product rather than a stray grey box.
 */
export const Page: React.FC<PageProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <Chip
          label={t('ui.page.year')}
          variant="outlined"
          sx={{ fontWeight: 600, color: 'text.secondary', bgcolor: 'background.paper' }}
        />
      </Box>

      <EmptyState
        icon={<Construction size={24} />}
        title={title}
        description={t('ui.page.placeholder', { title })}
      />
    </Box>
  );
};
