import React from 'react';
import { Text, View } from 'react-native';

import Colors from '@/constants/colors';

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.gray600 }}>{title}</Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: 6,
            color: Colors.gray400,
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
