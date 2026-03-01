import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Navigation,
  CheckCircle,
  Lightbulb,
  ImageIcon,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { destinations } from '@/mocks/destinations';

const { width } = Dimensions.get('window');

export default function DestinationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const destination = destinations.find((d) => d.id === id);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSave = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    setSaved(!saved);
  };

  if (!destination) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Destination not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={destination.image} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(26,26,46,0.4)', 'transparent', 'rgba(26,26,46,0.7)']}
            locations={[0, 0.4, 1]}
            style={styles.heroGradient}
          />
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => router.back()}
              testID="back-btn"
            >
              <ArrowLeft size={20} color={Colors.white} />
            </TouchableOpacity>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <TouchableOpacity style={styles.topBtn} onPress={handleSave}>
                <Heart
                  size={20}
                  color={Colors.white}
                  fill={saved ? Colors.danger : 'transparent'}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle}>{destination.title}</Text>
            <View style={styles.heroLocationRow}>
              <MapPin size={14} color={Colors.accent} />
              <Text style={styles.heroLocation}>{destination.location}</Text>
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.tagsRow}>
            {destination.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionText}>{destination.overview}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <CheckCircle size={18} color={Colors.primary} />
              <Text style={styles.sectionTitleInline}>Highlights</Text>
            </View>
            {destination.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightDot} />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Lightbulb size={18} color={Colors.accent} />
              <Text style={styles.sectionTitleInline}>Tips</Text>
            </View>
            {destination.tips.map((t, i) => (
              <View key={i} style={styles.tipCard}>
                <Text style={styles.tipNumber}>{i + 1}</Text>
                <Text style={styles.tipText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <ImageIcon size={18} color={Colors.gray500} />
              <Text style={styles.sectionTitleInline}>Gallery</Text>
            </View>
            <View style={styles.galleryGrid}>
              {[1].map((i) => (
                <View key={i} style={styles.galleryItem}>
                  <Image
                    source={destination.image}
                    style={styles.galleryImage}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.ctaSave}
              onPress={handleSave}
              testID="save-btn"
            >
              <Heart
                size={18}
                color={saved ? Colors.danger : Colors.primary}
                fill={saved ? Colors.danger : 'transparent'}
              />
              <Text style={[styles.ctaSaveText, saved && { color: Colors.danger }]}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaStart} testID="start-route-btn">
              <Navigation size={18} color={Colors.white} />
              <Text style={styles.ctaStartText}>Start Route</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray600,
    fontWeight: '600' as const,
  },
  errorLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  imageContainer: {
    height: 320,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  heroLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500' as const,
  },
  content: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
    marginBottom: 10,
  },
  sectionTitleInline: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 22,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.accentFaded,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: Colors.accentDark,
    width: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.gray700,
    lineHeight: 19,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryItem: {
    width: (width - 56) / 2,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  ctaSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  ctaSaveText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  ctaStart: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  ctaStartText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
