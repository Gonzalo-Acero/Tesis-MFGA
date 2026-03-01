import { DESTINATION_FALLBACK } from '@/data/destinationsFallback';
import { STATIC_DISCOVER_DESTINATIONS_URL } from '@/lib/config';
import { requestJson } from '@/lib/http';
import type { Destination } from '@/types';

export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    return await requestJson<Destination[]>(STATIC_DISCOVER_DESTINATIONS_URL, {
      absolute: true,
    });
  } catch {
    return DESTINATION_FALLBACK;
  }
};
