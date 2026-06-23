import { Box, IconButton, Stack, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Label } from '../../../components/ui/label/Label';
import { Input } from '../../../components/ui/input/Input';
import { Button } from '../../../components/ui/button/Button';
import type { ProblemExample } from '../../../types/problem';

interface Props {
  value: ProblemExample[];
  onChange: (next: ProblemExample[]) => void;
}

const emptyExample = (): ProblemExample => ({ input: '', output: '', explanation: '' });

export const ProblemExamplesEditor = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const update = (idx: number, patch: Partial<ProblemExample>) => {
    onChange(value.map((ex, i) => (i === idx ? { ...ex, ...patch } : ex)));
  };

  const add = () => onChange([...value, emptyExample()]);
  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <Box>
      <Label>{t('problem.form.examplesLabel')}</Label>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {value.length === 0 && (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            {t('problem.form.examplesEmpty')}
          </Typography>
        )}
        {value.map((ex, idx) => (
          <Box
            key={idx}
            sx={{
              p: 2,
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              bgcolor: '#fafafa',
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>
                {t('problem.form.exampleN', { n: idx + 1 })}
              </Typography>
              <IconButton size="small" onClick={() => remove(idx)} sx={{ color: '#dc2626' }} aria-label="remove example">
                <Trash2 size={16} />
              </IconButton>
            </Box>
            <Stack spacing={1.5}>
              <Box>
                <Label>{t('problem.form.exampleInput')}</Label>
                <Input
                  value={ex.input}
                  onChange={(e) => update(idx, { input: e.target.value })}
                  multiline
                  rows={2}
                  placeholder={t('problem.form.exampleInputPlaceholder')}
                />
              </Box>
              <Box>
                <Label>{t('problem.form.exampleOutput')}</Label>
                <Input
                  value={ex.output}
                  onChange={(e) => update(idx, { output: e.target.value })}
                  multiline
                  rows={2}
                  placeholder={t('problem.form.exampleOutputPlaceholder')}
                />
              </Box>
              <Box>
                <Label>{t('problem.form.exampleExplanation')}</Label>
                <Input
                  value={ex.explanation ?? ''}
                  onChange={(e) => update(idx, { explanation: e.target.value })}
                  multiline
                  rows={2}
                  placeholder={t('problem.form.exampleExplanationPlaceholder')}
                />
              </Box>
            </Stack>
          </Box>
        ))}
        <Button
          variantType="outline"
          startIcon={<Plus size={16} />}
          onClick={add}
          type="button"
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('problem.form.addExample')}
        </Button>
      </Stack>
    </Box>
  );
};
