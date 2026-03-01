import { requestJson } from '@/lib/http';
import type { SessionUser } from '@/types';

export const fetchUserById = (id: number) =>
  requestJson<SessionUser>(`/users/${id}`);

export const updateUserProfile = (
  id: number,
  payload: Partial<Pick<SessionUser, 'Name' | 'Email' | 'PhoneNumber'>>
) =>
  requestJson<SessionUser>(`/users/${id}`, {
    method: 'PATCH',
    body: payload,
  });
