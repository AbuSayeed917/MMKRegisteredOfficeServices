import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/theme/colors";
import { Typography, Spacing } from "@/theme/spacing";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={12}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    ...Typography.title3,
    color: Colors.textPrimary,
  },
  action: {
    ...Typography.subheadline,
    color: Colors.accent,
  },
});
