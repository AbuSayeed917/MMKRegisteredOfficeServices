import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { formatCurrency } from "@/lib/format";
import type { PaymentStatus } from "@/types/api";

interface PaymentSummaryProps {
  summary: Record<PaymentStatus, { count: number; total: number }>;
}

function SummaryCard({
  icon,
  label,
  amount,
  count,
  color,
}: {
  icon: string;
  label: string;
  amount: number;
  count: number;
  color: string;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBg, { backgroundColor: color + "12" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={18}
          color={color}
        />
      </View>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.countBadge, { backgroundColor: color + "12" }]}>
          <Text style={[styles.countText, { color }]}>{count}</Text>
        </View>
      </View>
    </View>
  );
}

export function PaymentSummary({ summary }: PaymentSummaryProps) {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <SummaryCard
          icon="trending-up"
          label="Successful"
          amount={summary.SUCCEEDED?.total ?? 0}
          count={summary.SUCCEEDED?.count ?? 0}
          color={Colors.success}
        />
        <SummaryCard
          icon="clock-outline"
          label="Pending"
          amount={summary.PENDING?.total ?? 0}
          count={summary.PENDING?.count ?? 0}
          color={Colors.warning}
        />
      </View>
      <View style={styles.row}>
        <SummaryCard
          icon="close-circle-outline"
          label="Failed"
          amount={summary.FAILED?.total ?? 0}
          count={summary.FAILED?.count ?? 0}
          color={Colors.error}
        />
        <SummaryCard
          icon="refresh"
          label="Refunded"
          amount={summary.REFUNDED?.total ?? 0}
          count={summary.REFUNDED?.count ?? 0}
          color={Colors.accent}
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
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  amount: {
    ...Typography.tabular,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  label: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  countText: {
    ...Typography.caption2,
    fontWeight: "700",
  },
});
