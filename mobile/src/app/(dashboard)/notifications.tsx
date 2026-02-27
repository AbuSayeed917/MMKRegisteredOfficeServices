import { FlatList, View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { useMarkNotificationsRead } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { SkeletonList } from "@/components/ui/SkeletonLoader";
import type { Notification } from "@/types/api";

export default function NotificationsScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const markRead = useMarkNotificationsRead();
  const insets = useSafeAreaInsets();

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  const handleMarkOne = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    markRead.mutate({ notificationIds: [id] });
  };

  const handleMarkAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    markRead.mutate({ markAllRead: true });
  };

  return (
    <View style={styles.container}>
      {/* Large Title Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.largeTitle}>Notifications</Text>
            {!isLoading && (
              <Text style={styles.subtitle}>
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </Text>
            )}
          </View>
          {hasUnread && (
            <Pressable
              onPress={handleMarkAll}
              style={({ pressed }) => [styles.markAllBtn, pressed && styles.markAllPressed]}
              hitSlop={8}
            >
              <Text style={styles.markAllText}>Mark All Read</Text>
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonList count={5} />
        </View>
      ) : (
        <FlatList<Notification>
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem notification={item} onMarkRead={handleMarkOne} />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="bell-check-outline" size={44} color={Colors.textLight} />
              </View>
              <Text style={styles.emptyTitle}>All Caught Up</Text>
              <Text style={styles.emptyMessage}>No notifications to show right now.</Text>
            </View>
          }
        />
      )}
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
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bgPrimary,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 2,
  },
  markAllBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.fill,
    marginTop: 6,
    minHeight: 36,
    justifyContent: "center",
  },
  markAllPressed: {
    backgroundColor: Colors.fillSecondary,
  },
  markAllText: {
    ...Typography.captionBold,
    color: Colors.accent,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  skeletonContainer: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    alignItems: "center",
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
});
