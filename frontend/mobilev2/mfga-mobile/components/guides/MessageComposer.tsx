import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Send a direct message</Text>
      <Text style={styles.subtitle}>
        Use the authenticated guide messaging endpoint from mobile.
      </Text>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder="Write your message"
        placeholderTextColor={Colors.gray400}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>Send message</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 16,
  },
  title: {
    color: Colors.black,
    fontWeight: '800' as const,
    fontSize: 18,
  },
  subtitle: {
    marginTop: 6,
    color: Colors.gray500,
    lineHeight: 18,
  },
  input: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700' as const,
  },
});
