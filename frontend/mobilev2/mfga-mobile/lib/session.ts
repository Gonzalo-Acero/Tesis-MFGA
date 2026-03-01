import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SessionPayload } from '@/types';

const SESSION_KEY = 'mfga_session';

export const loadSession = async (): Promise<SessionPayload | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
};

export const saveSession = async (session: SessionPayload) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
