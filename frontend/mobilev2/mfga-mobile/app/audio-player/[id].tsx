import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bookmark,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  UserRound,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import {
  getGuideBookmarksStorageKey,
  loadAudioProgress,
  loadNumberSet,
  persistNumberSet,
  saveAudioProgress,
} from '@/lib/audioProgress';
import { useAuth } from '@/hooks/useAuth';
import { getLocalFeaturedGuide, getLocalGuideCatalog } from '@/services/guides';
import type { GuideCatalogItem } from '@/types';

const speeds = [0.75, 1, 1.25, 1.5, 2];

const parseDurationToSeconds = (value: string) => {
  const match = value.match(/(\d+)\s*min/i);
  if (match?.[1]) {
    return Number(match[1]) * 60;
  }
  const clock = value.match(/^(\d+):(\d{2})$/);
  if (clock?.[1] && clock?.[2]) {
    return Number(clock[1]) * 60 + Number(clock[2]);
  }
  return 0;
};

const formatSeconds = (value: number) => {
  const safeValue = Math.max(0, Math.round(value));
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export default function AudioPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const namespace = String(user?.UserId ?? user?.Email ?? 'guest');

  const guide = useMemo(() => {
    const catalog = [...getLocalGuideCatalog(), getLocalFeaturedGuide()];
    return catalog.find((item) => item.id === Number(id)) || null;
  }, [id]);

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadNumberSet(getGuideBookmarksStorageKey(namespace)).then((bookmarkSet) => {
      if (mounted && guide) {
        setBookmarked(bookmarkSet.has(guide.id));
      }
    });
    return () => {
      mounted = false;
    };
  }, [guide, namespace]);

  const toggleBookmark = async () => {
    if (!guide) return;
    const nextBookmarks = await loadNumberSet(getGuideBookmarksStorageKey(namespace));
    if (nextBookmarks.has(guide.id)) {
      nextBookmarks.delete(guide.id);
      setBookmarked(false);
    } else {
      nextBookmarks.add(guide.id);
      setBookmarked(true);
    }
    await persistNumberSet(getGuideBookmarksStorageKey(namespace), nextBookmarks);
  };

  const openProfile = () => {
    if (!guide) return;
    router.push({
      pathname: '/guides/[id]',
      params: {
        id: String(guide.guideId ?? guide.id),
        name: guide.guideName,
        catalogId: String(guide.id),
      },
    });
  };

  if (!guide) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorTitle}>Guide not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return guide.audioUrl ? (
    <RealAudioPlayer
      guide={guide}
      namespace={namespace}
      insetsTop={insets.top}
      bookmarked={bookmarked}
      onToggleBookmark={toggleBookmark}
      onOpenProfile={openProfile}
    />
  ) : (
    <SimulatedAudioPlayer
      guide={guide}
      namespace={namespace}
      insetsTop={insets.top}
      bookmarked={bookmarked}
      onToggleBookmark={toggleBookmark}
      onOpenProfile={openProfile}
    />
  );
}

