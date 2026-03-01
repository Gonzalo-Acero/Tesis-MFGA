import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Colors from '@/constants/colors';
import type { NearbyAttraction } from '@/types';

export function NearbyMap({
  attractions,
  userLocation,
}: {
  attractions: NearbyAttraction[];
  userLocation: { latitude: number; longitude: number } | null;
}) {
  const firstAttraction = attractions[0];
  const initialRegion = {
    latitude: userLocation?.latitude || firstAttraction?.lat || -34.6037,
    longitude: userLocation?.longitude || firstAttraction?.lng || -58.3816,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
        {userLocation ? (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            pinColor={Colors.primary}
            title="You are here"
          />
        ) : null}
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            coordinate={{ latitude: attraction.lat, longitude: attraction.lng }}
            title={attraction.name}
            description={attraction.province}
          />
        ))}
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{attractions.length} places on the map</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.primaryFaded,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  overlayText: {
    color: Colors.gray700,
    fontWeight: '600' as const,
    fontSize: 12,
  },
});
