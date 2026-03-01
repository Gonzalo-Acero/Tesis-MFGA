import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock3,
  MapPinned,
  Mountain,
  Wallet,
} from 'lucide-react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import Colors from '@/constants/colors';
import { fetchDestinations } from '@/services/content';
import type { Destination } from '@/types';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchDestinations()
      .then((response) => {
        if (!mounted) return;
        setDestinations(response);
      })
      .catch((nextError: any) => {
        if (!mounted) return;
        setError(nextError?.message || 'Could not load this destination.');
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const destination = useMemo(
    () => destinations.find((item) => item.id === id),
    [destinations, id]
  );

  const openMap = async () => {
    if (!destination?.mapEmbedUrl) return;
    await Linking.openURL(destination.mapEmbedUrl);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState label="Loading destination..." />
      </View>
    );
  }

  if (error || !destination) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <EmptyState
          title="Destination not found"
          subtitle={error || 'This destination could not be loaded.'}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <Image source={{ uri: destination.heroImage }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.62)']}
            style={styles.heroGradient}
          />

          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color={Colors.white} />
            </Pressable>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{destination.tag}</Text>
            </View>
            <Text style={styles.heroTitle}>{destination.name}</Text>
            <Text style={styles.heroLocation}>
              {destination.city}, {destination.province}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{destination.description}</Text>

          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoCard}>
              <Clock3 size={18} color={Colors.primaryDark} />
              <Text style={styles.quickInfoLabel}>Ideal stay</Text>
              <Text style={styles.quickInfoValue}>{destination.duration}</Text>
            </View>
            <View style={styles.quickInfoCard}>
              <Mountain size={18} color={Colors.primaryDark} />
              <Text style={styles.quickInfoLabel}>Best time</Text>
              <Text style={styles.quickInfoValue}>{destination.bestTimeToVisit}</Text>
            </View>
            <View style={styles.quickInfoCard}>
              <Wallet size={18} color={Colors.primaryDark} />
              <Text style={styles.quickInfoLabel}>Budget</Text>
              <Text style={styles.quickInfoValue}>{destination.estimatedBudget}</Text>
            </View>
            <Pressable style={styles.quickInfoCard} onPress={openMap}>
              <MapPinned size={18} color={Colors.primaryDark} />
              <Text style={styles.quickInfoLabel}>Map</Text>
              <Text style={styles.quickInfoValue}>Open route</Text>
            </Pressable>
          </View>

          <Section title="Highlights">
            {destination.highlights.map((highlight) => (
              <View key={highlight} style={styles.listRow}>
                <View style={styles.dot} />
                <Text style={styles.listText}>{highlight}</Text>
              </View>
            ))}
          </Section>

          <Section title="Audio Guides">
            {destination.audioGuides.map((guide) => (
              <View key={guide.title} style={styles.audioCard}>
                <Text style={styles.audioTitle}>{guide.title}</Text>
                <Text style={styles.audioSubtitle}>Available as a destination audio track</Text>
              </View>
            ))}
          </Section>

          <Section title="Gallery">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.galleryRow}>
                {destination.gallery.map((imageUrl) => (
                  <Image
                    key={imageUrl}
                    source={{ uri: imageUrl }}
                    style={styles.galleryImage}
                  />
                ))}
              </View>
            </ScrollView>
          </Section>

          <Section title="Travel Tips">
            {destination.tips.map((tip, index) => (
              <View key={tip} style={styles.tipCard}>
                <Text style={styles.tipIndex}>{index + 1}</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Section>

          <Pressable style={styles.mapButton} onPress={openMap}>
            <MapPinned size={18} color={Colors.white} />
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
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
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
  },
  heroWrapper: {
    height: 360,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
  },
  heroTag: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(246,213,74,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroTagText: {
    color: Colors.accent,
    fontWeight: '800' as const,
    fontSize: 12,
  },
  heroTitle: {
    marginTop: 14,
    color: Colors.white,
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  heroLocation: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
  },
  content: {
    marginTop: -22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  description: {
    color: Colors.gray600,
    lineHeight: 22,
    fontSize: 15,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  quickInfoCard: {
    width: '47%',
    borderRadius: 18,
    backgroundColor: Colors.white,
    padding: 14,
  },
  quickInfoLabel: {
    color: Colors.gray400,
    marginTop: 10,
    fontSize: 12,
  },
  quickInfoValue: {
    color: Colors.black,
    marginTop: 4,
    fontWeight: '700' as const,
    lineHeight: 18,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: '800' as const,
    marginBottom: 14,
  },
  listRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  listText: {
    flex: 1,
    color: Colors.gray600,
    lineHeight: 20,
  },
  audioCard: {
    borderRadius: 16,
    backgroundColor: Colors.white,
    padding: 14,
    marginBottom: 10,
  },
  audioTitle: {
    color: Colors.black,
    fontWeight: '700' as const,
  },
  audioSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
    lineHeight: 18,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  galleryImage: {
    width: 220,
    height: 150,
    borderRadius: 18,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  tipIndex: {
    width: 24,
    color: Colors.primaryDark,
    fontWeight: '800' as const,
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    color: Colors.gray600,
    lineHeight: 20,
  },
  mapButton: {
    marginTop: 28,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  mapButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
    fontSize: 15,
  },
});
