import { api } from "./authService";

export interface ProblemComment {
  id: number;
  problemId: number;
  parentCommentId: number | null;
  authorId: number;
  authorName: string;
  authorRole: string;
  authorImageUrl?: string | null;
  body?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isMine: boolean;
  canEdit: boolean;
  canDelete: boolean;
  replies: ProblemComment[];
}

export interface CreateCommentPayload {
  body?: string;
  photoFileKey?: string;
  parentCommentId?: number | null;
}

export interface UpdateCommentPayload {
  body?: string;
  photoFileKey?: string;
}

const BASE = "/api/Problems";

export const getDiscussion = async (
  problemId: number,
): Promise<ProblemComment[]> => {
  const response = await api.get<ProblemComment[]>(`${BASE}/${problemId}/discussion`);
  return response.data;
};

export const addComment = async (
  problemId: number,
  data: CreateCommentPayload,
): Promise<ProblemComment> => {
  const response = await api.post<ProblemComment>(
    `${BASE}/${problemId}/discussion`,
    data,
  );
  return response.data;
};

export const updateComment = async (
  commentId: number,
  data: UpdateCommentPayload,
): Promise<ProblemComment> => {
  const response = await api.put<ProblemComment>(
    `${BASE}/discussion/${commentId}`,
    data,
  );
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`${BASE}/discussion/${commentId}`);
};
