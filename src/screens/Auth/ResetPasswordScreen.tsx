import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ApiError } from '../../api/client';
import { resetPassword } from '../../api/auth';
import { validateResetPasswordForm } from '../../utils/validation';

interface FormErrors {
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

// Expects to be reached via deep link: bestsolving://reset-password?token=abc123
// React Navigation's linking config should map that to this screen with
// route.params.token populated automatically.
export default function ResetPasswordScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const token: string | undefined = route?.params?.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      setErrors({ general: 'This reset link is invalid or has expired. Please request a new one.' });
      return;
    }

    const fieldErrors = validateResetPasswordForm({ password, confirmPassword });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (error) {
      // Backend throws BadRequestException for an invalid/expired token —
      // surface that clearly so the user knows to request a new link.
      setErrors({ general: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + spacing.xl }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text style={styles.title}>Invalid link</Text>
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
          This reset link is missing or invalid. Please request a new one.
        </Text>
        <Button label="Request new link" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>
    );
  }

  if (success) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Password updated</Text>
        <Text style={[styles.subtitle, { textAlign: 'center' }]}>
          Your password has been reset successfully. You can now log in with your new password.
        </Text>
        <Button label="Go to login" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>Choose a new password for your account.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="New password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

          <Input
            label="Confirm new password"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
          />
          {errors.confirmPassword ? <Text style={styles.fieldError}>{errors.confirmPassword}</Text> : null}

          {errors.general ? <Text style={styles.generalError}>{errors.general}</Text> : null}

          <Button label="Reset password" onPress={handleSubmit} loading={loading} />
        </View>
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
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
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
});
