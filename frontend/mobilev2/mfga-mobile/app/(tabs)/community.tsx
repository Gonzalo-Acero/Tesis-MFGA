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
import { Coffee, Compass, Home, Mountain, Search } from 'lucide-react-native';

import Header from '@/components/Header';
import { AppBottomNav } from '@/components/navigation/AppBottomNav';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackText } from '@/components/common/FeedbackText';
import { LoadingState } from '@/components/common/LoadingState';
import { Toast } from '@/components/common/Toast';
import { PostCard } from '@/components/community/PostCard';
import { PostComposer } from '@/components/community/PostComposer';
import Colors from '@/constants/colors';
import { COMMUNITY_GROUPS, COMMUNITY_MEETUPS } from '@/data/communityExtras';
import {
  getCommunityBookmarksStorageKey,
  getCommunityGroupsStorageKey,
  getCommunityMeetupsStorageKey,
  loadNumberSet,
  persistNumberSet,
} from '@/lib/audioProgress';
import { useAuth } from '@/hooks/useAuth';
import {
  createCommunityPost,
  fetchCommunityPosts,
  toggleCommunityLike,
} from '@/services/community';
import type { CommunityGroup, CommunityMeetup, CommunityPost } from '@/types';

const communityCategories = ['all', 'tips', 'food', 'adventure', 'culture', 'question'];

