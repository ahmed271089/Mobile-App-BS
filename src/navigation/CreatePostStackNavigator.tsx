import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChooseTypeScreen from '../screens/CreatePost/ChooseTypeScreen';
import ProblemDefinitionScreen from '../screens/CreatePost/ProblemDefinitionScreen';
import ShareFinalizeScreen from '../screens/CreatePost/ShareFinalizeScreen';

const Stack = createNativeStackNavigator();

export default function CreatePostStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="ChooseType" component={ChooseTypeScreen} />
      <Stack.Screen name="ProblemDefinition" component={ProblemDefinitionScreen} />
      <Stack.Screen name="ShareFinalize" component={ShareFinalizeScreen} />
    </Stack.Navigator>
  );
}
