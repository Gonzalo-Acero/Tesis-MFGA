import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import {
  X,
  User,
  Bookmark,
  Download,
  Globe,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const MENU_ITEMS = [
  { id: 'edit', label: 'Edit Profile', icon: User, color: Colors.primary },
  { id: 'saved', label: 'Saved Places', icon: Bookmark, color: Colors.accent },
  { id: 'downloads', label: 'Downloads', icon: Download, color: Colors.success },
  { id: 'language', label: 'Language', icon: Globe, color: Colors.primaryDark },
  { id: 'settings', label: 'Settings', icon: Settings, color: Colors.gray600 },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} testID="close-profile">
          <X size={20} color={Colors.gray600} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: '../../assets/profile.jpeg' }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>Traveler</Text>
          <Text style={styles.profileEmail}>traveler@mfga.app</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>5</Text>
              <Text style={styles.statLabel}>Guides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                testID={`menu-${item.id}`}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: `${item.color}15` }]}>
                  <IconComp size={18} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={16} color={Colors.gray300} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutBtn} testID="logout-btn">
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MFGA v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 14,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.black,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.gray400,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray400,
    marginTop: 2,
    fontWeight: '500' as const,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.gray200,
  },
  menuSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.black,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.danger,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 20,
  },
});
