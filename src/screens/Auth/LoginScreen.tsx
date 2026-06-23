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

export default function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { connect } = useSocket();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const trimmedIdentifier = identifier.trim();
    const credentials = trimmedIdentifier.includes('@')
      ? { email: trimmedIdentifier, password }
      : { phone: trimmedIdentifier, password };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { accessToken, refreshToken } = await response.json();
      await saveTokens(accessToken, refreshToken);
      await connect();

      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error && error.message ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xxl }]}>
        <Text style={styles.logo}>🧠 Best Solving</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue your repair journey.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="Email or phone number"
            placeholder="you@example.com"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />

          <Text style={styles.forgot}>Forgot password?</Text>

          <Button label="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.md }} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <Button label="Google" variant="secondary" style={{ flex: 1 }} />
            <Button label="Apple" variant="secondary" style={{ flex: 1 }} />
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerLink}>Register</Text>
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
  logo: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.xxl,
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
  forgot: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
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
