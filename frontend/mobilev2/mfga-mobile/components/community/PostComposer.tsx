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

const categories = ['tips', 'food', 'adventure', 'culture', 'question'];

export function PostComposer({
  category,
  location,
  region,
  message,
  imageUrl,
  loading,
  onCategoryChange,
  onLocationChange,
  onRegionChange,
  onMessageChange,
  onImageUrlChange,
  onSubmit,
}: {
  category: string;
  location: string;
  region: string;
  message: string;
  imageUrl: string;
  loading: boolean;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Share with the community</Text>
      <Text style={styles.subtitle}>Create a persistent post using the backend feed.</Text>

      <View style={styles.chipsRow}>
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[styles.chip, item === category ? styles.chipActive : null]}
            onPress={() => onCategoryChange(item)}
          >
            <Text style={[styles.chipText, item === category ? styles.chipTextActive : null]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={location}
        onChangeText={onLocationChange}
        placeholder="Location"
        placeholderTextColor={Colors.gray400}
        style={styles.input}
      />
      <TextInput
        value={region}
        onChangeText={onRegionChange}
        placeholder="Region"
        placeholderTextColor={Colors.gray400}
        style={styles.input}
      />
      <TextInput
        value={imageUrl}
        onChangeText={onImageUrlChange}
        placeholder="Image URL (optional)"
        placeholderTextColor={Colors.gray400}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        multiline
        value={message}
        onChangeText={onMessageChange}
        placeholder="Share a tip, story, or question"
        placeholderTextColor={Colors.gray400}
        style={styles.textarea}
      />

      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>Publish post</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 22,
    backgroundColor: Colors.white,
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    color: Colors.gray600,
    fontWeight: '700' as const,
    textTransform: 'capitalize',
    fontSize: 12,
  },
  chipTextActive: {
    color: Colors.white,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    color: Colors.black,
    marginBottom: 10,
  },
  textarea: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
