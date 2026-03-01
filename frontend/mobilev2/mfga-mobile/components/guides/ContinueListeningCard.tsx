import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Play } from 'lucide-react-native';

import Colors from '@/constants/colors';
import type { GuideCatalogItem } from '@/types';

export function ContinueListeningCard({
  guide,
  remainingLabel,
  completion,
  onResume,
}: {
  guide: GuideCatalogItem;
  remainingLabel: string;
  completion: number;
  onResume: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Continue listening</Text>
        <Text style={styles.remaining}>{remainingLabel}</Text>
      </View>
      <Text style={styles.title}>{guide.title}</Text>
      <Text style={styles.subtitle}>{guide.guideName}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, completion))}%` }]} />
      </View>
      <Pressable style={styles.button} onPress={onResume}>
        <Play size={16} color={Colors.white} fill={Colors.white} />
        <Text style={styles.buttonText}>Resume</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    color: Colors.primaryDark,
    fontWeight: '800' as const,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  remaining: {
    color: Colors.gray500,
    fontSize: 12,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  subtitle: {
    marginTop: 4,
    color: Colors.gray500,
  },
  track: {
    marginTop: 16,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.gray200,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  button: {
    marginTop: 16,
    borderRadius: 16,
    minHeight: 46,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
