import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkeletonCard, SkeletonMetric } from "@/components/ui/SkeletonLoader";
import { formatCurrency, formatDate } from "@/lib/format";

export default function AdminOverviewScreen() {
  const { data, isLoading, refetch, isRefetching } = useAdminOverview();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.adminBadge}>
            <MaterialCommunityIcons name="shield-crown" size={13} color={Colors.accent} />
            <Text style={styles.adminBadgeText}>Admin Panel</Text>
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>
            {isLoading ? "Loading..." : `${data?.metrics?.totalClients ?? 0} total clients`}
          </Text>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <>
              <View style={styles.skeletonRow}>
                <SkeletonMetric />
                <SkeletonMetric />
              </View>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : !data ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>Error loading dashboard data</Text>
            </View>
          ) : (
            <>
              <MetricsGrid metrics={data.metrics} />

              {/* Recent Registrations */}
              <View style={styles.section}>
                <SectionHeader
                  title="Recent Registrations"
                  actionLabel="View all"
                  onAction={() => router.push("/(admin)/clients")}
                />
                <View style={styles.card}>
                  {data.recentRegistrations.length === 0 ? (
                    <View style={styles.emptyList}>
                      <Text style={styles.emptyText}>No recent registrations</Text>
                    </View>
                  ) : (
                    data.recentRegistrations.slice(0, 5).map((c, i) => (
                      <Pressable
                        key={c.id}
                        style={({ pressed }) => [
                          styles.listRow,
                          pressed && styles.listRowPressed,
                          i < Math.min(4, data.recentRegistrations.length - 1) && styles.rowSeparator,
                        ]}
                        onPress={() => router.push(`/(admin)/clients/${c.id}`)}
                      >
                        <Avatar name={c.companyName} email={c.email} size={40} />
                        <View style={styles.listInfo}>
                          <Text style={styles.listName} numberOfLines={1}>
                            {c.companyName ?? c.email}
                          </Text>
                          <Text style={styles.listDate}>{formatDate(c.createdAt)}</Text>
                        </View>
                        {c.subscriptionStatus && (
                          <View style={[styles.statusPill, { backgroundColor: statusColor(c.subscriptionStatus) + "15" }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusColor(c.subscriptionStatus) }]} />
                            <Text style={[styles.statusLabel, { color: statusColor(c.subscriptionStatus) }]}>
                              {c.subscriptionStatus.replace(/_/g, " ").toLowerCase()}
                            </Text>
                          </View>
                        )}
                        <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textLight} />
                      </Pressable>
                    ))
                  )}
                </View>
              </View>

              {/* Recent Payments */}
              <View style={styles.section}>
                <SectionHeader
                  title="Recent Payments"
                  actionLabel="View all"
                  onAction={() => router.push("/(admin)/payments")}
                />
                <View style={styles.card}>
                  {data.recentPayments.length === 0 ? (
                    <View style={styles.emptyList}>
                      <Text style={styles.emptyText}>No recent payments</Text>
                    </View>
                  ) : (
                    data.recentPayments.slice(0, 5).map((p, i) => (
                      <View
                        key={p.id}
                        style={[
                          styles.listRow,
                          i < Math.min(4, data.recentPayments.length - 1) && styles.rowSeparator,
                        ]}
                      >
                        <View style={styles.paymentIcon}>
                          <MaterialCommunityIcons name="cash" size={18} color={Colors.success} />
                        </View>
                        <View style={styles.listInfo}>
                          <Text style={styles.listName} numberOfLines={1}>
                            {p.companyName ?? p.email}
                          </Text>
                          <Text style={styles.listDate}>{formatDate(p.paidAt ?? p.createdAt)}</Text>
                        </View>
                        <Text style={styles.paymentAmount}>{formatCurrency(p.amount)}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bgPrimary,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accent + "12",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: "flex-start",
    marginBottom: Spacing.xs,
  },
  adminBadgeText: {
    ...Typography.caption2,
    color: Colors.accent,
    fontWeight: "600",
  },
  headerTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  headerSub: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  rowSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  listRowPressed: {
    backgroundColor: Colors.fill,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  listDate: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.success + "12",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentAmount: {
    ...Typography.headline,
    color: Colors.success,
  },
  emptyList: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  emptyText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  errorCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    ...Shadows.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
