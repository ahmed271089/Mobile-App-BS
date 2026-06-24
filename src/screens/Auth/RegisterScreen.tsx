import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { saveTokens } from '../../utils/tokenStorage';
import { useSocket } from '../../api/socket';
import { api, ApiError } from '../../api/client';
import { validateRegisterForm } from '../../utils/validation';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface FormErrors {
  name?: string;
  identifier?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const parsed = JSON.parse(error.message);
      return Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message;
    } catch {
      return error.message;
    }
  }
  return 'Please try again.';
}

export default function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { connect } = useSocket();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleRegister = async () => {
    const fieldErrors = validateRegisterForm({ name, identifier, password, confirmPassword });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const trimmedIdentifier = identifier.trim();
    const payload = {
      name: name.trim(),
      password,
      ...(trimmedIdentifier.includes('@') ? { email: trimmedIdentifier } : { phone: trimmedIdentifier }),
    };

    try {
      const { accessToken, refreshToken } = await api.post<AuthResponse>('/auth/register', payload, {
        skipAuth: true,
      });

      await saveTokens(accessToken, refreshToken);
      await connect();

      navigation.navigate('MainTabs');
    } catch (error) {
      setErrors({ general: extractErrorMessage(error) });
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
          {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

          <Input
            label="Email or phone number"
            placeholder="john@example.com"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />
          {errors.identifier ? <Text style={styles.fieldError}>{errors.identifier}</Text> : null}

          <Input
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

          <Input
            label="Confirm password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          {errors.confirmPassword ? <Text style={styles.fieldError}>{errors.confirmPassword}</Text> : null}

          {errors.general ? <Text style={styles.generalError}>{errors.general}</Text> : null}

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
  fieldError: {
    ...typography.caption,
    color: '#DC2626',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  generalError: {
    ...typography.body,
    color: '#DC2626',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
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
