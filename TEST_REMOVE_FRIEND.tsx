/**
 * TEST FILE - Pour diagnostiquer le problème du bouton Remove Friend
 *
 * Copiez ce composant dans FriendsScreen pour tester
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { colors, spacing } from '../../theme';
import { removeFriend } from '../../api/chat';

// COMPONENT DE TEST SIMPLE
export function TestRemoveButton({ friendId, friendName }: { friendId: string; friendName: string }) {

  const testRemove = async () => {
    console.log('🔴 TEST: Button clicked!');
    console.log('🔴 Friend ID:', friendId);
    console.log('🔴 Friend Name:', friendName);

    try {
      console.log('🔴 Calling API...');
      const result = await removeFriend(friendId);
      console.log('🔴 API Success:', result);
      Alert.alert('Success', 'Friend removed successfully!');
    } catch (error: any) {
      console.error('🔴 API Error:', error);
      console.error('🔴 Error message:', error.message);
      console.error('🔴 Error status:', error.status);
      Alert.alert('Error', `Failed: ${error.message}`);
    }
  };

  return (
    <Pressable
      onPress={testRemove}
      style={{
        backgroundColor: 'red',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
        🧪 TEST: Remove {friendName}
      </Text>
    </Pressable>
  );
}

// INSTRUCTIONS D'UTILISATION:
// 1. Ouvrez FriendsScreen.tsx
// 2. Importez ce composant en haut:
//    import { TestRemoveButton } from './TEST_REMOVE_FRIEND';
// 3. Ajoutez-le juste avant la FlatList:
//    {friends.length > 0 && (
//      <TestRemoveButton friendId={friends[0].id} friendName={friends[0].name} />
//    )}
// 4. Sauvegardez et testez
// 5. Vérifiez la console pour les logs 🔴
