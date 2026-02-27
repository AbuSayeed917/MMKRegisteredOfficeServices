import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";

interface InfoRowProps {
  label: string;
  value: string | undefined | null;
  valueColor?: string;
}

export function InfoRow({ label, value, valueColor }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]} numberOfLines={2}>
        {value ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1.5,
    textAlign: "right",
  },
});
