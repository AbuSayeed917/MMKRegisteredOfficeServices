import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useAdminClientDetail } from "@/hooks/useAdminClientDetail";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdminActionButtons } from "@/components/admin/AdminActionButtons";
import { PaymentList } from "@/components/dashboard/PaymentList";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { formatDate, timeAgo } from "@/lib/format";

function DetailRow({ icon, label, value }: { icon: string; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={16} color={Colors.accent} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, refetch, isRefetching } = useAdminClientDetail(id);
  const insets = useSafeAreaInsets();

  const sub = data?.subscription;
  const business = data?.business;
  const user = data?.user;
  const subStatus = sub?.status ?? "PENDING";

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
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.accent} />
            <Text style={styles.backText}>Clients</Text>
          </Pressable>

          {!isLoading && (
            <View style={styles.headerContent}>
              <Avatar name={business?.companyName} email={user?.email} size={60} />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName} numberOfLines={2}>
                  {business?.companyName ?? user?.email ?? "Client"}
                </Text>
                <Text style={styles.headerEmail}>{user?.email}</Text>
                <View style={styles.headerBadges}>
                  <View style={[styles.headerPill, { backgroundColor: statusColor(subStatus) + "15" }]}>
                    <View style={[styles.headerDot, { backgroundColor: statusColor(subStatus) }]} />
                    <Text style={[styles.headerPillText, { color: statusColor(subStatus) }]}>
                      {subStatus.replace(/_/g, " ")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.headerPill,
                      { backgroundColor: (user?.isActive ? Colors.success : Colors.error) + "15" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.headerPillText,
                        { color: user?.isActive ? Colors.success : Colors.error },
                      ]}
                    >
                      {user?.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : !data ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>Client not found</Text>
            </View>
          ) : (
            <>
              {/* Quick Actions */}
              {sub && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIconBg, { backgroundColor: Colors.warning + "12" }]}>
                      <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.warning} />
                    </View>
                    <Text style={styles.sectionLabel}>Quick Actions</Text>
                  </View>
                  <AdminActionButtons clientId={id} status={sub.status} />
                </View>
              )}

              {/* Business Details */}
              {business && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIconBg, { backgroundColor: Colors.accent + "12" }]}>
                      <MaterialCommunityIcons name="domain" size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.sectionLabel}>Business Details</Text>
                  </View>
                  <DetailRow icon="office-building" label="Company" value={business.companyName} />
                  <DetailRow icon="identifier" label="CRN" value={business.crn} />
                  <DetailRow icon="briefcase-outline" label="Type" value={business.companyType} />
                  <DetailRow icon="calendar" label="Incorporated" value={formatDate(business.incorporationDate)} />
                  <DetailRow icon="office-building-marker" label="Registered" value={business.registeredAddress} />
                  <DetailRow icon="map-marker-outline" label="Trading" value={business.tradingAddress} />
                  <DetailRow icon="phone-outline" label="Phone" value={business.phone} />
                </View>
              )}

              {/* Subscription */}
              {sub && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIconBg, { backgroundColor: Colors.accent + "12" }]}>
                      <MaterialCommunityIcons name="credit-card-check-outline" size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.sectionLabel}>Subscription</Text>
                  </View>
                  <View style={styles.subGrid}>
                    {[
                      { label: "Status", value: sub.status.replace(/_/g, " "), color: statusColor(sub.status) },
                      { label: "Start", value: formatDate(sub.startDate) || "\u2014" },
                      { label: "End", value: formatDate(sub.endDate) || "\u2014" },
                      { label: "Payment", value: sub.paymentMethod?.replace(/_/g, " ") || "\u2014" },
                    ].map((item, i) => (
                      <View key={i} style={styles.subItem}>
                        <Text style={styles.subItemLabel}>{item.label}</Text>
                        <Text style={[styles.subItemValue, item.color ? { color: item.color } : null]}>
                          {item.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Directors */}
              {business && business.directors.length > 0 && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIconBg, { backgroundColor: Colors.accent + "12" }]}>
                      <MaterialCommunityIcons name="account-group-outline" size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.sectionLabel}>Directors</Text>
                  </View>
                  {business.directors.map((d, i) => (
                    <View
                      key={d.id}
                      style={[
                        styles.directorRow,
                        i < business.directors.length - 1 && styles.directorRowSeparator,
                      ]}
                    >
                      <Avatar name={d.fullName} size={36} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.directorName}>{d.fullName}</Text>
                        <Text style={styles.directorMeta}>
                          {d.position}
                          {d.dateOfBirth ? ` \u00b7 DOB: ${formatDate(d.dateOfBirth)}` : ""}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Payment History */}
              <View style={styles.section}>
                <SectionHeader title="Payment History" />
                <View style={styles.sectionCard}>
                  <PaymentList payments={data.payments} />
                </View>
              </View>

              {/* Audit Log */}
              {data.adminActions.length > 0 && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionTitle}>
                    <View style={[styles.sectionIconBg, { backgroundColor: Colors.accent + "12" }]}>
                      <MaterialCommunityIcons name="clipboard-text-clock-outline" size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.sectionLabel}>Audit Log</Text>
                  </View>
                  {data.adminActions.map((a, i) => (
                    <View key={a.id} style={styles.logRow}>
                      <View style={styles.logTimeline}>
                        <View style={styles.logDot} />
                        {i < data.adminActions.length - 1 && <View style={styles.logLine} />}
                      </View>
                      <View style={styles.logContent}>
                        <Text style={styles.logAction}>{a.actionType.replace(/_/g, " ")}</Text>
                        {a.reason && <Text style={styles.logReason}>{a.reason}</Text>}
                        <Text style={styles.logMeta}>
                          {a.adminEmail ? `${a.adminEmail} \u00b7 ` : ""}
                          {timeAgo(a.createdAt)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
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
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  backText: {
    ...Typography.body,
    color: Colors.accent,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  headerEmail: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 2,
  },
  headerBadges: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: "wrap",
  },
  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 5,
  },
  headerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  headerPillText: {
    ...Typography.captionBold,
    textTransform: "capitalize",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.fill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption2,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  subGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  subItem: {
    width: "48%",
    backgroundColor: Colors.fill,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  subItemLabel: {
    ...Typography.caption2,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subItemValue: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginTop: 2,
    textTransform: "capitalize",
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  directorRowSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  directorName: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  directorMeta: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 1,
  },
  logRow: {
    flexDirection: "row",
    gap: Spacing.md,
    minHeight: 50,
  },
  logTimeline: {
    alignItems: "center",
    width: 16,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
  logLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.separator,
    marginTop: 4,
  },
  logContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  logAction: {
    ...Typography.headline,
    color: Colors.textPrimary,
    textTransform: "capitalize",
  },
  logReason: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logMeta: {
    ...Typography.caption2,
    color: Colors.textLight,
    marginTop: Spacing.xs,
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