const iconMap = {
  compass: Compass,
  coffee: Coffee,
  mountain: Mountain,
  home: Home,
};

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token, user } = useAuth();
  const namespace = String(user?.UserId ?? user?.Email ?? 'guest');

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posting, setPosting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [joinedMeetups, setJoinedMeetups] = useState<Set<number>>(new Set());

  const [composerCategory, setComposerCategory] = useState('tips');
  const [composerLocation, setComposerLocation] = useState('Argentina');
  const [composerRegion, setComposerRegion] = useState('All Regions');
  const [composerImageUrl, setComposerImageUrl] = useState('');
  const [composerMessage, setComposerMessage] = useState('');

  const loadCommunity = useCallback(async () => {
    try {
      setFeedback(null);
      const [nextPosts, nextBookmarks, nextGroups, nextMeetups] = await Promise.all([
        fetchCommunityPosts(token),
        loadNumberSet(getCommunityBookmarksStorageKey(namespace)),
        loadNumberSet(getCommunityGroupsStorageKey(namespace)),
        loadNumberSet(getCommunityMeetupsStorageKey(namespace)),
      ]);
      setBookmarks(nextBookmarks);
      setJoinedGroups(nextGroups);
      setJoinedMeetups(nextMeetups);
      setPosts(
        nextPosts.map((post) => ({
          ...post,
          bookmarked: nextBookmarks.has(post.id),
        }))
      );
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not load community feed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [namespace, token]);

  useEffect(() => {
    loadCommunity();
  }, [loadCommunity]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredPosts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesSearch =
        !searchValue ||
        post.author.toLowerCase().includes(searchValue) ||
        post.location.toLowerCase().includes(searchValue) ||
        post.message.toLowerCase().includes(searchValue);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, posts, search]);

  const toggleBookmark = async (postId: number) => {
    const next = new Set(bookmarks);
    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
    }
    setBookmarks(next);
    await persistNumberSet(getCommunityBookmarksStorageKey(namespace), next);
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, bookmarked: next.has(postId) } : post
      )
    );
  };

  const handleLike = async (postId: number) => {
    if (!token) {
      setFeedback('You must be logged in to like posts.');
      return;
    }
    try {
      const result = await toggleCommunityLike(token, postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? { ...post, liked: result.liked, likeCount: result.likeCount }
            : post
        )
      );
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not update the like.');
    }
  };

  const handleCreatePost = async () => {
    if (!token) {
      setFeedback('You must be logged in to publish.');
      return;
    }
    if (composerMessage.trim().length < 12) {
      setFeedback('The post must contain at least 12 characters.');
      return;
    }

    try {
      setPosting(true);
      const created = await createCommunityPost(token, {
        category: composerCategory,
        location: composerLocation.trim() || 'Argentina',
        region: composerRegion.trim() || 'All Regions',
        message: composerMessage.trim(),
        imageUrl: composerImageUrl.trim() || null,
      });
      setPosts((currentPosts) => [{ ...created, bookmarked: false }, ...currentPosts]);
      setComposerMessage('');
      setComposerImageUrl('');
      setToast('Post published');
      setFeedback(null);
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not publish the post.');
    } finally {
      setPosting(false);
    }
  };

  const toggleLocalSet = async (
    itemId: number,
    currentSet: Set<number>,
    setState: (value: Set<number>) => void,
    storageKey: string,
    successLabel: string
  ) => {
    const next = new Set(currentSet);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    setState(next);
    await persistNumberSet(storageKey, next);
    setToast(successLabel);
  };

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
              loadCommunity();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Travel Community</Text>
          <Text style={styles.heroSubtitle}>
            Share posts, comment on traveler stories, and keep local community extras on-device.
          </Text>
        </View>

        <PostComposer
          category={composerCategory}
          location={composerLocation}
          region={composerRegion}
          imageUrl={composerImageUrl}
          message={composerMessage}
          loading={posting}
          onCategoryChange={setComposerCategory}
          onLocationChange={setComposerLocation}
          onRegionChange={setComposerRegion}
          onImageUrlChange={setComposerImageUrl}
          onMessageChange={setComposerMessage}
          onSubmit={handleCreatePost}
        />

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts by author, place, or text"
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
          {communityCategories.map((category) => (
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

        <SectionHeader
          title="Community feed"
          subtitle={`${filteredPosts.length} post${filteredPosts.length === 1 ? '' : 's'} available`}
        />

        {loading ? <LoadingState label="Loading community..." /> : null}
        {!loading && feedback ? <FeedbackText message={feedback} /> : null}
        {!loading && !filteredPosts.length ? (
          <EmptyState title="No posts found" subtitle="Try another search or category." />
        ) : null}

        {!loading &&
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={() => handleLike(post.id)}
              onToggleBookmark={() => toggleBookmark(post.id)}
              onOpenComments={() => router.push(`/community/${post.id}`)}
            />
          ))}

        <SectionHeader
          title="Local groups"
          subtitle="These follow the same local-only behavior currently present on web."
        />
        {COMMUNITY_GROUPS.map((group) => (
          <CommunityExtraCard
            key={group.id}
            item={group}
            selected={joinedGroups.has(group.id)}
            onToggle={() =>
              toggleLocalSet(
                group.id,
                joinedGroups,
                setJoinedGroups,
                getCommunityGroupsStorageKey(namespace),
                joinedGroups.has(group.id) ? 'Group removed' : 'Group joined'
              )
            }
          />
        ))}

        <SectionHeader title="Meetups" subtitle="Persisted locally per user on the device." />
        {COMMUNITY_MEETUPS.map((meetup) => (
          <MeetupCard
            key={meetup.id}
            meetup={meetup}
            selected={joinedMeetups.has(meetup.id)}
            onToggle={() =>
              toggleLocalSet(
                meetup.id,
                joinedMeetups,
                setJoinedMeetups,
                getCommunityMeetupsStorageKey(namespace),
                joinedMeetups.has(meetup.id) ? 'Meetup removed' : 'Meetup saved'
              )
            }
          />
        ))}
      </ScrollView>
      <AppBottomNav />
      <Toast message={toast} />
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function CommunityExtraCard({
  item,
  selected,
  onToggle,
}: {
  item: CommunityGroup;
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = iconMap[item.icon];
  return (
    <View style={styles.extraCard}>
      <View style={styles.extraIcon}>
        <Icon size={20} color={Colors.primaryDark} />
      </View>
      <View style={styles.extraBody}>
        <Text style={styles.extraTitle}>{item.name}</Text>
        <Text style={styles.extraSubtitle}>{item.description}</Text>
        <Text style={styles.extraMeta}>{item.members} members</Text>
      </View>
      <Pressable
        style={[styles.extraButton, selected ? styles.extraButtonActive : null]}
        onPress={onToggle}
      >
        <Text style={[styles.extraButtonText, selected ? styles.extraButtonTextActive : null]}>
          {selected ? 'Joined' : 'Join'}
        </Text>
      </Pressable>
    </View>
  );
}

function MeetupCard({
  meetup,
  selected,
  onToggle,
}: {
  meetup: CommunityMeetup;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.meetupCard}>
      <View style={styles.datePill}>
        <Text style={styles.dateDay}>{meetup.day}</Text>
        <Text style={styles.dateMonth}>{meetup.month}</Text>
      </View>
      <View style={styles.extraBody}>
        <Text style={styles.extraTitle}>{meetup.title}</Text>
        <Text style={styles.extraSubtitle}>{meetup.location}</Text>
        <Text style={styles.extraMeta}>
          {meetup.summary} · {meetup.attendees} attendees
        </Text>
      </View>
      <Pressable
        style={[styles.extraButton, selected ? styles.extraButtonActive : null]}
        onPress={onToggle}
      >
        <Text style={[styles.extraButtonText, selected ? styles.extraButtonTextActive : null]}>
          {selected ? 'Saved' : 'Save'}
        </Text>
      </Pressable>
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
  heroCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: Colors.primaryDark,
    padding: 20,
  },
  heroTitle: {
    color: Colors.white,
    fontWeight: '800' as const,
    fontSize: 24,
  },
  heroSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 4,
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
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Colors.accent,
  },
  chipText: {
    color: Colors.gray600,
    fontWeight: '700' as const,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Colors.primaryDark,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 20,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
    lineHeight: 18,
  },
  extraCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  meetupCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  extraIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePill: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: Colors.accentFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    color: Colors.accentDark,
    fontWeight: '800' as const,
    fontSize: 18,
  },
  dateMonth: {
    color: Colors.accentDark,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  extraBody: {
    flex: 1,
  },
  extraTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 16,
  },
  extraSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
    lineHeight: 18,
  },
  extraMeta: {
    marginTop: 6,
    color: Colors.gray400,
    lineHeight: 18,
  },
  extraButton: {
    borderRadius: 14,
    minWidth: 76,
    minHeight: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryFaded,
  },
  extraButtonActive: {
    backgroundColor: Colors.primary,
  },
  extraButtonText: {
    color: Colors.primaryDark,
    fontWeight: '700' as const,
  },
  extraButtonTextActive: {
    color: Colors.white,
  },
});
