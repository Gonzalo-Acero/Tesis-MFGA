import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import type { GuideComment } from '@/types';

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function GuideCommentsList({ comments }: { comments: GuideComment[] }) {
  if (!comments.length) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No comments yet</Text>
        <Text style={styles.emptySubtitle}>Be the first traveler to leave feedback.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {comments.map((comment) => (
        <View
          key={`${comment.GuideCommentId || comment.UserId}-${comment.CreatedAt}`}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.author}>{comment.UserName || 'MFGA Explorer'}</Text>
            <Text style={styles.date}>{formatDate(comment.CreatedAt)}</Text>
          </View>
          <Text style={styles.comment}>{comment.Comment}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  author: {
    color: Colors.black,
    fontWeight: '700' as const,
  },
  date: {
    color: Colors.gray400,
    fontSize: 12,
  },
  comment: {
    color: Colors.gray600,
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 18,
    backgroundColor: Colors.white,
    padding: 16,
  },
  emptyTitle: {
    color: Colors.black,
    fontWeight: '700' as const,
  },
  emptySubtitle: {
    marginTop: 6,
    color: Colors.gray500,
  },
});
