import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationsListScreen from '../screens/Chat/ConversationsListScreen';
import ChatThreadScreen from '../screens/Chat/ChatThreadScreen';
import FriendRequestsScreen from '../screens/Chat/FriendRequestsScreen';
import FriendsScreen from '../screens/Chat/FriendsScreen';
import AddFriendScreen from '../screens/Chat/AddFriendScreen';

const Stack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConversationsList" component={ConversationsListScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
      <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="AddFriend" component={AddFriendScreen} />
    </Stack.Navigator>
  );
}
