import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIconBg, { backgroundColor: color + "12" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={20}
          color={color}
        />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
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
        />
        <MetricItem
          icon="check-circle"
          label="Active"
          value={metrics.activeClients}
          color={Colors.success}
        />
      </View>
      <View style={styles.row}>
        <MetricItem
          icon="clock-outline"
          label="Pending"
          value={metrics.pendingApprovals}
          color={Colors.warning}
        />
        <MetricItem
          icon="alert-circle"
          label="Suspended"
          value={metrics.suspendedClients}
          color={Colors.error}
        />
      </View>
      <View style={styles.row}>
        <MetricItem
          icon="calendar-alert"
          label="Expiring (30d)"
          value={metrics.expiringSubscriptions}
          color={Colors.warning}
        />
        <MetricItem
          icon="trending-up"
          label="Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          color={Colors.success}
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
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  metricValue: {
    ...Typography.tabular,
    color: Colors.textPrimary,
  },
  metricLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 2,
  },
});
