import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Bookmark, Heart, MapPin, MessageCircle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { communityTimeLabel } from '@/services/community';
import type { CommunityPost } from '@/types';

export function PostCard({
  post,
  onToggleLike,
  onToggleBookmark,
  onOpenComments,
}: {
  post: CommunityPost;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onOpenComments: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.headerBody}>
          <Text style={styles.author}>{post.author}</Text>
          <View style={styles.locationRow}>
            <MapPin size={11} color={Colors.gray400} />
            <Text style={styles.locationText}>
              {post.location} · {post.region}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{communityTimeLabel(post.createdAt)}</Text>
      </View>

      {post.image ? <Image source={{ uri: post.image }} style={styles.image} /> : null}

      <View style={styles.body}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
        <Text style={styles.message}>{post.message}</Text>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onToggleLike}>
            <Heart
              size={18}
              color={post.liked ? Colors.danger : Colors.gray600}
              fill={post.liked ? Colors.danger : 'transparent'}
            />
            <Text style={[styles.actionText, post.liked ? styles.activeText : null]}>
              {post.likeCount}
            </Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={onOpenComments}>
            <MessageCircle size={18} color={Colors.gray600} />
            <Text style={styles.actionText}>{post.commentCount}</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={onToggleBookmark}>
            <Bookmark
              size={18}
              color={post.bookmarked ? Colors.accentDark : Colors.gray600}
              fill={post.bookmarked ? Colors.accent : 'transparent'}
            />
            <Text
              style={[styles.actionText, post.bookmarked ? { color: Colors.accentDark } : null]}
            >
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  headerBody: {
    flex: 1,
  },
  author: {
    color: Colors.black,
    fontWeight: '700' as const,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    color: Colors.gray400,
    fontSize: 12,
  },
  time: {
    color: Colors.gray400,
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 230,
  },
  body: {
    padding: 14,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    color: Colors.primaryDark,
    fontWeight: '700' as const,
    textTransform: 'capitalize',
    fontSize: 12,
  },
  message: {
    marginTop: 12,
    color: Colors.gray600,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: Colors.gray600,
    fontWeight: '600' as const,
  },
  activeText: {
    color: Colors.danger,
  },
});
