import { Box, Divider, Typography } from '@mui/material';
import { ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProblemExample } from '../../services/problemService';
import { brand, neutral } from '../../theme';

interface ProblemConstraintsExamplesProps {
  constraints?: string | null;
  examples?: ProblemExample[] | null;
}

const codeBoxSx = {
  m: 0,
  p: 1.5,
  borderRadius: '8px',
  bgcolor: neutral[0],
  border: `1px solid ${neutral[200]}`,
  fontSize: '13px',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
} as const;

/** Constraints and worked examples of a problem, as entered in the create/edit form. */
export const ProblemConstraintsExamples = ({ constraints, examples }: ProblemConstraintsExamplesProps) => {
  const { t } = useTranslation();
  const hasConstraints = Boolean(constraints && constraints.trim());
  const visibleExamples = (examples ?? []).filter((ex) => ex.input?.trim() || ex.output?.trim());

  if (!hasConstraints && visibleExamples.length === 0) return null;

  return (
    <>
      {hasConstraints && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: neutral[800], fontWeight: 700, mb: 1 }}>
            <ListChecks size={18} color={brand[500]} />
            {t('student.problemDetails.constraints')}
          </Typography>
          <Typography
            component="pre"
            sx={{ color: neutral[600], lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap', m: 0, fontFamily: 'inherit' }}
          >
            {constraints}
          </Typography>
        </>
      )}

      {visibleExamples.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ color: neutral[800], fontWeight: 700, mb: 2 }}>
            {t('student.problemDetails.examples')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {visibleExamples.map((ex, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: '12px', border: `1px solid ${neutral[200]}`, bgcolor: neutral[50] }}>
                <Typography sx={{ fontWeight: 700, color: neutral[600], fontSize: '13px', mb: 1 }}>
                  {t('student.problemDetails.exampleN', { n: i + 1 })}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: ex.explanation ? 1.5 : 0 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                      {t('student.problemDetails.input')}
                    </Typography>
                    <Box component="pre" sx={codeBoxSx}>{ex.input}</Box>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                      {t('student.problemDetails.output')}
                    </Typography>
                    <Box component="pre" sx={codeBoxSx}>{ex.output}</Box>
                  </Box>
                </Box>
                {ex.explanation && (
                  <Box>
                    <Typography variant="caption" sx={{ color: neutral[400], fontWeight: 700 }}>
                      {t('student.problemDetails.explanation')}
                    </Typography>
                    <Typography sx={{ color: neutral[600], fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                      {ex.explanation}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default ProblemConstraintsExamples;
