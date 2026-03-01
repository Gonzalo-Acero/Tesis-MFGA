import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { changePassword } from '@/services/auth';
import { updateUserProfile } from '@/services/users';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser, signOut, token } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [passwordTone, setPasswordTone] = useState<'error' | 'success'>('error');

  if (!user) {
    return null;
  }

  const handleProfileSave = async (payload: {
    Name: string;
    Email: string;
    PhoneNumber?: string | null;
  }) => {
    setProfileFeedback(null);
    if (!payload.Name || !payload.Email) {
      setProfileFeedback('Name and email are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(payload.Email)) {
      setProfileFeedback('Enter a valid email.');
      return;
    }

    try {
      setSavingProfile(true);
      const updatedUser = await updateUserProfile(user.UserId || 0, payload);
      await updateUser(updatedUser);
      setProfileFeedback('Profile updated successfully.');
    } catch (error: any) {
      setProfileFeedback(error?.message || 'Could not update the profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setPasswordFeedback(null);
    setPasswordTone('error');

    if (!payload.currentPassword || !payload.newPassword || !payload.confirmPassword) {
      setPasswordFeedback('Fill in all password fields.');
      return;
    }
    if (payload.newPassword.length < 6) {
      setPasswordFeedback('The new password must contain at least 6 characters.');
      return;
    }
    if (payload.newPassword !== payload.confirmPassword) {
      setPasswordFeedback('Passwords do not match.');
      return;
    }
    if (!token || !user.UserId) {
      setPasswordFeedback('You must sign in again before changing your password.');
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(token, {
        userId: user.UserId,
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      });
      setPasswordTone('success');
      setPasswordFeedback('Password updated successfully.');
    } catch (error: any) {
      setPasswordFeedback(error?.message || 'Could not update the password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable style={styles.closeBtn} onPress={() => router.back()} testID="close-profile">
          <X size={20} color={Colors.gray600} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.Name.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.Name}</Text>
          <Text style={styles.email}>{user.Email}</Text>
        </View>

        <ProfileForm
          user={user}
          loading={savingProfile}
          feedback={profileFeedback}
          onSubmit={handleProfileSave}
        />

        <ChangePasswordForm
          loading={changingPassword}
          feedback={passwordFeedback}
          tone={passwordTone}
          onSubmit={handlePasswordChange}
        />

        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/login');
          }}
        >
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
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
    padding: 20,
    gap: 16,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  email: {
    marginTop: 6,
    color: Colors.gray500,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: '700' as const,
  },
});
