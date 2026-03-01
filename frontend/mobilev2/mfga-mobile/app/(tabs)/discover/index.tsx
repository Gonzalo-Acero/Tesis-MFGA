import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Search } from 'lucide-react-native';

import Header from '@/components/Header';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import Colors from '@/constants/colors';
import { fetchDestinations } from '@/services/content';
import type { Destination } from '@/types';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDestinations = async () => {
    try {
      setError(null);
      const response = await fetchDestinations();
      setDestinations(response);
    } catch (nextError: any) {
      setError(nextError?.message || 'Could not load destinations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const categories = useMemo(() => {
    const values = new Set(destinations.map((destination) => destination.category).filter(Boolean));
    return ['All', ...Array.from(values)];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return destinations.filter((destination) => {
      const matchesSearch =
        !searchValue ||
        destination.name.toLowerCase().includes(searchValue) ||
        destination.city.toLowerCase().includes(searchValue) ||
        destination.province.toLowerCase().includes(searchValue) ||
        destination.description.toLowerCase().includes(searchValue);

      const matchesCategory =
        activeCategory === 'All' || destination.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, destinations, search]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDestinations();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Discover Places</Text>
          <Text style={styles.heroTitle}>Explore Argentina destination by destination</Text>
          <Text style={styles.heroSubtitle}>
            Browse the same travel catalog used on web, adapted to a mobile-first flow.
          </Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by place, city, or province"
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
              testID="discover-search"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.chip,
                activeCategory === category ? styles.chipActive : null,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === category ? styles.chipTextActive : null,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredDestinations.length} destination
            {filteredDestinations.length === 1 ? '' : 's'}
          </Text>
          <Text style={styles.resultsSubtitle}>
            Filter by category, then open the full detail page.
          </Text>
        </View>

        {loading ? <LoadingState label="Loading destinations..." /> : null}

        {!loading && error ? (
          <EmptyState title="Could not load destinations" subtitle={error} />
        ) : null}

        {!loading && !error && filteredDestinations.length === 0 ? (
          <EmptyState
            title="No destinations found"
            subtitle="Try a different search term or category."
          />
        ) : null}

        {!loading &&
          !error &&
          filteredDestinations.map((destination) => (
            <Pressable
              key={destination.id}
              style={styles.destinationCard}
              onPress={() => router.push(`/destination/${destination.id}`)}
            >
              <Image source={{ uri: destination.image }} style={styles.destinationImage} />
              <View style={styles.destinationBody}>
                <View style={styles.destinationMetaRow}>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{destination.category}</Text>
                  </View>
                  <View style={styles.pillMuted}>
                    <Text style={styles.pillMutedText}>{destination.tag}</Text>
                  </View>
                </View>

                <Text style={styles.destinationTitle}>{destination.name}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.gray400} />
                  <Text style={styles.locationText}>
                    {destination.city}, {destination.province}
                  </Text>
                </View>

                <Text style={styles.description} numberOfLines={3}>
                  {destination.description}
                </Text>

                <View style={styles.footerRow}>
                  <View style={styles.footerMetric}>
                    <Text style={styles.footerLabel}>Best time</Text>
                    <Text style={styles.footerValue}>{destination.bestTimeToVisit}</Text>
                  </View>
                  <View style={styles.footerMetric}>
                    <Text style={styles.footerLabel}>Ideal stay</Text>
                    <Text style={styles.footerValue}>{destination.duration}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
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
    paddingBottom: 30,
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: Colors.primaryDark,
    padding: 20,
  },
  heroEyebrow: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 10,
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800' as const,
    lineHeight: 30,
  },
  heroSubtitle: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 20,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.black,
    fontSize: 15,
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.gray600,
    fontWeight: '600' as const,
  },
  chipTextActive: {
    color: Colors.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
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
  destinationCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 190,
  },
  destinationBody: {
    padding: 16,
  },
  destinationMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    borderRadius: 999,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: Colors.primaryDark,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  pillMuted: {
    borderRadius: 999,
    backgroundColor: Colors.accentFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillMutedText: {
    color: Colors.accentDark,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  destinationTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  locationText: {
    color: Colors.gray500,
  },
  description: {
    marginTop: 12,
    color: Colors.gray600,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
  },
  footerMetric: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    padding: 12,
  },
  footerLabel: {
    color: Colors.gray400,
    fontSize: 12,
    marginBottom: 4,
  },
  footerValue: {
    color: Colors.black,
    fontWeight: '700' as const,
    fontSize: 13,
  },
});
