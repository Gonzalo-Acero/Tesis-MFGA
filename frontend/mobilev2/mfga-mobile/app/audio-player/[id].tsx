import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Star,
  Clock,
  Gauge,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { audioGuides } from '@/mocks/audioGuides';

const { width } = Dimensions.get('window');

export default function AudioPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(0.35);
  const [speed, setSpeed] = useState(1);
  const [downloaded, setDownloaded] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const guide = audioGuides.find((g) => g.id === id);

  useEffect(() => {
    if (isPlaying) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  if (!guide) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Guide not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const durationMinutes = parseInt(guide.duration);
  const currentTime = Math.round(durationMinutes * progress);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={styles.bg}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Now Playing</Text>
        <View style={styles.topBtnPlaceholder} />
      </View>

      <View style={styles.artContainer}>
        <Animated.View style={[styles.artShadow, { transform: [{ scale: pulseAnim }] }]}>
          <Image source={guide.image } style={styles.artImage} />
        </Animated.View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.guideTitle}>{guide.title}</Text>
        <Text style={styles.guideNarrator}>{guide.narrator}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{guide.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Star size={14} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.metaText}>{guide.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.scrubberSection}>
        <View style={styles.scrubberTrack}>
          <View style={[styles.scrubberFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.scrubberThumb, { left: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{currentTime}:00</Text>
          <Text style={styles.timeText}>{durationMinutes}:00</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlSecondary}>
          <SkipBack size={28} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlay}
          testID="play-pause"
        >
          {isPlaying ? (
            <Pause size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          ) : (
            <Play size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlSecondary}>
          <SkipForward size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.extrasRow}>
        <TouchableOpacity style={styles.extraBtn} onPress={cycleSpeed}>
          <Gauge size={18} color="rgba(255,255,255,0.8)" />
          <Text style={styles.extraText}>{speed}x</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.extraBtn}
          onPress={() => setDownloaded(!downloaded)}
        >
          <Download
            size={18}
            color={downloaded ? Colors.accent : 'rgba(255,255,255,0.8)'}
          />
          <Text style={[styles.extraText, downloaded && { color: Colors.accent }]}>
            {downloaded ? 'Downloaded' : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  artContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  artShadow: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  artImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 28,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.white,
    textAlign: 'center',
  },
  guideNarrator: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  scrubberSection: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  scrubberTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  scrubberFill: {
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  scrubberThumb: {
    position: 'absolute',
    top: -5,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 28,
  },
  controlSecondary: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  extrasRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  extraBtn: {
    alignItems: 'center',
    gap: 4,
  },
  extraText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
});
