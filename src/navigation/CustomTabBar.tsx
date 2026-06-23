import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, gradients } from '../theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Library: 'library',
  Chat: 'chatbubbles',
  Profile: 'person',
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route, index) => {
        if (route.name === 'CreateTab') {
          return (
            <Pressable
              key={route.key}
              style={styles.centerButton}
              onPress={() => navigation.navigate('CreatePostStack')}
            >
              <LinearGradient colors={gradients.primary} style={styles.centerGradient}>
                <Ionicons name="add" size={28} color={colors.white} />
              </LinearGradient>
            </Pressable>
          );
        }

        const isFocused = state.index === index;
        const iconName = ICONS[route.name] ?? 'ellipse';

        return (
          <Pressable key={route.key} style={styles.tabItem} onPress={() => navigation.navigate(route.name)}>
            <Ionicons
              name={isFocused ? iconName : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)}
              size={22}
              color={isFocused ? colors.primary : colors.textMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  centerGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
