const DEFAULT_API_BASE_URL = 'https://tesis-mfga.onrender.com/api';

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = trimSlash(
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
);

export const STATIC_BASE_URL = trimSlash(
  process.env.EXPO_PUBLIC_STATIC_BASE_URL || API_BASE_URL.replace(/\/api$/, '')
);

export const STATIC_DISCOVER_DESTINATIONS_URL =
  `${STATIC_BASE_URL}/after_login/Discover_PlacesV2/data/destinations.json`;

export const STATIC_AUDIO_GUIDES_BASE_URL =
  `${STATIC_BASE_URL}/after_login/Audio_guides`;

export const STATIC_AUDIO_ASSETS_BASE_URL =
  `${STATIC_AUDIO_GUIDES_BASE_URL}/AudioGuides`;

export const REQUEST_TIMEOUT_MS = 60000;

export const buildApiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const buildStaticUrl = (path: string) =>
  `${STATIC_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const buildStaticAssetUrl = (...segments: string[]) =>
  `${STATIC_BASE_URL}/${segments
    .map((segment) =>
      segment
        .split('/')
        .filter(Boolean)
        .map((part) => encodeURIComponent(part))
        .join('/')
    )
    .join('/')}`;
