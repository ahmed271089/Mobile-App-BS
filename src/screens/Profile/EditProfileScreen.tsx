import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors, spacing, typography } from "../../theme";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { updateProfile, ApiUser } from "../../api/users";

export default function EditProfileScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const initial: ApiUser = route.params?.user ?? {};
  const [name, setName] = useState(initial.name ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [saving, setSaving] = useState(false);

  const styles = React.useMemo(
    () => ({
      header: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: spacing.md,
        marginBottom: spacing.xl,
      },
      backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surfaceContainer,
        alignItems: "center" as const,
        justifyContent: "center" as const,
      },
      title: { ...typography.h2, color: colors.onSurface },
    }),
    [colors],
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your display name.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() || undefined });
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <Input
        label="Display name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />
      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell the community about your expertise…"
        multiline
        numberOfLines={4}
        style={{ minHeight: 100, textAlignVertical: "top" }}
      />
      <Button
        label="Save changes"
        loading={saving}
        onPress={handleSave}
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}
