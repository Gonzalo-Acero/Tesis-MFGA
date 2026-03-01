import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Play, Star, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { audioGuides, audioCategories } from '@/mocks/audioGuides';

export default function GuidesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = audioGuides.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || g.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search audio guides..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
              testID="guides-search"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {audioCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((guide) => (
          <TouchableOpacity
            key={guide.id}
            style={styles.guideCard}
            activeOpacity={0.85}
            onPress={() => router.push(`/audio-player/${guide.id}`)}
            testID={`guide-${guide.id}`}
          >
            <Image source={ guide.image } style={styles.guideImage} />
            <View style={styles.guideBody}>
              <View style={styles.guideCatPill}>
                <Text style={styles.guideCatText}>{guide.category}</Text>
              </View>
              <Text style={styles.guideTitle} numberOfLines={2}>{guide.title}</Text>
              <Text style={styles.guideNarrator}>{guide.narrator}</Text>
              <View style={styles.guideMeta}>
                <View style={styles.guideMetaItem}>
                  <Clock size={12} color={Colors.gray400} />
                  <Text style={styles.guideMetaText}>{guide.duration}</Text>
                </View>
                <View style={styles.guideMetaItem}>
                  <Star size={12} color={Colors.accent} fill={Colors.accent} />
                  <Text style={styles.guideMetaText}>{guide.rating}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => router.push(`/audio-player/${guide.id}`)}
            >
              <Play size={18} color={Colors.white} fill={Colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No guides found</Text>
          </View>
        )}
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
    paddingBottom: 30,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.gray600,
  },
  chipTextActive: {
    color: Colors.black,
  },
  guideCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  guideImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  guideBody: {
    flex: 1,
    marginLeft: 12,
  },
  guideCatPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentFaded,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  guideCatText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accentDark,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  guideNarrator: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  guideMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  guideMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guideMetaText: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500' as const,
  },
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.gray600,
  },
});
