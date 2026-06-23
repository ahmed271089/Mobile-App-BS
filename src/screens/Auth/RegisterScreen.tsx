import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { saveTokens } from '../../utils/tokenStorage';
import { useSocket } from '../../api/socket';

const API_URL = 'http://localhost:3000/api';

export default function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { connect } = useSocket();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !identifier.trim() || !password) {
      Alert.alert('Missing info', 'Please fill in your name, email/phone, and password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please re-enter your password.');
      return;
    }

    setLoading(true);
    const trimmedIdentifier = identifier.trim();
    const payload = {
      name: name.trim(),
      password,
      ...(trimmedIdentifier.includes('@') ? { email: trimmedIdentifier } : { phone: trimmedIdentifier }),
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { accessToken, refreshToken } = await response.json();
      await saveTokens(accessToken, refreshToken);
      await connect();

      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error && error.message ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the community to solve real-world problems.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="Full name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            icon={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
          />
          <Input
            label="Email or phone number"
            placeholder="john@example.com"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />
          <Input
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          <Input
            label="Confirm password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />

          <Button label="Create Account" onPress={handleRegister} loading={loading} />

          <Text style={styles.terms}>
            By creating an account, you agree to our Terms, Privacy Policy and Conduct guidelines.
          </Text>
        </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  terms: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
