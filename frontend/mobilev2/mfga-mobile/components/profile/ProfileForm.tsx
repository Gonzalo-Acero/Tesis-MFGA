import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Colors from '@/constants/colors';
import { FeedbackText } from '@/components/common/FeedbackText';
import type { SessionUser } from '@/types';

export function ProfileForm({
  user,
  loading,
  feedback,
  onSubmit,
}: {
  user: SessionUser;
  loading: boolean;
  feedback?: string | null;
  onSubmit: (payload: { Name: string; Email: string; PhoneNumber?: string | null }) => void;
}) {
  const [name, setName] = useState(user.Name || '');
  const [email, setEmail] = useState(user.Email || '');
  const [phone, setPhone] = useState(user.PhoneNumber || '');

  useEffect(() => {
    setName(user.Name || '');
    setEmail(user.Email || '');
    setPhone(user.PhoneNumber || '');
  }, [user.Email, user.Name, user.PhoneNumber]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Edit profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor={Colors.gray400}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.gray400}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor={Colors.gray400}
        keyboardType="phone-pad"
        value={phone || ''}
        onChangeText={setPhone}
      />

      <FeedbackText message={feedback} />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() =>
          onSubmit({ Name: name.trim(), Email: email.trim(), PhoneNumber: phone.trim() || null })
        }
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save changes'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.black,
    marginBottom: 14,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    marginBottom: 10,
    color: Colors.black,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
