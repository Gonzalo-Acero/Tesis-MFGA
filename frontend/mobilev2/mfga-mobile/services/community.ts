import { requestJson } from '@/lib/http';
import type { CommunityComment, CommunityPost } from '@/types';

const mapPost = (post: any, likedPostIds: Set<number>): CommunityPost => ({
  id: Number(post.id),
  userId: Number(post.userId || 0),
  author: String(post.author || 'MFGA Explorer'),
  avatar: String(post.avatar || 'https://static.photos/people/200x200/42'),
  location: String(post.location || 'Argentina'),
  region: String(post.region || 'All Regions'),
  category: String(post.category || 'tips'),
  message: String(post.message || ''),
  image: post.image ? String(post.image) : null,
  createdAt: post.createdAt ? String(post.createdAt) : null,
  likeCount: Number(post.likeCount || 0),
  commentCount: Number(post.commentCount || 0),
  liked: likedPostIds.has(Number(post.id)),
  bookmarked: false,
});

const mapComment = (comment: any): CommunityComment => ({
  id: Number(comment.id),
  postId: Number(comment.postId),
  userId: Number(comment.userId),
  userName: String(comment.userName || 'MFGA Explorer'),
  comment: String(comment.comment || ''),
  createdAt: String(comment.createdAt || new Date().toISOString()),
});

export const communityTimeLabel = (value: string | null) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const fetchLikedPostIds = async (token: string) => {
  const response = await requestJson<number[]>('/community/posts/likes', { token });
  return new Set(response.map((value) => Number(value)).filter((value) => Number.isFinite(value)));
};

export const fetchCommunityPosts = async (token?: string | null) => {
  const likedPostIds = token ? await fetchLikedPostIds(token) : new Set<number>();
  const posts = await requestJson<any[]>('/community/posts');
  return posts.map((post) => mapPost(post, likedPostIds));
};

export const createCommunityPost = async (
  token: string,
  payload: {
    category: string;
    location: string;
    region: string;
    message: string;
    imageUrl?: string | null;
  }
) => {
  const response = await requestJson<any>('/community/posts', {
    method: 'POST',
    token,
    body: payload,
  });
  return mapPost(response, new Set());
};

export const fetchCommunityComments = async (postId: number) => {
  const response = await requestJson<any[]>(`/community/posts/${postId}/comments`);
  return response.map(mapComment);
};

export const addCommunityComment = async (
  token: string,
  postId: number,
  comment: string
) =>
  requestJson<{ comment: CommunityComment; commentCount: number }>(
    `/community/posts/${postId}/comments`,
    {
      method: 'POST',
      token,
      body: { comment },
    }
  );

export const toggleCommunityLike = async (token: string, postId: number) =>
  requestJson<{ liked: boolean; likeCount: number }>(
    `/community/posts/${postId}/likes`,
    {
      method: 'POST',
      token,
    }
  );