function RealAudioPlayer({
  guide,
  namespace,
  insetsTop,
  bookmarked,
  onToggleBookmark,
  onOpenProfile,
}: {
  guide: GuideCatalogItem;
  namespace: string;
  insetsTop: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenProfile: () => void;
}) {
  const router = useRouter();
  const [speedIndex, setSpeedIndex] = useState(1);
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const player = useAudioPlayer(guide.audioUrl!, {
    updateInterval: 500,
    downloadFirst: false,
  });
  const status = useAudioPlayerStatus(player);
  const isLoaded = status?.isLoaded;

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    let mounted = true;
    player.loop = false;

    loadAudioProgress(namespace, guide.id).then((record) => {
      if (!mounted) return;
      if (record?.progress && record.progress > 0) {
        player.seekTo(record.progress);
      }
      setRestored(true);
    });

    return () => {
      mounted = false;
    };
  }, [guide.id, namespace, player]);

  useEffect(() => {
    player.setPlaybackRate(speeds[speedIndex]);
  }, [player, speedIndex]);

  useEffect(() => {
    if (!restored || !isLoaded) return;
    setReady(true);
  }, [isLoaded, restored]);

  useEffect(() => {
    if (!ready || !isLoaded) return;
    saveAudioProgress(namespace, {
      guideId: guide.id,
      progress: status.currentTime || 0,
      total: status.duration || parseDurationToSeconds(guide.duration),
      timestamp: Date.now(),
    }).catch(() => undefined);
  }, [guide.duration, guide.id, isLoaded, namespace, ready, status?.currentTime, status?.duration]);

  const duration = status?.duration || parseDurationToSeconds(guide.duration);
  const currentTime = status?.currentTime || 0;
  const progress = duration > 0 ? currentTime / duration : 0;

  const togglePlay = async () => {
    if (!status?.isLoaded) return;
    if (status.playing) {
      player.pause();
    } else {
      await player.play();
    }
  };

  const changeSpeed = () => {
    const nextIndex = (speedIndex + 1) % speeds.length;
    setSpeedIndex(nextIndex);
    player.setPlaybackRate(speeds[nextIndex]);
  };

  const seekBy = (seconds: number) => {
    const target = Math.max(0, Math.min(duration, currentTime + seconds));
    player.seekTo(target);
  };

  return (
    <PlayerShell
      guide={guide}
      insetsTop={insetsTop}
      onBack={() => router.back()}
      onOpenProfile={onOpenProfile}
      onToggleBookmark={onToggleBookmark}
      bookmarked={bookmarked}
      currentTime={currentTime}
      duration={duration}
      progress={progress}
      speed={speeds[speedIndex]}
      onChangeSpeed={changeSpeed}
      controlsDisabled={!status?.isLoaded}
      centerAction={
        <Pressable style={styles.playButton} onPress={togglePlay} disabled={!status?.isLoaded}>
          {!status?.isLoaded ? (
            <ActivityIndicator color={Colors.primaryDark} />
          ) : status.playing ? (
            <Pause size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          ) : (
            <Play size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          )}
        </Pressable>
      }
      onSeekBack={() => seekBy(-15)}
      onSeekForward={() => seekBy(30)}
    />
  );
}

