import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import Colors from '@/constants/colors';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={{ marginTop: 12, color: Colors.gray500 }}>{label}</Text>
    </View>
  );
}
