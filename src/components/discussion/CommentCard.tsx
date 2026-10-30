import { useState } from 'react';
import { Avatar, Box, Chip, Paper, Typography } from '@mui/material';
import { CornerDownRight, Pencil, Reply, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button/Button';
import { ConfirmationModal } from '../common/modal/ConfirmationModal';
import { resolveMediaUrl } from '../../utils/media';
import { formatDateTime } from '../../utils/datetime';
import { CommentComposer } from './CommentComposer';
import type { ProblemComment } from '../../services/discussionService';
import { neutral } from '../../theme';

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  Admin: { bg: '#fef2f2', color: '#8B1D23' },
  Trainer: { bg: '#eef2ff', color: '#4338ca' },
};

interface CommentCardProps {
  comment: ProblemComment;
  isReply?: boolean;
  onReply: (parentId: number, body: string, photo: string | null) => Promise<void>;
  onEdit: (commentId: number, body: string, photo: string | null) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export const CommentCard = ({
  comment,
  isReply = false,
  onReply,
  onEdit,
  onDelete,
}: CommentCardProps) => {
  const { t } = useTranslation();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const roleStyle = ROLE_STYLES[comment.authorRole];
  const authorName = comment.authorName.trim() || t('discussion.unknownAuthor');
  const avatarUrl = resolveMediaUrl(comment.authorImageUrl) ?? undefined;

  return (
    <Paper
      elevation={0}
      sx={{
        p: isReply ? 2 : 2.5,
        borderRadius: '12px',
        border: `1px solid ${neutral[200]}`,
        bgcolor: comment.isMine ? '#fffaf9' : '#fff',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar
          src={avatarUrl}
          sx={{
            width: isReply ? 32 : 40,
            height: isReply ? 32 : 40,
            bgcolor: comment.isMine ? '#8B1D23' : '#fef2f2',
            color: comment.isMine ? '#fff' : '#8B1D23',
            fontWeight: 700,
            fontSize: isReply ? '12px' : '14px',
          }}
        >
          {initials(authorName)}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.25 }}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: isReply ? '13px' : '14px' }}>
              {authorName}
            </Typography>
            {comment.isMine && (
              <Chip
                label={t('discussion.youBadge')}
                size="small"
                sx={{ bgcolor: '#8B1D23', color: '#fff', fontWeight: 700, fontSize: '12px', height: 18 }}
              />
            )}
            {roleStyle && (
              <Chip
                label={t('discussion.roles.' + comment.authorRole.toLowerCase(), comment.authorRole)}
                size="small"
                sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 700, fontSize: '12px', height: 18 }}
              />
            )}
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {formatDateTime(comment.createdAt)}
              {comment.updatedAt ? ' · ' + t('discussion.edited') : ''}
            </Typography>
          </Box>

          {editing ? (
            <Box sx={{ mt: 1 }}>
              <CommentComposer
                compact
                autoFocus
                placeholder={t('discussion.placeholder')}
                submitLabel={t('discussion.saveEdit')}
                initialBody={comment.body ?? ''}
                initialPhoto={comment.photoUrl ?? null}
                onCancel={() => setEditing(false)}
                onSubmit={async (body, photo) => {
                  await onEdit(comment.id, body, photo);
                  setEditing(false);
                }}
              />
            </Box>
          ) : (
            <>
              {comment.body && (
                <Typography
                  sx={{
                    color: '#334155',
                    fontSize: isReply ? '13.5px' : '14.5px',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {comment.body}
                </Typography>
              )}

              {comment.photoUrl && (
                <Box sx={{ mt: 1.5, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${neutral[200]}`, maxWidth: 420 }}>
                  <img
                    src={resolveMediaUrl(comment.photoUrl) ?? undefined}
                    alt={t('discussion.attachmentAlt')}
                    style={{ width: '100%', display: 'block' }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                <Button
                  variantType="ghost"
                  size="small"
                  startIcon={<Reply size={13} />}
                  onClick={() => setReplying((v) => !v)}
                  sx={{ fontSize: '12px', minWidth: 'auto' }}
                >
                  {t('discussion.reply')}
                </Button>
                {comment.canEdit && (
                  <Button
                    variantType="ghost"
                    size="small"
                    startIcon={<Pencil size={13} />}
                    onClick={() => setEditing(true)}
                    sx={{ fontSize: '12px', minWidth: 'auto' }}
                  >
                    {t('discussion.edit')}
                  </Button>
                )}
                {comment.canDelete && (
                  <Button
                    variantType="ghost"
                    size="small"
                    startIcon={<Trash2 size={13} />}
                    onClick={() => setConfirmOpen(true)}
                    sx={{ fontSize: '12px', minWidth: 'auto', color: '#dc2626' }}
                  >
                    {t('discussion.delete')}
                  </Button>
                )}
              </Box>
            </>
          )}

          {replying && (
            <Box sx={{ mt: 1.5, pl: 1.5, borderLeft: `2px solid ${neutral[100]}` }}>
              <CommentComposer
                compact
                autoFocus
                placeholder={t('discussion.replyPlaceholder', { name: authorName })}
                submitLabel={t('discussion.postReply')}
                onCancel={() => setReplying(false)}
                onSubmit={async (body, photo) => {
                  await onReply(comment.id, body, photo);
                  setReplying(false);
                }}
              />
            </Box>
          )}

          {comment.replies.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CornerDownRight size={12} />
                {t('discussion.replyCount', { count: comment.replies.length })}
              </Typography>
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  isReply
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void onDelete(comment.id)}
        title={t('discussion.deleteTitle')}
        message={
          comment.replies.length > 0
            ? t('discussion.deleteMessageWithReplies', { count: comment.replies.length })
            : t('discussion.deleteMessage')
        }
      />
    </Paper>
  );
};

export default CommentCard;
