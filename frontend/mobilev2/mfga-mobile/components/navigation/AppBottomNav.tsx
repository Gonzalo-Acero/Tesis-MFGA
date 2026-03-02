import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Compass, Headphones, Home, MapPin, Users } from "lucide-react-native";

import Colors from "@/constants/colors";

type NavItem = {
  key: "home" | "discover" | "guides" | "nearby" | "community";
  label: string;
  route: "/" | "/discover" | "/guides" | "/nearby" | "/community";
  icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", route: "/", icon: Home },
  { key: "discover", label: "Discover", route: "/discover", icon: Compass },
  { key: "guides", label: "Guides", route: "/guides", icon: Headphones },
  { key: "nearby", label: "Nearby", route: "/nearby", icon: MapPin },
  { key: "community", label: "Community", route: "/community", icon: Users },
];

export function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.route;

        return (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() => router.replace(item.route)}
          >
            <Icon size={20} color={isActive ? Colors.primary : Colors.gray400} />
            <Text style={[styles.label, isActive ? styles.labelActive : null]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 52,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.gray400,
  },
  labelActive: {
    color: Colors.primary,
  },
});
