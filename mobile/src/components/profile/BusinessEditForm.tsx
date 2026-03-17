import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius } from "@/theme/spacing";
import { ActionButton } from "@/components/ui/ActionButton";
import { api } from "@/lib/api";

interface BusinessEditFormProps {
  initialTradingAddress: string;
  initialPhone: string;
  onDone: () => void;
  onSaved: () => void;
}

export function BusinessEditForm({
  initialTradingAddress,
  initialPhone,
  onDone,
  onSaved,
}: BusinessEditFormProps) {
  const [tradingAddress, setTradingAddress] = useState(initialTradingAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/profile", { tradingAddress, phone });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDone();
      onSaved();
    } catch {
      Alert.alert("Error", "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.separator} />
      <TextInput
        label="Trading Address"
        value={tradingAddress}
        onChangeText={setTradingAddress}
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        style={styles.input}
        multiline
        theme={{ roundness: Radius.sm }}
      />
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        style={styles.input}
        keyboardType="phone-pad"
        theme={{ roundness: Radius.sm }}
      />
      <View style={styles.buttonRow}>
        <ActionButton label="Save Changes" onPress={handleSave} loading={saving} />
        <ActionButton label="Cancel" onPress={onDone} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
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
