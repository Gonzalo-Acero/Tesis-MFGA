import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Navigation } from 'lucide-react-native';

import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { AttractionFiltersCard } from '@/components/nearby/AttractionFilters';
import { NearbyMap } from '@/components/nearby/NearbyMap';
import {
  fetchAttractions,
  fetchNearbyAttractions,
  type AttractionFilters,
} from '@/services/attractions';
import type { NearbyAttraction } from '@/types';

export default function NearbyScreen() {
  const insets = useSafeAreaInsets();
  const [locationPermission, setLocationPermission] = useState<'idle' | 'granted' | 'denied'>(
    'idle'
  );
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [filters, setFilters] = useState<AttractionFilters>({
    category: 'all',
    province: 'All Provinces',
    search: '',
    radiusKm: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attractions, setAttractions] = useState<NearbyAttraction[]>([]);

  const sortLabel = useMemo(
    () => (userLocation ? 'Nearest to you' : 'Top rated'),
    [userLocation]
  );

  const loadData = async (currentLocation = userLocation) => {
    try {
      setError(null);
      const nextAttractions = currentLocation
        ? await fetchNearbyAttractions(currentLocation.latitude, currentLocation.longitude, filters)
        : await fetchAttractions(filters);
      setAttractions(
        [...nextAttractions].sort((left, right) => {
          if (currentLocation) {
            return (left.distanceKm || 0) - (right.distanceKm || 0);
          }
          return right.rating - left.rating;
        })
      );
    } catch (nextError: any) {
      setError(nextError?.message || 'Could not load nearby attractions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.province, filters.radiusKm, filters.search]);

  const requestLocation = async () => {
    setLoading(true);
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setLocationPermission('denied');
      setUserLocation(null);
      await loadData(null);
      return;
    }

    setLocationPermission('granted');
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const currentLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setUserLocation(currentLocation);
    await loadData(currentLocation);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          loadData();
        }} />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Nearby Attractions</Text>
          <Text style={styles.subtitle}>
            {locationPermission === 'granted'
              ? 'Showing attractions around your live location.'
              : 'Use your location to sort by distance and unlock nearby results.'}
          </Text>
          <Pressable style={styles.locationButton} onPress={requestLocation}>
            <MapPin size={16} color={Colors.white} />
            <Text style={styles.locationButtonText}>
              {locationPermission === 'granted' ? 'Refresh my location' : 'Use my location'}
            </Text>
          </Pressable>
          {locationPermission === 'denied' ? (
            <Text style={styles.locationHint}>
              Location permission is denied. Results are sorted by rating instead.
            </Text>
          ) : null}
        </View>

        <AttractionFiltersCard filters={filters} onChange={setFilters} />

        {loading ? <LoadingState label="Loading attractions..." /> : null}

        {!loading && attractions.length ? (
          <>
            <NearbyMap attractions={attractions} userLocation={userLocation} />
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Sorted by: {sortLabel}</Text>
              <Text style={styles.resultsSubtitle}>
                {attractions.length} place{attractions.length === 1 ? '' : 's'} found
              </Text>
            </View>

            {attractions.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <Image source={{ uri: place.imageUrl }} style={styles.placeImage} />
                <View style={styles.placeBody}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeProvince}>{place.province}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaText}>{place.category}</Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Navigation size={12} color={Colors.primary} />
                      <Text style={styles.metaText}>
                        {place.distanceKm !== null ? `${place.distanceKm.toFixed(1)} km` : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaText}>{place.rating.toFixed(1)} rating</Text>
                    </View>
                  </View>
                  <Text style={styles.placeDescription} numberOfLines={3}>
                    {place.description}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {!loading && !attractions.length && !error ? (
          <EmptyState
            title="No attractions found"
            subtitle="Try changing category, province, or search filters."
          />
        ) : null}

        {error ? <EmptyState title="Could not load attractions" subtitle={error} /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  subtitle: {
    color: Colors.gray500,
    marginTop: 6,
    lineHeight: 20,
  },
  locationButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
  locationHint: {
    marginTop: 10,
    color: Colors.danger,
    fontSize: 12,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  resultsSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
  },
  placeCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    height: 164,
  },
  placeBody: {
    padding: 16,
  },
  placeName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  placeProvince: {
    color: Colors.gray400,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  placeDescription: {
    marginTop: 12,
    color: Colors.gray600,
    lineHeight: 20,
  },
});
