import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Bookmark, Clock3, MapPin, Star, UserRound } from 'lucide-react-native';

import Colors from '@/constants/colors';
import type { GuideCatalogItem } from '@/types';

export function GuideCard({
  guide,
  bookmarked,
  onPlay,
  onToggleBookmark,
  onOpenProfile,
}: {
  guide: GuideCatalogItem;
  bookmarked: boolean;
  onPlay: () => void;
  onToggleBookmark: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPlay}>
      <Image source={{ uri: guide.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{guide.category}</Text>
          </View>
          <Pressable hitSlop={10} onPress={onToggleBookmark}>
            <Bookmark
              size={18}
              color={bookmarked ? Colors.accentDark : Colors.gray500}
              fill={bookmarked ? Colors.accent : 'transparent'}
            />
          </Pressable>
        </View>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {guide.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={Colors.gray400} />
            <Text style={styles.metaText}>{guide.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock3 size={12} color={Colors.gray400} />
            <Text style={styles.metaText}>{guide.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Star size={12} color={Colors.accentDark} fill={Colors.accentDark} />
            <Text style={styles.metaText}>{guide.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.playButton} onPress={onPlay}>
            <Text style={styles.playButtonText}>Open player</Text>
          </Pressable>
          <Pressable style={styles.profileButton} onPress={onOpenProfile}>
            <UserRound size={14} color={Colors.primaryDark} />
            <Text style={styles.profileButtonText}>Guide profile</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 22,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    borderRadius: 999,
    backgroundColor: Colors.accentFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    color: Colors.accentDark,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  title: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  description: {
    marginTop: 8,
    color: Colors.gray600,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: Colors.gray500,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  playButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
  profileButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  profileButtonText: {
    color: Colors.primaryDark,
    fontWeight: '700' as const,
  },
});
