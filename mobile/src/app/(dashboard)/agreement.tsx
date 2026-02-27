import { ScrollView, View, Text, StyleSheet, RefreshControl, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { formatDate } from "@/lib/format";

export default function AgreementScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const insets = useSafeAreaInsets();

  const agreement = data?.agreements?.[0];

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
        {/* Large Title Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.largeTitle}>Agreement</Text>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : !agreement ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="file-document-outline" size={48} color={Colors.textLight} />
              </View>
              <Text style={styles.emptyTitle}>No Agreement</Text>
              <Text style={styles.emptyMessage}>You don't have an agreement on file yet.</Text>
            </View>
          ) : (
            <>
              {/* Status Card */}
              <View style={styles.card}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusIconBg}>
                    <MaterialCommunityIcons
                      name={agreement.status === "SIGNED" ? "file-check" : "file-clock"}
                      size={24}
                      color={statusColor(agreement.status === "SIGNED" ? "ACTIVE" : "PENDING")}
                    />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={styles.statusTitle}>Service Agreement</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusColor(agreement.status === "SIGNED" ? "ACTIVE" : "PENDING") + "18" }]}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor(agreement.status === "SIGNED" ? "ACTIVE" : "PENDING") }]} />
                      <Text style={[styles.statusLabel, { color: statusColor(agreement.status === "SIGNED" ? "ACTIVE" : "PENDING") }]}>
                        {agreement.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Agreement Details */}
              <Text style={styles.sectionTitle}>DETAILS</Text>
              <View style={styles.card}>
                <View style={styles.groupedRow}>
                  <Text style={styles.groupedLabel}>Date Signed</Text>
                  <Text style={styles.groupedValue}>{formatDate(agreement.signedAt) || "—"}</Text>
                </View>
                <View style={styles.groupedSeparator} />
                <View style={styles.groupedRow}>
                  <Text style={styles.groupedLabel}>Signature</Text>
                  <Text style={styles.groupedValue}>
                    {agreement.signatureType === "drawn" ? "Hand-drawn" : "Typed"}
                  </Text>
                </View>
                {agreement.templateVersion && (
                  <>
                    <View style={styles.groupedSeparator} />
                    <View style={styles.groupedRow}>
                      <Text style={styles.groupedLabel}>Version</Text>
                      <Text style={styles.groupedValue}>v{agreement.templateVersion}</Text>
                    </View>
                  </>
                )}
              </View>

              {/* What's Covered */}
              <Text style={styles.sectionTitle}>WHAT'S COVERED</Text>
              <View style={styles.card}>
                {[
                  { icon: "office-building-marker", text: "Registered office address for your company", color: Colors.accent },
                  { icon: "email-fast-outline", text: "Mail forwarding within 2 working days", color: Colors.success },
                  { icon: "currency-gbp", text: "Annual subscription at £75/year", color: Colors.warning },
                  { icon: "check-decagram", text: "Compliant with Companies House requirements", color: Colors.accent },
                ].map((item, i, arr) => (
                  <View key={i}>
                    <View style={styles.coveredRow}>
                      <View style={[styles.coveredIcon, { backgroundColor: item.color + "14" }]}>
                        <MaterialCommunityIcons
                          name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={18}
                          color={item.color}
                        />
                      </View>
                      <Text style={styles.coveredText}>{item.text}</Text>
                    </View>
                    {i < arr.length - 1 && <View style={styles.groupedSeparator} />}
                  </View>
                ))}
              </View>

              {/* View Full Agreement */}
              <Text style={styles.sectionTitle}>DOCUMENT</Text>
              <Pressable
                onPress={() => router.push("/(dashboard)/agreement-view")}
                style={({ pressed }) => [
                  styles.card,
                  styles.viewAgreementRow,
                  pressed && styles.viewAgreementPressed,
                ]}
              >
                <View style={styles.viewAgreementLeft}>
                  <View style={[styles.coveredIcon, { backgroundColor: Colors.accent + "14" }]}>
                    <MaterialCommunityIcons
                      name="file-eye-outline"
                      size={18}
                      color={Colors.accent}
                    />
                  </View>
                  <Text style={styles.viewAgreementLabel}>View Full Agreement</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={Colors.textLight}
                />
              </Pressable>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
  },
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: Spacing["6xl"],
    gap: Spacing.sm,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.fill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  statusIconBg: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.fill,
    alignItems: "center",
    justifyContent: "center",
  },
  statusInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  statusTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 6,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    ...Typography.captionBold,
    textTransform: "capitalize",
  },
  sectionTitle: {
    ...Typography.footnote,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  groupedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 10,
  },
  groupedLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  groupedValue: {
    ...Typography.body,
    color: Colors.textLight,
  },
  groupedSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
  coveredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    minHeight: 44,
    paddingVertical: 10,
  },
  coveredIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  coveredText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  viewAgreementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
  },
  viewAgreementPressed: {
    backgroundColor: Colors.fill,
  },
  viewAgreementLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  viewAgreementLabel: {
    ...Typography.body,
    color: Colors.accent,
  },
});
