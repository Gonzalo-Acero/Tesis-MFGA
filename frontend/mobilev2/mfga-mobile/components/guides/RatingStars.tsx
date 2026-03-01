import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

import Colors from '@/constants/colors';

export function RatingStars({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <Pressable
          key={starValue}
          disabled={disabled}
          onPress={() => onChange(starValue)}
          hitSlop={8}
        >
          <Star
            size={24}
            color={starValue <= value ? Colors.accentDark : Colors.gray300}
            fill={starValue <= value ? Colors.accent : 'transparent'}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
