import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { formatCurrency } from "@/lib/format";
import type { AdminOverviewResponse } from "@/types/api";

interface MetricsGridProps {
  metrics: AdminOverviewResponse["metrics"];
}

function MetricItem({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  href: string;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(href as never);
      }}
      style={({ pressed }) => [
        styles.metricCard,
        pressed && styles.metricPressed,
      ]}
    >
      <View style={styles.metricTop}>
        <View style={[styles.metricIconBg, { backgroundColor: color + "12" }]}>
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={16}
            color={color}
          />
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Pressable>
  );
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <MetricItem
          icon="account-group"
          label="Total Clients"
          value={metrics.totalClients}
          color={Colors.accent}
          href="/(admin)/clients"
        />
        <MetricItem
          icon="check-circle"
          label="Active"
          value={metrics.activeClients}
          color={Colors.success}
          href="/(admin)/clients"
        />
      </View>
      <View style={styles.row}>
        <MetricItem
          icon="clock-outline"
          label="Pending"
          value={metrics.pendingApprovals}
          color={Colors.warning}
          href="/(admin)/clients"
        />
        <MetricItem
          icon="alert-circle"
          label="Suspended"
          value={metrics.suspendedClients}
          color={Colors.error}
          href="/(admin)/clients"
        />
      </View>
      <View style={styles.row}>
        <MetricItem
          icon="calendar-alert"
          label="Expiring (30d)"
          value={metrics.expiringSubscriptions}
          color={Colors.warning}
          href="/(admin)/clients"
        />
        <MetricItem
          icon="trending-up"
          label="Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          color={Colors.success}
          href="/(admin)/payments"
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
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  metricPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  metricIconBg: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    ...Typography.title3,
    color: Colors.textPrimary,
  },
  metricLabel: {
    ...Typography.caption2,
    color: Colors.textLight,
    marginTop: 1,
  },
});
