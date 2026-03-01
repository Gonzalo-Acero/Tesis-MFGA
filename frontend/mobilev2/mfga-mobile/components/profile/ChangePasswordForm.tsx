import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Colors from '@/constants/colors';
import { FeedbackText } from '@/components/common/FeedbackText';

export function ChangePasswordForm({
  loading,
  feedback,
  tone = 'error',
  onSubmit,
}: {
  loading: boolean;
  feedback?: string | null;
  tone?: 'error' | 'success';
  onSubmit: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Change password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Current password"
        placeholderTextColor={Colors.gray400}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="New password"
        placeholderTextColor={Colors.gray400}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirm new password"
        placeholderTextColor={Colors.gray400}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <FeedbackText message={feedback} tone={tone} />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => onSubmit({ currentPassword, newPassword, confirmPassword })}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update password'}</Text>
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
    backgroundColor: Colors.black,
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
