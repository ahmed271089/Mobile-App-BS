import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; fg: string }> = {
  primary: { bg: colors.primaryMuted, fg: colors.primary },
  success: { bg: colors.successMuted, fg: colors.success },
  warning: { bg: colors.warningMuted, fg: colors.warning },
  danger: { bg: colors.dangerMuted, fg: colors.danger },
  info: { bg: colors.infoMuted, fg: colors.info },
  neutral: { bg: colors.bgElevated, fg: colors.textSecondary },
};

export function Badge({
  label,
  variant = 'neutral',
  icon,
}: {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
}) {
  const style = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      {icon ? <Text style={{ fontSize: 11, marginRight: 4 }}>{icon}</Text> : null}
      <Text style={[styles.label, { color: style.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.tiny,
    textTransform: 'uppercase',
  },
});
