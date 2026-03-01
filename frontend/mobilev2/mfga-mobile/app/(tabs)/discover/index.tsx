import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { destinations, categories } from '@/mocks/destinations';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = destinations.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleDestinationPress = (id: string) => {
    router.push(`/destination/${id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
              testID="discover-search"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                activeCategory === cat && styles.chipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
              testID={`chip-${cat}`}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filtered.map((dest) => (
          <TouchableOpacity
            key={dest.id}
            style={styles.destCard}
            activeOpacity={0.85}
            onPress={() => handleDestinationPress(dest.id)}
            testID={`dest-${dest.id}`}
          >
            <Image source={dest.image} style={styles.destImage} />
            <View style={styles.destBody}>
              <View style={styles.destCatRow}>
                <View style={styles.destCatPill}>
                  <Text style={styles.destCatText}>{dest.category}</Text>
                </View>
              </View>
              <Text style={styles.destTitle}>{dest.title}</Text>
              <View style={styles.destLocationRow}>
                <MapPin size={12} color={Colors.gray400} />
                <Text style={styles.destLocation}>{dest.location}</Text>
              </View>
              <Text style={styles.destDesc} numberOfLines={2}>
                {dest.description}
              </Text>
              <View style={styles.destViewRow}>
                <Text style={styles.destViewText}>View Details</Text>
                <ChevronRight size={14} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No destinations found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.gray600,
  },
  chipTextActive: {
    color: Colors.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: '500' as const,
  },
  destCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  destImage: {
    width: '100%',
    height: 160,
  },
  destBody: {
    padding: 16,
  },
  destCatRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  destCatPill: {
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  destCatText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  destTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
    marginBottom: 4,
  },
  destLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  destLocation: {
    fontSize: 12,
    color: Colors.gray400,
  },
  destDesc: {
    fontSize: 13,
    color: Colors.gray500,
    lineHeight: 19,
  },
  destViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 12,
  },
  destViewText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
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
  emptySubtext: {
    fontSize: 13,
    color: Colors.gray400,
    marginTop: 4,
  },
});
