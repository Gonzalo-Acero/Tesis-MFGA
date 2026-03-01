import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackText } from '@/components/common/FeedbackText';
import { LoadingState } from '@/components/common/LoadingState';
import { Toast } from '@/components/common/Toast';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import {
  addCommunityComment,
  communityTimeLabel,
  fetchCommunityComments,
  fetchCommunityPosts,
} from '@/services/community';
import type { CommunityComment, CommunityPost } from '@/types';

export default function CommunityThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const postId = Number(id);

  const loadThread = useCallback(async () => {
    try {
      setFeedback(null);
      const [posts, postComments] = await Promise.all([
        fetchCommunityPosts(token),
        fetchCommunityComments(postId),
      ]);
      setPost(posts.find((item) => item.id === postId) || null);
      setComments(postComments);
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not load this post thread.');
    } finally {
      setLoading(false);
    }
  }, [postId, token]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleComment = async () => {
    if (!token) {
      setFeedback('You must be logged in to comment.');
      return;
    }
    if (!commentText.trim()) {
      setFeedback('Write a comment before sending.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await addCommunityComment(token, postId, commentText.trim());
      setComments((currentComments) => [...currentComments, response.comment]);
      setCommentText('');
      setToast('Comment sent');
      setFeedback(null);
      setPost((currentPost) =>
        currentPost ? { ...currentPost, commentCount: response.commentCount } : currentPost
      );
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not send the comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState label="Loading thread..." />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <EmptyState title="Post not found" subtitle={feedback || 'This thread is unavailable.'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.black} />
          </Pressable>
          <Text style={styles.headerTitle}>Comments</Text>
        </View>

        <View style={styles.postCard}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.time}>{communityTimeLabel(post.createdAt)}</Text>
          <Text style={styles.message}>{post.message}</Text>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>
            {comments.length} comment{comments.length === 1 ? '' : 's'}
          </Text>
          {!comments.length ? (
            <EmptyState title="No comments yet" subtitle="Start the conversation from mobile." />
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.userName}</Text>
                  <Text style={styles.commentTime}>{communityTimeLabel(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.composerCard}>
          <Text style={styles.sectionTitle}>Add a comment</Text>
          <TextInput
            multiline
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Write your comment"
            placeholderTextColor={Colors.gray400}
            style={styles.input}
          />
          <Pressable style={styles.button} onPress={handleComment} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Send comment</Text>
            )}
          </Pressable>
        </View>

        <FeedbackText message={feedback} />
      </ScrollView>
      <Toast message={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 22,
  },
  postCard: {
    borderRadius: 22,
    backgroundColor: Colors.white,
    padding: 18,
  },
  author: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 16,
  },
  time: {
    marginTop: 4,
    color: Colors.gray400,
    fontSize: 12,
  },
  message: {
    marginTop: 12,
    color: Colors.gray600,
    lineHeight: 20,
  },
  commentsSection: {
    marginTop: 18,
  },
  sectionTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 20,
    marginBottom: 12,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: Colors.white,
    padding: 14,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  commentAuthor: {
    color: Colors.black,
    fontWeight: '700' as const,
  },
  commentTime: {
    color: Colors.gray400,
    fontSize: 12,
  },
  commentText: {
    color: Colors.gray600,
    lineHeight: 20,
  },
  composerCard: {
    marginTop: 20,
    borderRadius: 22,
    backgroundColor: Colors.white,
    padding: 16,
  },
  input: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
