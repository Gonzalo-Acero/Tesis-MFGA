import React from 'react';
import { Text } from 'react-native';

import Colors from '@/constants/colors';

export function FeedbackText({
  message,
  tone = 'error',
}: {
  message?: string | null;
  tone?: 'error' | 'success' | 'info';
}) {
  if (!message) return null;

  const color =
    tone === 'success' ? Colors.success : tone === 'info' ? Colors.gray500 : Colors.danger;

  return <Text style={{ color, fontSize: 13, marginTop: 8 }}>{message}</Text>;
}
