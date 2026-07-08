import React, { useMemo } from "react";
import { StyleSheet as RNStyleSheet } from "react-native";
import { View, Text, Pressable, Platform, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useColors, gradients, spacing, typography } from "../theme";

const TAB_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  Home: { icon: "home", label: "Home" },
  Library: { icon: "bookmark", label: "Post Saved" },
  Chat: { icon: "chatbubbles", label: "Chat" },
  Profile: { icon: "person", label: "Profile" },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const styles = useMemo(
    () => ({
      container: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-around" as const,
        backgroundColor: colors.surfaceContainerHigh,
        borderTopWidth: RNStyleSheet.hairlineWidth,
        borderTopColor: colors.outlineVariant,
        paddingTop: 8,
      },
      tabItem: {
        flex: 1,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        paddingVertical: 4,
      },
      tabLabel: {
        fontSize: 10,
        fontWeight: "500" as const,
        marginTop: 2,
        letterSpacing: 0.2,
      },
      activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary,
        marginTop: 3,
      },
      centerButton: {
        flex: 1,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        marginTop: -24,
      },
      centerGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      centerLabel: {
        fontSize: 10,
        fontWeight: "500" as const,
        color: colors.onSurfaceVariant,
        marginTop: 4,
      },
    }),
    [colors],
  );

  const shadowStyles = useMemo(
    () =>
      Platform.select({
        web: {
          boxShadow: `0px 4px 10px ${colors.primary}80`,
        },
        default: {
          shadowColor: colors.primary,
          shadowOpacity: 0.5,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route, index) => {
        if (route.name === "CreateTab") {
          return (
            <Pressable
              key={route.key}
              style={styles.centerButton}
              onPress={() => navigation.navigate("CreatePostStack")}
            >
              {({ pressed }) => (
                <>
                  <LinearGradient
                    colors={gradients.primary}
                    style={[
                      styles.centerGradient,
                      shadowStyles,
                      { transform: [{ scale: pressed ? 0.92 : 1 }] },
                    ]}
                  >
                    <Ionicons name="add" size={28} color={colors.onPrimary} />
                  </LinearGradient>
                  <Text style={styles.centerLabel}>Create</Text>
                </>
              )}
            </Pressable>
          );
        }

        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const iconName = config.icon;

        return (
          <Pressable
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons
              name={
                isFocused
                  ? iconName
                  : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)
              }
              size={22}
              color={isFocused ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.primary : colors.onSurfaceVariant,
                  fontWeight: isFocused ? "600" : "500",
                },
              ]}
            >
              {config.label}
            </Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}
