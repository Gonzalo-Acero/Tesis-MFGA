import AsyncStorage from '@react-native-async-storage/async-storage';

const progressKey = (namespace: string, guideId: number) =>
  `audioProgress:${namespace}:${guideId}`;
const lastGuideKey = (namespace: string) => `audioLastGuide:${namespace}`;
const guideBookmarksKey = (namespace: string) => `audioBookmarks:${namespace}`;
const communityBookmarksKey = (namespace: string) =>
  `communityBookmarks:${namespace}`;
const communityGroupsKey = (namespace: string) => `communityGroups:${namespace}`;
const communityMeetupsKey = (namespace: string) => `communityMeetups:${namespace}`;

export interface AudioProgressRecord {
  guideId: number;
  progress: number;
  total: number;
  timestamp: number;
}

const readJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const saveAudioProgress = async (
  namespace: string,
  record: AudioProgressRecord
) => {
  await AsyncStorage.setItem(progressKey(namespace, record.guideId), JSON.stringify(record));
  await AsyncStorage.setItem(lastGuideKey(namespace), String(record.guideId));
};

export const loadAudioProgress = async (namespace: string, guideId: number) =>
  readJson<AudioProgressRecord | null>(progressKey(namespace, guideId), null);

export const loadLastGuideId = async (namespace: string) => {
  const raw = await AsyncStorage.getItem(lastGuideKey(namespace));
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

export const loadNumberSet = async (key: string) => {
  const values = await readJson<number[]>(key, []);
  return new Set(values.filter((value) => Number.isFinite(value)));
};

export const persistNumberSet = async (key: string, values: Set<number>) => {
  await AsyncStorage.setItem(key, JSON.stringify([...values]));
};

export const getGuideBookmarksStorageKey = guideBookmarksKey;
export const getCommunityBookmarksStorageKey = communityBookmarksKey;
export const getCommunityGroupsStorageKey = communityGroupsKey;
export const getCommunityMeetupsStorageKey = communityMeetupsKey;
