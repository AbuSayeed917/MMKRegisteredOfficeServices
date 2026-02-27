import { ScrollView, View, Text, StyleSheet, RefreshControl, Animated } from "react-native";
import { useMemo, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { StatusCards } from "@/components/dashboard/StatusCards";
import { CompanyDetails } from "@/components/dashboard/CompanyDetails";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { SkeletonCard, SkeletonList } from "@/components/ui/SkeletonLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardHome() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const insets = useSafeAreaInsets();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    if (data) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [data, fadeAnim, slideAnim]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={{ width: 160, height: 28, borderRadius: 8, backgroundColor: Colors.bgSection }} />
          <View style={{ width: 100, height: 16, borderRadius: 6, backgroundColor: Colors.bgSection, marginTop: 6 }} />
        </View>
        <View style={styles.content}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonList count={3} />
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="wifi-off" size={40} color={Colors.textLight} />
        <Text style={styles.errorTitle}>Unable to Load</Text>
        <Text style={styles.errorSub}>Pull down to try again</Text>
      </View>
    );
  }

  const recentNotifications = data.notifications.slice(0, 4);
  const greeting = getGreeting();
  const unreadCount = data.notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.textLight} />
        }
      >
        {/* iOS 26 large title header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {data.business?.companyName ?? data.user.email}
          </Text>

          {/* Status pills */}
          <View style={styles.metricsRow}>
            <View style={styles.metricPill}>
              <View style={[styles.metricDot, { backgroundColor: data.subscription?.status === "ACTIVE" ? Colors.success : Colors.textLight }]} />
              <Text style={styles.metricText}>
                {data.subscription?.status === "ACTIVE" ? "Active Plan" : "No Plan"}
              </Text>
            </View>
            {unreadCount > 0 && (
              <View style={[styles.metricPill, styles.metricPillAccent]}>
                <Text style={styles.metricTextAccent}>{unreadCount} unread</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <StatusCards
            subscription={data.subscription}
            agreements={data.agreements}
            notifications={data.notifications}
          />

          <View style={styles.section}>
            <SectionHeader title="Company" />
            <CompanyDetails business={data.business} />
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Notifications"
              actionLabel={data.notifications.length > 4 ? "See All" : undefined}
            />
            {recentNotifications.length > 0 ? (
              <View style={styles.listCard}>
                {recentNotifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons name="bell-check-outline" size={28} color={Colors.textLight} />
                <Text style={styles.emptyText}>All caught up</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  center: { alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  userName: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  metricPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.fill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  metricPillAccent: {
    backgroundColor: "rgba(0, 122, 255, 0.10)",
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricText: {
    ...Typography.footnote,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  metricTextAccent: {
    ...Typography.footnote,
    fontWeight: "600",
    color: Colors.accent,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: { marginTop: Spacing["2xl"] },
  listCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  errorTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  errorSub: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
});
