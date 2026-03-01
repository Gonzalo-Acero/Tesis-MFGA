import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { FeedbackText } from '@/components/common/FeedbackText';
import { useAuth } from '@/hooks/useAuth';
import { register } from '@/services/auth';

export default function RegisterScreen() {
  const { ready, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tone, setTone] = useState<'error' | 'success'>('error');

  if (ready && isAuthenticated) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  const handleRegister = async () => {
    setFeedback(null);
    setTone('error');

    if (!name.trim()) {
      setFeedback('Name is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setFeedback('Enter a valid email.');
      return;
    }
    if (password.trim().length < 8) {
      setFeedback('Password must contain at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setFeedback('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await register({
        Name: name.trim(),
        Email: email.trim(),
        PhoneNumber: phoneNumber.trim() || null,
        Password: password.trim(),
      });
      setTone('success');
      setFeedback(response.message || 'Registration completed.');
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 900);
    } catch (error: any) {
      setFeedback(error?.message || 'Could not register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.brand}>MFGA</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Register to access nearby attractions, audio guides, and community features.
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={Colors.gray400}
            style={styles.input}
          />
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
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="Phone number"
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
          <TextInput
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            placeholder="Confirm password"
            placeholderTextColor={Colors.gray400}
            style={styles.input}
          />

          <FeedbackText message={feedback} tone={tone} />

          <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Register</Text>
            )}
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.secondaryButtonText}>Back to login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
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
