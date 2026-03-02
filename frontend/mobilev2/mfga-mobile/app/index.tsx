import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export default function IndexScreen() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.gray50,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
