import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { api } from '../api/client';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { useSocket } from '../api/socket';

import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import CreatePostStackNavigator from './CreatePostStackNavigator';

import { useColors } from '../theme';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['bestsolving://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: {
            path: 'reset-password',
            parse: {
              token: (token: string) => token,
            },
          },
        },
      },
      MainTabs: 'main',
    },
  },
};

function RootNavigatorContent() {
  const { connect } = useSocket();
  const colors = useColors();
  const [bootstrapping, setBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        await api.get('/users/me');
        await connect();
        setIsAuthenticated(true);
      } catch {
        await clearTokens();
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [connect]);

  const navTheme = React.useMemo(() => ({
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.surface,
      card: colors.surfaceContainer,
      border: colors.outlineVariant,
      primary: colors.primary,
      text: colors.onSurface,
    },
  }), [colors]);

  if (bootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? 'MainTabs' : 'Auth'}>
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="CreatePostStack"
          component={CreatePostStackNavigator}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return <RootNavigatorContent />;
}
