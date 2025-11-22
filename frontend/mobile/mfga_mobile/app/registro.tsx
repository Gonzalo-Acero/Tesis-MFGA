import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const envApiBaseUrl = (globalThis as Record<string, unknown>)?.process?.env
  ?.EXPO_PUBLIC_API_URL as string | undefined;

const API_BASE_URL =
  envApiBaseUrl ??
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000");

const RegistroScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Campos incompletos", "Complet\u00e1 nombre, email y contrase\u00f1a.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Contrase\u00f1a", "Las contrase\u00f1as no coinciden.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Email: email,
          PhoneNumber: phoneNumber || null,
          Password: password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "No se pudo registrar el usuario.";
        throw new Error(message);
      }

      await AsyncStorage.setItem("current_user", JSON.stringify(payload));
      Alert.alert("Registro exitoso", "Tu usuario fue creado con \u00e9xito.", [
        {
          text: "Aceptar",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("Fallo al registrar usuario:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo registrar el usuario."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>
        Registr\u00e1 tu usuario para sincronizarlo con la base de datos.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electr\u00f3nico"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Tel\u00e9fono (opcional)"
        placeholderTextColor="#777"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Contrase\u00f1a"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Repetir contrase\u00f1a"
        placeholderTextColor="#777"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarme</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    gap: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  button: {
    backgroundColor: "#2f80ed",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#aaaaaa",
    fontSize: 14,
  },
});
