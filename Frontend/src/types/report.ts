export interface PostReportCreateDto {
  postId: number;
  reason: string;
}

export interface PostReportResponseDto {
  id: number;
  reporterId: number;
  reporterName: string;
  postId: number;
  reason: string;
  createdAt: string;

  // Post Details for Admin UI
  postContent: string;
  postImageData?: string;
  postAuthorName: string;
  postAuthorAvatarData?: string;
}

export interface CursorPagedResult<T> {
  items: T[];
  hasNextPage: boolean;
  nextCursorId?: number | null;
}
