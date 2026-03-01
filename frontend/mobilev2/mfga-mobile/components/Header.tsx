import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

export default function Header() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleAvatarPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.push('/profile');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <View>
          <Text style={styles.title}>MFGA</Text>
          <Text style={styles.subtitle}>My Fellow Guide Argentina</Text>
        </View>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={handleAvatarPress}
          activeOpacity={0.7}
          testID="profile-avatar"
        >
          <User size={20} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.gray500,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
