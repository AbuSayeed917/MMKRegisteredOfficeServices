import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import type { Subscription, Agreement, Notification } from "@/types/api";

interface StatusCardsProps {
  subscription: Subscription | null;
  agreements: Agreement[];
  notifications: Notification[];
}

function StatusRow({
  icon,
  label,
  statusLabel,
  color,
  onPress,
  badge,
  isFirst,
  isLast,
}: {
  icon: string;
  label: string;
  statusLabel: string;
  color: string;
  onPress: () => void;
  badge?: number;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      {/* Colored icon in rounded rect */}
      <View style={[styles.iconRect, { backgroundColor: color + "1F" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={20}
          color={color}
        />
      </View>

      {/* Label + status */}
      <View style={styles.labelContainer}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text
            style={[styles.statusText, { color: Colors.textSecondary }]}
            numberOfLines={1}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Badge (if any) */}
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {/* Chevron */}
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={Colors.textLight}
      />
    </Pressable>
  );
}

export function StatusCards({
  subscription,
  agreements,
  notifications,
}: StatusCardsProps) {
  const subStatus = subscription?.status ?? "DRAFT";
  const agreementStatus = agreements[0]?.status ?? "PENDING";
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const subColor = statusColor(subStatus);
  const agreeColor = statusColor(agreementStatus);

  return (
    <View style={styles.container}>
      <StatusRow
        icon="credit-card-check-outline"
        label="Subscription"
        statusLabel={subStatus.replace(/_/g, " ")}
        color={subColor}
        onPress={() => router.push("/(dashboard)/subscription")}
        isFirst
      />
      <StatusRow
        icon="file-sign"
        label="Agreement"
        statusLabel={agreementStatus.replace(/_/g, " ")}
        color={agreeColor}
        onPress={() => router.push("/(dashboard)/agreement")}
      />
      <StatusRow
        icon="bell-ring-outline"
        label="Alerts"
        statusLabel={unreadCount > 0 ? `${unreadCount} new` : "All read"}
        color={unreadCount > 0 ? Colors.accent : Colors.success}
        badge={unreadCount}
        onPress={() => router.push("/(dashboard)/notifications")}
        isLast
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    gap: Spacing.md,
  },
  rowFirst: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  rowLast: {
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
    marginLeft: 0,
  },
  rowPressed: {
    backgroundColor: Colors.fill,
  },
  iconRect: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    ...Typography.subheadline,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography.footnote,
    textTransform: "capitalize",
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xs + 2,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
