import { AUDIO_CATEGORIES, getFeaturedGuide, getGuideCatalog } from '@/data/audioGuides';
import { GUIDE_PROFILES } from '@/data/guideProfiles';
import { requestJson } from '@/lib/http';
import type {
  GuideComment,
  GuideDetail,
  GuideDirectoryItem,
  GuideProfileContent,
  GuideRatingSummary,
} from '@/types';

const normalizeGuideName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const guideCategories = AUDIO_CATEGORIES;
export const getLocalGuideCatalog = () => getGuideCatalog();
export const getLocalFeaturedGuide = () => getFeaturedGuide();

export const getGuideProfileContent = (name: string): GuideProfileContent | null => {
  const target = normalizeGuideName(name);
  return (
    GUIDE_PROFILES.find((profile) =>
      profile.names.some((candidate) => normalizeGuideName(candidate) === target)
    ) || null
  );
};

export const fetchGuideDirectory = () => requestJson<GuideDirectoryItem[]>('/guides');

export const resolveGuideByName = (name: string) =>
  requestJson<GuideDetail>(`/guides/resolve?name=${encodeURIComponent(name)}`);

export const fetchGuideDetail = (guideId: number) =>
  requestJson<GuideDetail>(`/guides/${guideId}`);

export const fetchGuideComments = (guideId: number) =>
  requestJson<GuideComment[]>(`/guides/${guideId}/comments`);

export const submitGuideComment = (
  token: string,
  guideId: number,
  comment: string
) =>
  requestJson<GuideComment>(`/guides/${guideId}/comments`, {
    method: 'POST',
    token,
    body: { comment },
  });

export const submitGuideRating = (
  token: string,
  guideId: number,
  rating: number
) =>
  requestJson<GuideRatingSummary>(`/guides/${guideId}/ratings`, {
    method: 'POST',
    token,
    body: { rating },
  });

export const sendGuideMessage = (
  token: string,
  guideId: number,
  message: string
) =>
  requestJson<{ message: string }>(`/guides/${guideId}/messages`, {
    method: 'POST',
    token,
    body: { message },
  });

export const attachGuideIdsToCatalog = async () => {
  try {
    const directory = await fetchGuideDirectory();
    const lookup = new Map(
      directory.map((guide) => [normalizeGuideName(guide.Name), guide.GuideId])
    );

    const catalog = getGuideCatalog().map((guide) => ({
      ...guide,
      guideId: lookup.get(normalizeGuideName(guide.guideName)) ?? null,
    }));
    const featuredBase = getFeaturedGuide();
    const featured = {
      ...featuredBase,
      guideId: lookup.get(normalizeGuideName(featuredBase.guideName)) ?? null,
    };

    return { catalog, featured };
  } catch {
    return {
      catalog: getGuideCatalog().map((guide) => ({ ...guide, guideId: null })),
      featured: { ...getFeaturedGuide(), guideId: null },
    };
  }
};
