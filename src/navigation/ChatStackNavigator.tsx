import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationsListScreen from '../screens/Chat/ConversationsListScreen';
import ChatThreadScreen from '../screens/Chat/ChatThreadScreen';

const Stack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConversationsList" component={ConversationsListScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
    </Stack.Navigator>
  );
}
