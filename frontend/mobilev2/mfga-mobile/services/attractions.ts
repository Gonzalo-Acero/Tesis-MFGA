import { requestJson } from '@/lib/http';
import type { NearbyAttraction } from '@/types';

const normalizeAttraction = (record: any): NearbyAttraction => ({
  id: Number(record.AttractionId ?? record.id),
  name: String(record.Name ?? record.name ?? 'Attraction'),
  description: String(record.Description ?? record.description ?? ''),
  category: String(record.Category ?? record.category ?? 'culture'),
  province: String(record.Province ?? record.province ?? 'Argentina'),
  imageUrl: String(
    record.ImageUrl ??
      record.imageUrl ??
      record.image ??
      'https://static.photos/travel/640x360/999'
  ),
  lat: Number(record.Latitude ?? record.latitude ?? record.lat),
  lng: Number(record.Longitude ?? record.longitude ?? record.lng),
  distanceKm: Number.isFinite(
    Number(record.ComputedDistanceKm ?? record.DistanceKm ?? record.distanceKm)
  )
    ? Number(record.ComputedDistanceKm ?? record.DistanceKm ?? record.distanceKm)
    : null,
  rating: Number(record.Rating ?? record.rating ?? 0),
});

export interface AttractionFilters {
  category?: string;
  province?: string;
  search?: string;
  radiusKm?: number | null;
}

export const fetchAttractions = async (filters: AttractionFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    params.set('category', filters.category);
  }
  if (filters.province && filters.province !== 'All Provinces') {
    params.set('province', filters.province);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  params.set('limit', '300');

  const response = await requestJson<any[]>(`/attractions?${params.toString()}`);
  return response.map(normalizeAttraction);
};

export const fetchNearbyAttractions = async (
  latitude: number,
  longitude: number,
  filters: AttractionFilters = {}
) => {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    limit: '300',
  });

  if (filters.radiusKm) {
    params.set('radiusKm', String(filters.radiusKm));
  }
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    params.set('category', filters.category);
  }
  if (filters.province && filters.province !== 'All Provinces') {
    params.set('province', filters.province);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }

  const response = await requestJson<any[]>(`/attractions/nearby?${params.toString()}`);
  return response.map(normalizeAttraction);
};
