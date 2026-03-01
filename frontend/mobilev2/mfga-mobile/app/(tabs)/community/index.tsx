import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Bookmark, Plus, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { communityPosts } from '@/mocks/community';
import { CommunityPost } from '@/types';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Travel Feed</Text>
          <Text style={styles.feedSubtitle}>Stories from fellow travelers</Text>
        </View>

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard} testID={`post-${post.id}`}>
            <View style={styles.postHeader}>
              <Image source={post.userAvatar } style={styles.postAvatar} />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{post.userName}</Text>
                <View style={styles.postPlaceRow}>
                  <MapPin size={10} color={Colors.gray400} />
                  <Text style={styles.postPlace}>{post.place}</Text>
                </View>
              </View>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>

            <Image source={post.photo } style={styles.postPhoto} />

            <View style={styles.postActions}>
              <View style={styles.postActionsLeft}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => toggleLike(post.id)}
                >
                  <Heart
                    size={22}
                    color={post.liked ? Colors.danger : Colors.gray600}
                    fill={post.liked ? Colors.danger : 'transparent'}
                  />
                  <Text style={[styles.actionCount, post.liked && styles.actionCountActive]}>
                    {post.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MessageCircle size={22} color={Colors.gray600} />
                  <Text style={styles.actionCount}>{post.comments}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => toggleSave(post.id)}>
                <Bookmark
                  size={22}
                  color={post.saved ? Colors.accent : Colors.gray600}
                  fill={post.saved ? Colors.accent : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.postCaptionWrap}>
              <Text style={styles.postCaption}>
                <Text style={styles.postCaptionName}>{post.userName} </Text>
                {post.caption}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: 20 }]}
        activeOpacity={0.85}
        testID="create-post-fab"
      >
        <Plus size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  feedHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  feedSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  postCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 10,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  postPlaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  postPlace: {
    fontSize: 11,
    color: Colors.gray400,
  },
  postTime: {
    fontSize: 11,
    color: Colors.gray400,
  },
  postPhoto: {
    width: '100%',
    height: 240,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  postActionsLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.gray600,
  },
  actionCountActive: {
    color: Colors.danger,
  },
  postCaptionWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  postCaption: {
    fontSize: 13,
    color: Colors.gray600,
    lineHeight: 19,
  },
  postCaptionName: {
    fontWeight: '700' as const,
    color: Colors.black,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
