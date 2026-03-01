import React, { useRef, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { Compass, Headphones, Navigation, Users, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: 'discover',
    title: 'Discover Places',
    subtitle: 'Explore stunning destinations across Argentina',
    icon: Compass,
    color: Colors.primary,
    bgColor: Colors.primaryFaded,
    route: '/discover' as const,
  },
  {
    id: 'guides',
    title: 'Audio Guides',
    subtitle: 'Listen to immersive stories and local insights',
    icon: Headphones,
    color: Colors.accent,
    bgColor: Colors.accentFaded,
    route: '/guides' as const,
  },
  {
    id: 'nearby',
    title: 'Nearby Attractions',
    subtitle: 'Find amazing spots close to your location',
    icon: Navigation,
    color: Colors.primary,
    bgColor: Colors.primaryFaded,
    route: '/nearby' as const,
  },
  {
    id: 'community',
    title: 'Travel Community',
    subtitle: 'Share experiences with fellow travelers',
    icon: Users,
    color: Colors.accent,
    bgColor: Colors.accentFaded,
    route: '/community' as const,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    FEATURES.forEach((_, i) => {
      Animated.timing(cardAnims[i], {
        toValue: 1,
        duration: 500,
        delay: 300 + i * 120,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleCardPress = (route: string, index: number) => {
    const anim = cardAnims[index];
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => {
      router.push(route as any);
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.heroContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
         <Image
          source={require("../../../assets/images/obelisco.webp")}
          style={styles.heroImage}
          contentFit="cover"
          onError={(e) => console.log("HERO IMG ERROR:", e)}
        />
          <LinearGradient
            colors={['transparent', 'rgba(52, 52, 75, 0.76)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>ARGENTINA</Text>
            <Text style={styles.heroTitle}>Where will you{'\n'}explore today?</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>6+</Text>
                <Text style={styles.heroStatLabel}>Regions</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>50+</Text>
                <Text style={styles.heroStatLabel}>Guides</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>1K+</Text>
                <Text style={styles.heroStatLabel}>Places</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <Text style={styles.sectionSubtitle}>Your gateway to Argentina</Text>
        </View>

        <View style={styles.cardsGrid}>
          {FEATURES.map((feature, index) => {
            const IconComp = feature.icon;
            return (
              <Animated.View
                key={feature.id}
                style={[
                  styles.cardWrapper,
                  {
                    opacity: cardAnims[index],
                    transform: [
                      {
                        translateY: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [40, 0],
                        }),
                      },
                      {
                        scale: cardAnims[index].interpolate({
                          inputRange: [0.95, 1],
                          outputRange: [0.97, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(feature.route, index)}
                  testID={`feature-card-${feature.id}`}
                >
                  <View style={[styles.cardIconArea, { backgroundColor: feature.bgColor }]}>
                    <View style={[styles.cardIconCircle, { backgroundColor: feature.color }]}>
                      <IconComp size={24} color={Colors.white} />
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{feature.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>
                      {feature.subtitle}
                    </Text>
                    <View style={styles.cardLink}>
                      <Text style={[styles.cardLinkText, { color: feature.color }]}>
                        Learn more
                      </Text>
                      <ArrowRight size={14} color={feature.color} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
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
    paddingBottom: 20,
  },
  heroContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
    lineHeight: 30,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 16,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatNum: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  cardsGrid: {
    paddingHorizontal: 20,
    gap: 14,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardIconArea: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.black,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    lineHeight: 18,
  },
  cardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  cardLinkText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  bottomSpacer: {
    height: 20,
  },
});
