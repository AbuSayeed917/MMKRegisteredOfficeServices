import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { Avatar } from "@/components/ui/Avatar";
import type { AdminClientItem } from "@/types/api";

interface ClientRowProps {
  client: AdminClientItem;
  onPress: () => void;
}

export function ClientRow({ client, onPress }: ClientRowProps) {
  const status = client.subscriptionStatus ?? "PENDING";
  const color = statusColor(status);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Avatar name={client.companyName} email={client.email} size={44} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {client.companyName ?? client.email}
        </Text>
        <Text style={styles.secondary} numberOfLines={1}>
          {client.crn ? `CRN: ${client.crn}` : client.email}
        </Text>
      </View>
      <View style={[styles.statusPill, { backgroundColor: color + "15" }]}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <Text style={[styles.statusText, { color }]}>
          {status.replace(/_/g, " ").toLowerCase()}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={Colors.textLight}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  pressed: {
    backgroundColor: Colors.fill,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  secondary: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography.caption2,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
