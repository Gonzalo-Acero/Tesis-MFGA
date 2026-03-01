import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Compass, Headphones, Navigation, Users } from 'lucide-react-native';

import Header from '@/components/Header';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

const modules = [
  {
    key: 'discover',
    title: 'Discover Places',
    subtitle: 'Explore destinations with full mobile detail views.',
    route: '/discover',
    icon: Compass,
    color: Colors.primary,
  },
  {
    key: 'guides',
    title: 'Audio Guides',
    subtitle: 'Play immersive guide audio and resume your progress.',
    route: '/guides',
    icon: Headphones,
    color: Colors.accentDark,
  },
  {
    key: 'nearby',
    title: 'Nearby Attractions',
    subtitle: 'Use live location and the same backend used on web.',
    route: '/nearby',
    icon: Navigation,
    color: Colors.primaryDark,
  },
  {
    key: 'community',
    title: 'Travel Community',
    subtitle: 'Post, like, and comment with persistent backend data.',
    route: '/community',
    icon: Users,
    color: Colors.accentDark,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const firstName = user?.Name?.split(' ')[0] || 'Traveler';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image
            source={require('../../../assets/images/obelisco.webp')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>MFGA Mobile</Text>
            <Text style={styles.heroTitle}>Hello, {firstName}</Text>
            <Text style={styles.heroSubtitle}>
              Your mobile demo now runs on the existing backend with authenticated flows.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Core modules</Text>
          <Text style={styles.sectionSubtitle}>
            Open each feature from here or from the bottom tabs.
          </Text>
        </View>

        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Pressable
              key={module.key}
              style={styles.moduleCard}
              onPress={() => router.push(module.route as never)}
            >
              <View style={[styles.iconWrap, { backgroundColor: module.color }]}>
                <Icon size={22} color={Colors.white} />
              </View>
              <View style={styles.moduleBody}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 28,
    overflow: 'hidden',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,46,0.38)',
  },
  heroContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 22,
  },
  heroEyebrow: {
    color: Colors.accent,
    fontWeight: '800' as const,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  heroTitle: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 22,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
  },
  moduleCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleBody: {
    flex: 1,
  },
  moduleTitle: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 17,
  },
  moduleSubtitle: {
    marginTop: 4,
    color: Colors.gray500,
    lineHeight: 18,
  },
});
