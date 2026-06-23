import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTabBar';

import HomeStackNavigator from './HomeStackNavigator';
import LibraryScreen from '../screens/Library/LibraryScreen';
import ChatStackNavigator from './ChatStackNavigator';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

// "CreateTab" has no real screen — CustomTabBar intercepts taps on it and
// pushes the CreatePostStack from the root navigator instead.
function CreatePlaceholder() {
  return null;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="CreateTab" component={CreatePlaceholder} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
