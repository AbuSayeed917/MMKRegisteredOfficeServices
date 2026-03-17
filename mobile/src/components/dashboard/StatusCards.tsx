import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { formatDate } from "@/lib/format";
import type { Subscription, Agreement, Notification } from "@/types/api";

interface StatusCardsProps {
  subscription: Subscription | null;
  agreements: Agreement[];
  notifications: Notification[];
  nextPaymentDate?: string | null;
}

function StatusMetric({
  icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.metricCard,
        pressed && styles.metricPressed,
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: color + "1F" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={16}
          color={color}
        />
      </View>
      <Text style={[styles.metricValue, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Pressable>
  );
}

export function StatusCards({
  subscription,
  agreements,
  notifications,
  nextPaymentDate,
}: StatusCardsProps) {
  const subStatus = subscription?.status ?? "DRAFT";
  const agreementStatus = agreements[0]?.status ?? "PENDING";
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <StatusMetric
          icon="credit-card-check-outline"
          label="Subscription"
          value={subStatus.replace(/_/g, " ")}
          color={statusColor(subStatus)}
          onPress={() => router.push("/(dashboard)/subscription")}
        />
        <StatusMetric
          icon="file-sign"
          label="Agreement"
          value={agreementStatus.replace(/_/g, " ")}
          color={statusColor(agreementStatus)}
          onPress={() => router.push("/(dashboard)/agreement")}
        />
      </View>
      <View style={styles.row}>
        <StatusMetric
          icon="bell-ring-outline"
          label="Notifications"
          value={unreadCount}
          color={unreadCount > 0 ? Colors.accent : Colors.success}
          onPress={() => router.push("/(dashboard)/notifications")}
        />
        <StatusMetric
          icon="calendar-clock"
          label="Next Payment"
          value={nextPaymentDate ? formatDate(nextPaymentDate) : "\u2014"}
          color={Colors.accent}
          onPress={() => router.push("/(dashboard)/subscription")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  metricPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  metricValue: {
    ...Typography.headline,
    textTransform: "capitalize",
  },
  metricLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 2,
  },
});
