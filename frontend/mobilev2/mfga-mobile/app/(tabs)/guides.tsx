import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';

import Header from '@/components/Header';
import { AppBottomNav } from '@/components/navigation/AppBottomNav';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { ContinueListeningCard } from '@/components/guides/ContinueListeningCard';
import { FeaturedGuideCard } from '@/components/guides/FeaturedGuideCard';
import { GuideCard } from '@/components/guides/GuideCard';
import Colors from '@/constants/colors';
import {
  getGuideBookmarksStorageKey,
  loadAudioProgress,
  loadLastGuideId,
  loadNumberSet,
  persistNumberSet,
} from '@/lib/audioProgress';
import { useAuth } from '@/hooks/useAuth';
import { attachGuideIdsToCatalog, guideCategories } from '@/services/guides';
import type { AudioProgressRecord } from '@/lib/audioProgress';
import type { GuideCatalogItem } from '@/types';

const parseDurationToSeconds = (value: string) => {
  const match = value.match(/(\d+)\s*min/i);
  if (match?.[1]) {
    return Number(match[1]) * 60;
  }
  const clock = value.match(/^(\d+):(\d{2})$/);
  if (clock?.[1] && clock?.[2]) {
    return Number(clock[1]) * 60 + Number(clock[2]);
  }
  return 0;
};

const formatSeconds = (value: number) => {
  const safeValue = Math.max(0, Math.round(value));
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export default function GuidesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const namespace = String(user?.UserId ?? user?.Email ?? 'guest');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [catalog, setCatalog] = useState<GuideCatalogItem[]>([]);
  const [featured, setFeatured] = useState<GuideCatalogItem | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [progressMap, setProgressMap] = useState<Record<number, AudioProgressRecord>>({});
  const [lastGuideId, setLastGuideId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    try {
      setError(null);
      const [{ catalog: nextCatalog, featured: nextFeatured }, bookmarkSet, storedLastGuideId] =
        await Promise.all([
          attachGuideIdsToCatalog(),
          loadNumberSet(getGuideBookmarksStorageKey(namespace)),
          loadLastGuideId(namespace),
        ]);

      const allGuides = [...nextCatalog, nextFeatured];
      const progressEntries = await Promise.all(
        allGuides.map(async (guide) => {
          const progress = await loadAudioProgress(namespace, guide.id);
          return [guide.id, progress] as const;
        })
      );

      setCatalog(nextCatalog);
      setFeatured(nextFeatured);
      setBookmarks(bookmarkSet);
      setLastGuideId(storedLastGuideId);
      setProgressMap(
        progressEntries.reduce<Record<number, AudioProgressRecord>>((accumulator, [id, progress]) => {
          if (progress) {
            accumulator[id] = progress;
          }
          return accumulator;
        }, {})
      );
    } catch (nextError: any) {
      setError(nextError?.message || 'Could not load audio guides.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [namespace]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredGuides = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return catalog.filter((guide) => {
      const matchesCategory = activeCategory === 'All' || guide.category === activeCategory;
      const matchesSearch =
        !searchValue ||
        guide.title.toLowerCase().includes(searchValue) ||
        guide.guideName.toLowerCase().includes(searchValue) ||
        guide.location.toLowerCase().includes(searchValue) ||
        guide.description.toLowerCase().includes(searchValue);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, catalog, search]);

  const continueGuide = useMemo(() => {
    if (!lastGuideId) return null;
    const match = [...catalog, ...(featured ? [featured] : [])].find((guide) => guide.id === lastGuideId);
    if (!match) return null;
    const progress = progressMap[lastGuideId];
    if (!progress?.progress || progress.progress <= 0) return null;
    return { guide: match, progress };
  }, [catalog, featured, lastGuideId, progressMap]);

  const toggleBookmark = async (guideId: number) => {
    const next = new Set(bookmarks);
    if (next.has(guideId)) {
      next.delete(guideId);
    } else {
      next.add(guideId);
    }
    setBookmarks(next);
    await persistNumberSet(getGuideBookmarksStorageKey(namespace), next);
  };

  const openGuideProfile = (guide: GuideCatalogItem) => {
    const routeId = String(guide.guideId ?? guide.id);
    router.push({
      pathname: '/guides/[id]',
      params: {
        id: routeId,
        backendId: guide.guideId ? String(guide.guideId) : '',
        name: guide.guideName,
        catalogId: String(guide.id),
      },
    });
  };

  const openPlayer = (guide: GuideCatalogItem) => {
    router.push(`/audio-player/${guide.id}`);
  };

  const continueRemainingLabel = continueGuide
    ? formatSeconds(
        Math.max(
          0,
          (continueGuide.progress.total || parseDurationToSeconds(continueGuide.guide.duration)) -
            continueGuide.progress.progress
        )
      ) + ' remaining'
    : '';

  const continueCompletion = continueGuide
    ? ((continueGuide.progress.progress || 0) /
        Math.max(
          continueGuide.progress.total || parseDurationToSeconds(continueGuide.guide.duration),
          1
        )) *
      100
    : 0;

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
              hydrate();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {featured ? (
          <FeaturedGuideCard
            guide={featured}
            onPlay={() => openPlayer(featured)}
            onOpenProfile={() => openGuideProfile(featured)}
          />
        ) : null}

        {continueGuide ? (
          <ContinueListeningCard
            guide={continueGuide.guide}
            remainingLabel={continueRemainingLabel}
            completion={continueCompletion}
            onResume={() => openPlayer(continueGuide.guide)}
          />
        ) : null}

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by guide, title, or location"
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {guideCategories.map((category) => (
            <Pressable
              key={category}
              style={[styles.chip, activeCategory === category ? styles.chipActive : null]}
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
            {filteredGuides.length} audio guide{filteredGuides.length === 1 ? '' : 's'}
          </Text>
          <Text style={styles.resultsSubtitle}>
            Includes mobile playback, progress persistence, and guide profiles.
          </Text>
        </View>

        {loading ? <LoadingState label="Loading guides..." /> : null}
        {!loading && error ? <EmptyState title="Could not load guides" subtitle={error} /> : null}
        {!loading && !error && filteredGuides.length === 0 ? (
          <EmptyState title="No guides found" subtitle="Try another category or search term." />
        ) : null}

        {!loading &&
          !error &&
          filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              bookmarked={bookmarks.has(guide.id)}
              onPlay={() => openPlayer(guide)}
              onToggleBookmark={() => toggleBookmark(guide.id)}
              onOpenProfile={() => openGuideProfile(guide)}
            />
          ))}
      </ScrollView>
      <AppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: Colors.white,
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
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.accent,
  },
  chipText: {
    color: Colors.gray600,
    fontWeight: '700' as const,
  },
  chipTextActive: {
    color: Colors.primaryDark,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 16,
  },
  resultsSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
    lineHeight: 18,
  },
});
