import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { FeedbackText } from '@/components/common/FeedbackText';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/services/auth';

export default function LoginScreen() {
  const { ready, isAuthenticated, setAuthenticatedSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async () => {
    setError(null);
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Enter a valid email.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const session = await login({ email: email.trim(), password: password.trim() });
      await setAuthenticatedSession(session);
      router.replace('/(tabs)');
    } catch (nextError: any) {
      setError(nextError?.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.brand}>MFGA</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to explore attractions, guides, and the travel community.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={Colors.gray400}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={Colors.gray400}
          style={styles.input}
        />

        <FeedbackText message={error} />

        <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>Log In</Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>Create an account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    fontSize: 14,
    letterSpacing: 1.4,
    fontWeight: '800' as const,
    color: Colors.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.black,
  },
  subtitle: {
    marginTop: 8,
    color: Colors.gray500,
    lineHeight: 20,
    marginBottom: 24,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryButtonText: {
    color: Colors.primaryDark,
    fontWeight: '600' as const,
  },
});
