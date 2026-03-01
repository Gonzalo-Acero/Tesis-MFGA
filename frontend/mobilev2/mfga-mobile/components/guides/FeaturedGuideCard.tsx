import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Headphones, MapPin, Play, Star } from 'lucide-react-native';

import Colors from '@/constants/colors';
import type { GuideCatalogItem } from '@/types';

export function FeaturedGuideCard({
  guide,
  onPlay,
  onOpenProfile,
}: {
  guide: GuideCatalogItem;
  onPlay: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: guide.imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Headphones size={14} color={Colors.accentDark} />
          <Text style={styles.badgeText}>Featured guide</Text>
        </View>

        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.subtitle}>{guide.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={Colors.white} />
            <Text style={styles.metaText}>{guide.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Star size={12} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.metaText}>{guide.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.primaryButton} onPress={onPlay}>
            <Play size={16} color={Colors.primaryDark} fill={Colors.primaryDark} />
            <Text style={styles.primaryButtonText}>Play now</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onOpenProfile}>
            <Text style={styles.secondaryButtonText}>Guide profile</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,46,0.45)',
  },
  content: {
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: Colors.accentDark,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  title: {
    marginTop: 16,
    color: Colors.white,
    fontSize: 26,
    fontWeight: '800' as const,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.primaryDark,
    fontWeight: '800' as const,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
