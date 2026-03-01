import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Navigation, Map, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { nearbyPlaces } from '@/mocks/nearby';

export default function NearbyScreen() {
  const insets = useSafeAreaInsets();
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!locationEnabled ? (
          <View style={styles.permissionCard}>
            <View style={styles.permIconWrap}>
              <Navigation size={32} color={Colors.primary} />
            </View>
            <Text style={styles.permTitle}>Enable Location</Text>
            <Text style={styles.permDesc}>
              We need your location to show nearby attractions and places of interest around you.
            </Text>
            <TouchableOpacity
              style={styles.permBtn}
              onPress={() => setLocationEnabled(true)}
              testID="enable-location"
            >
              <MapPin size={16} color={Colors.white} />
              <Text style={styles.permBtnText}>Use my location</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.mapPlaceholder}>
              <Map size={48} color={Colors.gray300} />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <View style={styles.mapPins}>
                {nearbyPlaces.slice(0, 3).map((place, i) => (
                  <View
                    key={place.id}
                    style={[
                      styles.mapPin,
                      { left: 40 + i * 80, top: 30 + (i % 2) * 50 },
                    ]}
                  >
                    <MapPin size={20} color={Colors.primary} fill={Colors.primaryLight} />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.nearbyHeader}>
              <Text style={styles.nearbyTitle}>Nearby Places</Text>
              <Text style={styles.nearbySubtitle}>
                {nearbyPlaces.length} places found near you
              </Text>
            </View>

            {nearbyPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                activeOpacity={0.85}
                testID={`nearby-${place.id}`}
              >
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <View style={styles.placeBody}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <View style={styles.placeCatRow}>
                    <View style={styles.placeCatPill}>
                      <Text style={styles.placeCatText}>{place.category}</Text>
                    </View>
                  </View>
                  <View style={styles.placeDistRow}>
                    <Navigation size={12} color={Colors.primary} />
                    <Text style={styles.placeDistText}>{place.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
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
  permissionCard: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  permIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.black,
    marginBottom: 8,
  },
  permDesc: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  permBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  mapPlaceholder: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 200,
    backgroundColor: Colors.primaryFaded,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 8,
    fontWeight: '500' as const,
  },
  mapPins: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
  },
  nearbyHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  nearbyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  nearbySubtitle: {
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  placeCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  placeImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  placeBody: {
    flex: 1,
    marginLeft: 12,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  placeCatRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  placeCatPill: {
    backgroundColor: Colors.accentFaded,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  placeCatText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accentDark,
  },
  placeDistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  placeDistText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});
