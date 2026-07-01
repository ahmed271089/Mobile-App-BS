import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../../theme';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { clearTokens } from '../../utils/tokenStorage';
import { useSocket } from '../../api/socket';
import { getMe, ApiUser } from '../../api/users';
import { uploadFile } from '../../api/uploads';
import { updateProfile } from '../../api/users';

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { disconnect } = useSocket();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library access is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadFile(asset.uri, asset.mimeType ?? 'image/jpeg', asset.fileName ?? 'avatar.jpg');
      const updated = await updateProfile({ avatarUrl: uploaded.url });
      setUser(updated);
    } catch {
      Alert.alert('Upload failed', 'Could not update profile photo.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const initials = user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() ?? '??';
  const topCategory = user?.expertise?.[0]?.category.name ?? 'Community Member';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('EditProfile', { user })}>
          <Ionicons name="create-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.profileCard}>
        <Pressable onPress={handleChangeAvatar} style={styles.avatarWrap}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            {uploading ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="camera" size={12} color={colors.white} />}
          </View>
        </Pressable>
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Badge label={user?.isVerified ? `Expert · ${topCategory}` : topCategory} variant="info" icon={user?.isVerified ? '🛡️' : undefined} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(user?.reputationPoints ?? 0).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.expertise?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.isVerified ? 'Yes' : 'No'}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Chat & Friends</Text>
      <Pressable style={styles.listRow} onPress={() => navigation.navigate('Chat', { screen: 'Friends' })}>
        <View style={styles.listIcon}><Ionicons name="people-outline" size={18} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>My Friends</Text>
          <Text style={styles.listDesc}>View friends and start conversations</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => navigation.navigate('Chat', { screen: 'FriendRequests' })}>
        <View style={styles.listIcon}><Ionicons name="person-add-outline" size={18} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>Friend Requests</Text>
          <Text style={styles.listDesc}>Accept or decline incoming requests</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => navigation.navigate('Chat', { screen: 'AddFriend' })}>
        <View style={styles.listIcon}><Ionicons name="search-outline" size={18} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>Add Friend</Text>
          <Text style={styles.listDesc}>Search users to connect with</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>

      <Pressable
        style={styles.logoutBtn}
        onPress={async () => {
          await clearTokens();
          disconnect();
          navigation.navigate('Auth', { screen: 'Login' });
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h2, color: colors.textPrimary },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  profileCard: { alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.xl },
  avatarWrap: { position: 'relative', marginBottom: spacing.md },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatarText: { ...typography.h1, color: colors.primary },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: colors.cardBorder },
  statValue: { ...typography.h3, color: colors.textPrimary },
  statLabel: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  listIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  listTitle: { ...typography.bodyBold, color: colors.textPrimary },
  listDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, marginTop: spacing.lg },
  logoutText: { ...typography.bodyBold, color: colors.danger },
});
