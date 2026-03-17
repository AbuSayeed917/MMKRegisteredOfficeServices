import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius } from "@/theme/spacing";
import { ActionButton } from "@/components/ui/ActionButton";
import { api } from "@/lib/api";

interface PasswordChangeFormProps {
  onDone: () => void;
}

export function PasswordChangeForm({ onDone }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/password/change", { currentPassword, newPassword });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Password changed successfully");
      onDone();
    } catch {
      Alert.alert("Error", "Current password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        label="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        style={styles.input}
        theme={{ roundness: Radius.sm }}
      />
      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        style={styles.input}
        theme={{ roundness: Radius.sm }}
      />
      <TextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        style={styles.input}
        theme={{ roundness: Radius.sm }}
      />
      <View style={styles.buttonRow}>
        <ActionButton label="Save Password" onPress={handleSubmit} loading={loading} />
        <ActionButton label="Cancel" onPress={onDone} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
