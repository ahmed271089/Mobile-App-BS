import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ApiError } from '../../api/client';
import { forgotPassword } from '../../api/auth';
import { validateForgotPasswordForm } from '../../utils/validation';

interface FormErrors {
  email?: string;
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

export default function ForgotPasswordScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const fieldErrors = validateForgotPasswordForm(email);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Backend always returns the same generic message whether or not the
      // email exists, by design — this prevents leaking which emails are registered.
      await forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (error) {
      setErrors({ general: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.successIcon}>
          <Ionicons name="mail-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Check your email</Text>
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
          If an account exists for {email.trim()}, we've sent a link to reset your password. It expires in 1 hour.
        </Text>

        <Button label="Back to login" onPress={() => navigation.navigate('Login')} />

        <Pressable onPress={handleSubmit} disabled={loading} style={{ marginTop: spacing.lg }}>
          <Text style={styles.footerLink}>Didn't get it? Resend</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send you a reset link.
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="Email"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
          />
          {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
          {errors.general ? <Text style={styles.generalError}>{errors.general}</Text> : null}

          <Button label="Send reset link" onPress={handleSubmit} loading={loading} />
        </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Remembered it? <Text style={styles.footerLink}>Log in</Text>
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
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
