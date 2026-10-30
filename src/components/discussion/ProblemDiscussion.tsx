import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { MessagesSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '../../utils/apiError';
import {
  addComment,
  deleteComment,
  getDiscussion,
  updateComment,
  type ProblemComment,
} from '../../services/discussionService';
import { CommentComposer } from './CommentComposer';
import { CommentCard } from './CommentCard';
import { neutral } from '../../theme';

interface ProblemDiscussionProps {
  problemId: number;
}


export const ProblemDiscussion = ({ problemId }: ProblemDiscussionProps) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<ProblemComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setComments(await getDiscussion(problemId));
    } catch (err: unknown) {
      setLoadError(getApiErrorMessage(err, t('discussion.loadError')));
    } finally {
      setLoading(false);
    }
  }, [problemId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const messageCount = useMemo(
    () => comments.reduce((total, c) => total + 1 + c.replies.length, 0),
    [comments],
  );

  const run = async (action: () => Promise<unknown>, fallbackKey: string) => {
    setActionError(null);
    try {
      await action();
      setComments(await getDiscussion(problemId));
    } catch (err: unknown) {
      setActionError(getApiErrorMessage(err, t(fallbackKey)));
    }
  };

  const handlePost = (body: string, photo: string | null) =>
    run(
      () => addComment(problemId, { body: body || undefined, photoFileKey: photo ?? undefined }),
      'discussion.postError',
    );

  const handleReply = (parentId: number, body: string, photo: string | null) =>
    run(
      () =>
        addComment(problemId, {
          body: body || undefined,
          photoFileKey: photo ?? undefined,
          parentCommentId: parentId,
        }),
      'discussion.postError',
    );

  const handleEdit = (commentId: number, body: string, photo: string | null) =>
    run(
      () => updateComment(commentId, { body: body || undefined, photoFileKey: photo ?? undefined }),
      'discussion.editError',
    );

  const handleDelete = (commentId: number) =>
    run(() => deleteComment(commentId), 'discussion.deleteError');

  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}
      >
        <MessagesSquare size={24} color="#8B1D23" />
        {t('discussion.title', { count: messageCount })}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
        {t('discussion.subtitle')}
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: '16px', border: `1px solid ${neutral[200]}`, bgcolor: '#f8fafc', mb: 3 }}
      >
        <CommentComposer
          placeholder={t('discussion.placeholder')}
          submitLabel={t('discussion.post')}
          onSubmit={handlePost}
        />
      </Paper>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: '#8B1D23' }} />
        </Box>
      ) : loadError ? (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {loadError}
        </Alert>
      ) : comments.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '16px',
            border: `1px dashed ${neutral[200]}`,
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
            {t('discussion.empty')}
          </Typography>
          <Typography variant="body2">{t('discussion.emptyHint')}</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProblemDiscussion;
