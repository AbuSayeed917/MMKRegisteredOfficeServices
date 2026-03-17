import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import {
  isBiometricAvailable,
  isBiometricEnabled,
  setBiometricEnabled,
  getBiometricType,
  authenticateWithBiometric,
} from "@/lib/biometric";

export function BiometricToggle() {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [type, setType] = useState("Biometric");
  const [toggling, setToggling] = useState(false);

  const loadState = useCallback(async () => {
    const hw = await isBiometricAvailable();
    setAvailable(hw);
    if (hw) {
      setType(await getBiometricType());
      setEnabled(await isBiometricEnabled());
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleToggle = async (value: boolean) => {
    setToggling(true);
    try {
      if (value) {
        const authenticated = await authenticateWithBiometric();
        if (!authenticated) {
          setToggling(false);
          return;
        }
        await setBiometricEnabled(true);
        setEnabled(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await setBiometricEnabled(false);
        setEnabled(false);
      }
    } catch {
      Alert.alert("Error", "Could not update biometric settings");
    } finally {
      setToggling(false);
    }
  };

  if (!available) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>AUTHENTICATION</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.info}>
            <MaterialCommunityIcons
              name={type === "Face ID" ? "face-recognition" : "fingerprint"}
              size={22}
              color={Colors.accent}
            />
            <Text style={styles.label}>{type}</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            disabled={toggling}
            trackColor={{ false: Colors.fill, true: Colors.success }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.fill}
          />
        </View>
        <Text style={styles.hint}>
          Use {type} to quickly sign in to your account.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.footnote,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: 10,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  label: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  hint: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
});
