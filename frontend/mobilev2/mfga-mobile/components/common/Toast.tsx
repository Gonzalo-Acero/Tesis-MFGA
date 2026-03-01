import React from 'react';
import { Text, View } from 'react-native';

import Colors from '@/constants/colors';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 24,
        backgroundColor: Colors.black,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        zIndex: 50,
      }}
    >
      <Text style={{ color: Colors.white, textAlign: 'center', fontWeight: '600' as const }}>
        {message}
      </Text>
    </View>
  );
}
