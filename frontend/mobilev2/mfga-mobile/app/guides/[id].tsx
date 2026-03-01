import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Star } from 'lucide-react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackText } from '@/components/common/FeedbackText';
import { LoadingState } from '@/components/common/LoadingState';
import { Toast } from '@/components/common/Toast';
import { GuideCommentsList } from '@/components/guides/GuideCommentsList';
import { MessageComposer } from '@/components/guides/MessageComposer';
import { RatingStars } from '@/components/guides/RatingStars';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchGuideComments,
  fetchGuideDetail,
  getGuideProfileContent,
  resolveGuideByName,
  sendGuideMessage,
  submitGuideComment,
  submitGuideRating,
} from '@/services/guides';
import type { GuideComment, GuideDetail } from '@/types';

export default function GuideProfileScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [comments, setComments] = useState<GuideComment[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const targetName = typeof name === 'string' ? name : '';

  const loadGuide = useCallback(async () => {
    try {
      setFeedback(null);
      let detail: GuideDetail;
      if (targetName) {
        detail = await resolveGuideByName(targetName);
      } else {
        detail = await fetchGuideDetail(Number(id));
      }
      setGuide(detail);
      const guideComments = await fetchGuideComments(detail.GuideId);
      setComments(guideComments);
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not load guide profile.');
    } finally {
      setLoading(false);
    }
  }, [id, targetName]);

  useEffect(() => {
    loadGuide();
  }, [loadGuide]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const profileContent = useMemo(() => {
    const resolvedName = guide?.Name || targetName;
    return resolvedName ? getGuideProfileContent(resolvedName) : null;
  }, [guide?.Name, targetName]);

  const handleRating = async (value: number) => {
    if (!guide || !token) {
      setFeedback('You must be logged in to rate this guide.');
      return;
    }

    try {
      setRatingLoading(true);
      const summary = await submitGuideRating(token, guide.GuideId, value);
      setSelectedRating(value);
      setGuide({ ...guide, ratingAverage: summary.ratingAverage, ratingCount: summary.ratingCount });
      setFeedback('Rating saved.');
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not save the rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleComment = async () => {
    if (!guide || !token) {
      setFeedback('You must be logged in to comment.');
      return;
    }
    if (!commentText.trim()) {
      setFeedback('Write a comment before sending.');
      return;
    }

    try {
      setCommentLoading(true);
      await submitGuideComment(token, guide.GuideId, commentText.trim());
      setCommentText('');
      setComments(await fetchGuideComments(guide.GuideId));
      setToast('Comment sent');
      setFeedback(null);
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not send the comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!guide || !token) {
      setFeedback('You must be logged in to send messages.');
      return;
    }
    if (!messageText.trim()) {
      setFeedback('Write a message before sending.');
      return;
    }

    try {
      setMessageLoading(true);
      await sendGuideMessage(token, guide.GuideId, messageText.trim());
      setMessageText('');
      setToast('Mensaje Enviado');
      setFeedback(null);
    } catch (nextError: any) {
      setFeedback(nextError?.message || 'Could not send the message.');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState label="Loading guide profile..." />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <EmptyState title="Guide not found" subtitle={feedback || 'No guide profile available.'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.black} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image
            source={{ uri: guide.AvatarUrl || profileContent?.imageUrl || 'https://static.photos/people/400x400/12' }}
            style={styles.heroImage}
          />
          <Text style={styles.guideName}>{guide.Name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.gray400} />
            <Text style={styles.locationText}>
              {profileContent?.location || 'Argentina'}
            </Text>
          </View>
          <Text style={styles.description}>
            {profileContent?.description || 'Guide description unavailable in backend. Using mobile fallback content for the demo.'}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Star size={18} color={Colors.accentDark} fill={Colors.accent} />
            <Text style={styles.summaryValue}>
              {guide.ratingAverage === null ? '-' : guide.ratingAverage.toFixed(1)}
            </Text>
            <Text style={styles.summaryLabel}>Average rating</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{guide.ratingCount}</Text>
            <Text style={styles.summaryLabel}>Ratings</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this guide</Text>
          <RatingStars value={selectedRating} onChange={handleRating} disabled={ratingLoading} />
          {ratingLoading ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 12 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <GuideCommentsList comments={comments} />
          <TextInput
            multiline
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Share your experience with this guide"
            placeholderTextColor={Colors.gray400}
            style={styles.commentInput}
          />
          <Pressable style={styles.primaryButton} onPress={handleComment} disabled={commentLoading}>
            {commentLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Send comment</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <MessageComposer
            value={messageText}
            onChange={setMessageText}
            onSubmit={handleMessage}
            loading={messageLoading}
          />
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
    marginBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  heroImage: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  guideName: {
    marginTop: 16,
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 24,
    textAlign: 'center',
  },
  locationRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: Colors.gray500,
  },
  description: {
    marginTop: 16,
    color: Colors.gray600,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.gray200,
  },
  summaryValue: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 20,
  },
  summaryLabel: {
    color: Colors.gray500,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 20,
    marginBottom: 14,
  },
  commentInput: {
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
