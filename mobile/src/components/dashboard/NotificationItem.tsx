import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { timeAgo } from "@/lib/format";
import type { Notification } from "@/types/api";

const typeConfig: Record<
  string,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }
> = {
  PAYMENT_RECEIVED: { icon: "credit-card-check", color: Colors.success },
  PAYMENT_FAILED: { icon: "credit-card-remove", color: Colors.error },
  REGISTRATION_COMPLETE: { icon: "check-decagram", color: Colors.success },
  APPLICATION_APPROVED: { icon: "shield-check", color: Colors.success },
  APPLICATION_REJECTED: { icon: "shield-remove", color: Colors.error },
  RENEWAL_REMINDER: { icon: "clock-alert", color: Colors.warning },
  ACCOUNT_SUSPENDED: { icon: "alert-octagon", color: Colors.error },
  ACCOUNT_REACTIVATED: { icon: "shield-check", color: Colors.success },
  GENERAL: { icon: "information", color: Colors.accent },
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const config = typeConfig[notification.type] ?? {
    icon: "bell" as const,
    color: Colors.accent,
  };

  const handleMarkRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMarkRead?.(notification.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={!notification.isRead && onMarkRead ? handleMarkRead : undefined}
    >
      {/* Icon with colored background */}
      <View style={[styles.iconRect, { backgroundColor: config.color + "1F" }]}>
        <MaterialCommunityIcons
          name={config.icon}
          size={18}
          color={config.color}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              !notification.isRead && styles.titleUnread,
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>

      {/* Time + mark-read action */}
      <View style={styles.trailing}>
        <Text style={styles.time}>{timeAgo(notification.createdAt)}</Text>
        {!notification.isRead && onMarkRead && (
          <Pressable
            onPress={handleMarkRead}
            hitSlop={12}
            style={styles.markReadBtn}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={Colors.accent}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  rowPressed: {
    backgroundColor: Colors.fill,
  },
  iconRect: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    ...Typography.subheadline,
    color: Colors.textPrimary,
    flex: 1,
  },
  titleUnread: {
    fontWeight: "600",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  message: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  trailing: {
    alignItems: "flex-end",
    gap: Spacing.sm,
    paddingTop: 2,
  },
  time: {
    ...Typography.caption2,
    color: Colors.textLight,
  },
  markReadBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -Spacing.sm,
    marginRight: -Spacing.sm,
  },
});
