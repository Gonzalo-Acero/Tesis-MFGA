import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MFGA Mobile v2</Text>
      <Text style={styles.subtitle}>App is running ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#aaa", marginTop: 10 },
});