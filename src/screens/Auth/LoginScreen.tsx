import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { saveTokens } from "../../utils/tokenStorage";
import { useSocket } from "../../api/socket";
import { api, ApiError } from "../../api/client";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const parsed = JSON.parse(error.message);
      return Array.isArray(parsed.message)
        ? parsed.message.join(", ")
        : parsed.message;
    } catch {
      return error.message;
    }
  }
  return "Please try again.";
}

export default function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const theme = useColorScheme();
  const { connect } = useSocket();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexGrow: 1,
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing.xl,
        },
        logo: {
          ...typography.bodyBold,
          color: colors.primary,
          marginBottom: spacing.xxl,
          fontStyle: 'italic',
          fontWeight: 'bold',
        },
        title: {
          ...typography.h1,
          color: colors.onSurface,
        },
        subtitle: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          marginTop: spacing.xs,
        },
        forgot: {
          ...typography.caption,
          color: colors.primary,
          textAlign: "right",
          marginBottom: spacing.lg,
        },
        fieldError: {
          ...typography.caption,
          color: colors.error,
          marginTop: -spacing.sm,
          marginBottom: spacing.sm,
        },
        generalError: {
          ...typography.body,
          color: colors.error,
          marginTop: spacing.xs,
          marginBottom: spacing.sm,
        },
        successText: {
          ...typography.body,
          color: colors.secondary,
          marginTop: spacing.xs,
          marginBottom: spacing.sm,
        },
        dividerRow: {
          flexDirection: "row",
          alignItems: "center",
          marginVertical: spacing.xl,
        },
        divider: {
          flex: 1,
          height: 1,
          backgroundColor: colors.outlineVariant,
        },
        dividerText: {
          ...typography.caption,
          color: colors.onSurfaceVariant,
          marginHorizontal: spacing.sm,
        },
        socialRow: {
          flexDirection: "row",
          gap: spacing.md,
        },
        footerText: {
          ...typography.body,
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginTop: spacing.xxl,
        },
        footerLink: {
          color: colors.primary,
          fontWeight: "700",
        },
      }),
    [colors],
  );

  const handleLogin = async () => {
    const trimmedIdentifier = identifier.trim();

    // Basic presence check before hitting the network
    const fieldErrors: FormErrors = {};
    if (!trimmedIdentifier)
      fieldErrors.identifier = "Please enter your email or phone number.";
    if (!password) fieldErrors.password = "Please enter your password.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const credentials = trimmedIdentifier.includes("@")
      ? { email: trimmedIdentifier, password }
      : { phone: trimmedIdentifier, password };

    try {
      const { accessToken, refreshToken } = await api.post<AuthResponse>(
        "/auth/login",
        credentials,
        {
          skipAuth: true,
        },
      );

      await saveTokens(accessToken, refreshToken);
      await connect();

      setSuccess(true);
      // Brief visible confirmation before navigating away
      setTimeout(() => navigation.navigate("MainTabs"), 400);
    } catch (error) {
      setErrors({ general: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.xxl },
        ]}
      >
        <Text style={[styles.logo, { fontSize: 30, textAlign: "center", marginBottom: spacing.xxl }]}>
          Best Solving
        </Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to continue your repair journey.
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <Input
            label="Email or phone number"
            placeholder="you@example.com"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            icon={
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.onSurfaceVariant}
              />
            }
          />
          {errors.identifier ? (
            <Text style={styles.fieldError}>{errors.identifier}</Text>
          ) : null}

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.onSurfaceVariant}
              />
            }
          />
          {errors.password ? (
            <Text style={styles.fieldError}>{errors.password}</Text>
          ) : null}

          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          {errors.general ? (
            <Text style={styles.generalError}>{errors.general}</Text>
          ) : null}
          {success ? (
            <Text style={styles.successText}>Logged in! Redirecting…</Text>
          ) : null}

          <Button
            label={success ? "Success ✓" : "Log In"}
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.md }}
            disabled={loading || success}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <Button label="  Google" variant="secondary" style={{ flex: 1 }} />
            <Button label="  Apple" variant="secondary" style={{ flex: 1 }} />
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.footerLink}>Register</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
