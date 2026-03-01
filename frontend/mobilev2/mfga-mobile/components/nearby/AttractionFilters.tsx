import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Search } from 'lucide-react-native';

import Colors from '@/constants/colors';
import type { AttractionFilters } from '@/services/attractions';

const CATEGORIES = ['all', 'nature', 'culture', 'food', 'adventure'];
const PROVINCES = [
  'All Provinces',
  'Buenos Aires',
  'Cordoba',
  'Mendoza',
  'Misiones',
  'Jujuy',
  'Salta',
  'Santa Cruz',
  'Rio Negro',
];
const DISTANCES = [5, 10, 25, 50];

export function AttractionFiltersCard({
  filters,
  onChange,
}: {
  filters: AttractionFilters;
  onChange: (next: AttractionFilters) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.searchBar}>
        <Search size={18} color={Colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search attractions..."
          placeholderTextColor={Colors.gray400}
          value={filters.search || ''}
          onChangeText={(search) => onChange({ ...filters, search })}
        />
      </View>

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CATEGORIES.map((category) => {
          const active = (filters.category || 'all') === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange({ ...filters, category })}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {category === 'all' ? 'All' : category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Province</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PROVINCES.map((province) => {
          const active = (filters.province || 'All Provinces') === province;
          return (
            <TouchableOpacity
              key={province}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange({ ...filters, province })}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{province}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Radius</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <TouchableOpacity
          style={[styles.chip, !filters.radiusKm && styles.chipActive]}
          onPress={() => onChange({ ...filters, radiusKm: null })}
        >
          <Text style={[styles.chipText, !filters.radiusKm && styles.chipTextActive]}>Any</Text>
        </TouchableOpacity>
        {DISTANCES.map((distance) => {
          const active = filters.radiusKm === distance;
          return (
            <TouchableOpacity
              key={distance}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange({ ...filters, radiusKm: distance })}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{distance} km</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  searchBar: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.black,
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    color: Colors.gray500,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  row: {
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.gray600,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Colors.white,
  },
});
