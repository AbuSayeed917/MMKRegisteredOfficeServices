import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Payment } from "@/types/api";

interface PaymentListProps {
  payments: Payment[];
}

const statusIcon: Record<
  string,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }
> = {
  SUCCEEDED: { icon: "check-circle", color: Colors.success },
  FAILED: { icon: "close-circle", color: Colors.error },
  PENDING: { icon: "clock-outline", color: Colors.warning },
  REFUNDED: { icon: "refresh", color: Colors.info },
};

export function PaymentList({ payments }: PaymentListProps) {
  if (payments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="receipt-text-outline"
          size={36}
          color={Colors.textLight}
        />
        <Text style={styles.emptyText}>No payments yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {payments.map((p, index) => {
        const config = statusIcon[p.status] ?? {
          icon: "help-circle-outline" as const,
          color: Colors.textLight,
        };
        const isLast = index === payments.length - 1;
        const color = statusColor(p.status);

        return (
          <View
            key={p.id}
            style={[styles.row, !isLast && styles.rowBorder]}
          >
            {/* Status icon */}
            <View
              style={[styles.iconRect, { backgroundColor: config.color + "1F" }]}
            >
              <MaterialCommunityIcons
                name={config.icon}
                size={18}
                color={config.color}
              />
            </View>

            {/* Description + date */}
            <View style={styles.info}>
              <Text style={styles.description} numberOfLines={1}>
                {p.paymentMethod ?? "Payment"}
              </Text>
              <Text style={styles.date}>
                {formatDate(p.paidAt ?? p.createdAt)}
              </Text>
            </View>

            {/* Amount + status */}
            <View style={styles.trailing}>
              <Text style={styles.amount}>{formatCurrency(p.amount)}</Text>
              <Text style={[styles.status, { color }]}>
                {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    ...Shadows.sm,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  iconRect: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  description: {
    ...Typography.subheadline,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  date: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 2,
  },
  trailing: {
    alignItems: "flex-end",
  },
  amount: {
    ...Typography.subheadline,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  status: {
    ...Typography.caption2,
    fontWeight: "500",
    marginTop: 2,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
});
