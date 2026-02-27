import { ScrollView, View, Text, StyleSheet, RefreshControl, Alert } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { api } from "@/lib/api";
import { GradientButton } from "@/components/ui/GradientButton";
import { PaymentList } from "@/components/dashboard/PaymentList";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { formatDate } from "@/lib/format";

export default function SubscriptionScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const [payLoading, setPayLoading] = useState(false);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: insets.top + 60, paddingHorizontal: Spacing.lg }}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  const sub = data?.subscription;
  const payments = data?.payments ?? [];
  const status = sub?.status ?? "DRAFT";
  const isActive = status === "ACTIVE";

  const handlePay = async () => {
    setPayLoading(true);
    try {
      const { data: checkout } = await api.post("/api/stripe/checkout");
      if (checkout.url) {
        await WebBrowser.openBrowserAsync(checkout.url);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        refetch();
      }
    } catch {
      Alert.alert("Error", "Could not start payment. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setPayLoading(false);
    }
  };

  const showPayButton =
    status === "ACTIVE" ||
    status === "RENEWAL_PENDING" ||
    status === "EXPIRED" ||
    status === "PENDING_APPROVAL";

  const daysLeft = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000))
    : null;

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
          <Text style={styles.largeTitle}>Plan</Text>
        </View>

        <View style={styles.content}>
          {/* Current Plan Card */}
          <View style={styles.card}>
            <View style={styles.planHeader}>
              <View style={styles.priceRow}>
                <Text style={styles.currency}>£</Text>
                <Text style={styles.price}>75</Text>
                <Text style={styles.period}>/year</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: statusColor(status) + "18" }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor(status) }]} />
                <Text style={[styles.statusLabel, { color: statusColor(status) }]}>
                  {status.replace(/_/g, " ")}
                </Text>
              </View>
            </View>

            {/* Grouped List Details */}
            <View style={styles.groupedList}>
              <View style={styles.groupedRow}>
                <Text style={styles.groupedLabel}>Start Date</Text>
                <Text style={styles.groupedValue}>{formatDate(sub?.startDate) || "—"}</Text>
              </View>
              <View style={styles.groupedSeparator} />
              <View style={styles.groupedRow}>
                <Text style={styles.groupedLabel}>Renewal</Text>
                <Text style={styles.groupedValue}>{formatDate(sub?.endDate) || "—"}</Text>
              </View>
              <View style={styles.groupedSeparator} />
              <View style={styles.groupedRow}>
                <Text style={styles.groupedLabel}>Payment Method</Text>
                <Text style={styles.groupedValue}>{sub?.paymentMethod?.replace(/_/g, " ") || "—"}</Text>
              </View>
              {daysLeft !== null && (
                <>
                  <View style={styles.groupedSeparator} />
                  <View style={styles.groupedRow}>
                    <Text style={styles.groupedLabel}>Days Remaining</Text>
                    <Text style={[styles.groupedValue, daysLeft < 30 && { color: Colors.warning }]}>
                      {daysLeft} days
                    </Text>
                  </View>
                </>
              )}
            </View>

            {showPayButton && (
              <View style={styles.buttonContainer}>
                <GradientButton
                  label={status === "RENEWAL_PENDING" || status === "EXPIRED" ? "Renew Now" : "Pay Now"}
                  onPress={handlePay}
                  loading={payLoading}
                />
              </View>
            )}
          </View>

          {/* What's Included Section */}
          <Text style={styles.sectionTitle}>WHAT'S INCLUDED</Text>
          <View style={styles.card}>
            {[
              { icon: "office-building-marker", text: "Registered office address service" },
              { icon: "email-fast-outline", text: "Mail forwarding within 2 working days" },
              { icon: "shield-check-outline", text: "Companies House compliant" },
              { icon: "headset", text: "Dedicated support team" },
            ].map((f, i, arr) => (
              <View key={i}>
                <View style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <MaterialCommunityIcons
                      name={f.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={18}
                      color={Colors.accent}
                    />
                  </View>
                  <Text style={styles.featureText}>{f.text}</Text>
                  <MaterialCommunityIcons name="check" size={18} color={Colors.success} />
                </View>
                {i < arr.length - 1 && <View style={styles.groupedSeparator} />}
              </View>
            ))}
          </View>

          {/* Payment History Section */}
          <Text style={styles.sectionTitle}>PAYMENT HISTORY</Text>
          <View style={styles.card}>
            <PaymentList payments={payments} />
          </View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginRight: 2,
  },
  price: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  period: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginLeft: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    ...Typography.captionBold,
    textTransform: "capitalize",
  },
  groupedList: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  groupedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
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
    marginLeft: Spacing.lg,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
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
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    minHeight: 44,
    gap: Spacing.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.fill,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
});
