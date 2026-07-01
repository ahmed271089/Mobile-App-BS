import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { searchUsers } from '../../api/users';
import { sendFriendRequest } from '../../api/chat';

export default function AddFriendScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; name: string; avatarUrl: string | null; reputationPoints: number; isVerified: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchUsers(query.trim())
        .then(setResults)
        .catch(console.warn)
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      setSent((prev) => new Set(prev).add(userId));
      Alert.alert('Sent!', 'Friend request sent successfully.');
    } catch {
      Alert.alert('Error', 'Could not send friend request.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + spacing.lg }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Add Friend</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <Input placeholder="Search by name or email…" value={query} onChangeText={setQuery} autoFocus icon={<Ionicons name="search" size={16} color={colors.textMuted} />} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}
          ListEmptyComponent={<Text style={styles.empty}>{query ? 'No users found.' : 'Search for someone to add.'}</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.reputationPoints.toLocaleString()} reputation</Text>
              </View>
              <Button label={sent.has(item.id) ? 'Sent' : 'Add'} disabled={sent.has(item.id)} onPress={() => handleSend(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h2, color: colors.textPrimary },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary },
});