function SimulatedAudioPlayer({
  guide,
  namespace,
  insetsTop,
  bookmarked,
  onToggleBookmark,
  onOpenProfile,
}: {
  guide: GuideCatalogItem;
  namespace: string;
  insetsTop: number;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenProfile: () => void;
}) {
  const router = useRouter();
  const [speedIndex, setSpeedIndex] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const duration = parseDurationToSeconds(guide.duration);

  useEffect(() => {
    let mounted = true;
    loadAudioProgress(namespace, guide.id).then((record) => {
      if (!mounted) return;
      if (record?.progress) {
        setCurrentTime(record.progress);
      }
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, [guide.id, namespace]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setCurrentTime((value) => {
        const nextValue = Math.min(duration, value + speeds[speedIndex]);
        if (nextValue >= duration) {
          setPlaying(false);
        }
        return nextValue;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, playing, speedIndex]);

  useEffect(() => {
    if (!hydrated) return;
    saveAudioProgress(namespace, {
      guideId: guide.id,
      progress: currentTime,
      total: duration,
      timestamp: Date.now(),
    }).catch(() => undefined);
  }, [currentTime, duration, guide.id, hydrated, namespace]);

  const progress = duration > 0 ? currentTime / duration : 0;

  const changeSpeed = () => {
    setSpeedIndex((value) => (value + 1) % speeds.length);
  };

  const seekBy = (seconds: number) => {
    setCurrentTime((value) => Math.max(0, Math.min(duration, value + seconds)));
  };

  return (
    <PlayerShell
      guide={guide}
      insetsTop={insetsTop}
      onBack={() => router.back()}
      onOpenProfile={onOpenProfile}
      onToggleBookmark={onToggleBookmark}
      bookmarked={bookmarked}
      currentTime={currentTime}
      duration={duration}
      progress={progress}
      speed={speeds[speedIndex]}
      onChangeSpeed={changeSpeed}
      centerAction={
        <Pressable style={styles.playButton} onPress={() => setPlaying((value) => !value)}>
          {playing ? (
            <Pause size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          ) : (
            <Play size={32} color={Colors.primaryDark} fill={Colors.primaryDark} />
          )}
        </Pressable>
      }
      onSeekBack={() => seekBy(-15)}
      onSeekForward={() => seekBy(30)}
      helperLabel="Preview mode: this guide follows the same simulated playback fallback used on web when no physical audio file exists."
    />
  );
}

function PlayerShell({
  guide,
  insetsTop,
  onBack,
  onOpenProfile,
  onToggleBookmark,
  bookmarked,
  currentTime,
  duration,
  progress,
  speed,
  onChangeSpeed,
  onSeekBack,
  onSeekForward,
  centerAction,
  controlsDisabled = false,
  helperLabel,
}: {
  guide: GuideCatalogItem;
  insetsTop: number;
  onBack: () => void;
  onOpenProfile: () => void;
  onToggleBookmark: () => void;
  bookmarked: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  speed: number;
  onChangeSpeed: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
  centerAction: React.ReactNode;
  controlsDisabled?: boolean;
  helperLabel?: string;
}) {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.topBar, { paddingTop: insetsTop + 8 }]}>
        <Pressable style={styles.topButton} onPress={onBack}>
          <ArrowLeft size={20} color={Colors.white} />
        </Pressable>
        <Text style={styles.topTitle}>Now Playing</Text>
        <Pressable style={styles.topButton} onPress={onToggleBookmark}>
          <Bookmark
            size={18}
            color={Colors.white}
            fill={bookmarked ? Colors.accent : 'transparent'}
          />
        </Pressable>
      </View>

      <View style={styles.artContainer}>
        <Image source={{ uri: guide.imageUrl }} style={styles.artImage} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.guideTitle}>{guide.title}</Text>
        <Text style={styles.guideSubtitle}>{guide.description}</Text>
        <Pressable style={styles.profileButton} onPress={onOpenProfile}>
          <UserRound size={16} color={Colors.white} />
          <Text style={styles.profileButtonText}>{guide.guideName}</Text>
        </Pressable>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatSeconds(currentTime)}</Text>
          <Text style={styles.timeText}>{formatSeconds(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <Pressable
          style={styles.secondaryControl}
          onPress={onSeekBack}
          disabled={controlsDisabled}
        >
          <SkipBack size={26} color={Colors.white} />
        </Pressable>
        {centerAction}
        <Pressable
          style={styles.secondaryControl}
          onPress={onSeekForward}
          disabled={controlsDisabled}
        >
          <SkipForward size={26} color={Colors.white} />
        </Pressable>
      </View>

      <View style={styles.bottomActions}>
        <Pressable style={styles.speedButton} onPress={onChangeSpeed}>
          <Text style={styles.speedLabel}>{speed}x</Text>
        </Pressable>
        <View style={styles.metaPill}>
          <Text style={styles.metaText}>{guide.location}</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaText}>{guide.duration}</Text>
        </View>
      </View>

      {helperLabel ? <Text style={styles.helperText}>{helperLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
  errorTitle: {
    color: Colors.black,
    fontWeight: '700' as const,
    fontSize: 18,
  },
  errorLink: {
    marginTop: 12,
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  topTitle: {
    color: 'rgba(255,255,255,0.84)',
    fontWeight: '700' as const,
    letterSpacing: 0.4,
  },
  artContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  artImage: {
    width: 280,
    height: 280,
    borderRadius: 28,
  },
  infoSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  guideTitle: {
    color: Colors.white,
    fontWeight: '800' as const,
    fontSize: 26,
    textAlign: 'center',
  },
  guideSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  profileButton: {
    marginTop: 16,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
  progressWrap: {
    marginTop: 32,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.72)',
  },
  controlsRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  secondaryControl: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  playButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
  },
  bottomActions: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  speedButton: {
    minWidth: 70,
    minHeight: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  speedLabel: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
  metaPill: {
    minHeight: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  metaText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  helperText: {
    marginTop: 18,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },
});
