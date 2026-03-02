import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/common/LoadingState';

export default function TabLayout() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.gray50 }}>
        <LoadingState label="Loading session..." />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}
