import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { useAdminAction } from "@/hooks/useAdminClientDetail";
import type { SubscriptionStatus, AdminActionType } from "@/types/api";

interface AdminActionButtonsProps {
  clientId: string;
  status: SubscriptionStatus | null;
}

export function AdminActionButtons({ clientId, status }: AdminActionButtonsProps) {
  const action = useAdminAction(clientId);

  const confirmAction = (actionType: AdminActionType, label: string, needsReason = false) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (needsReason) {
      Alert.prompt(
        `${label} Client`,
        `Please provide a reason for ${label.toLowerCase()}:`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: label,
            style: actionType === "APPROVE" || actionType === "REACTIVATE" ? "default" : "destructive",
            onPress: (reason?: string) => {
              action.mutate({ action: actionType, reason: reason ?? undefined });
            },
          },
        ],
        "plain-text"
      );
    } else {
      Alert.alert(`${label} Client`, `Are you sure you want to ${label.toLowerCase()} this client?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: label,
          style: actionType === "APPROVE" || actionType === "REACTIVATE" ? "default" : "destructive",
          onPress: () => action.mutate({ action: actionType }),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {status === "PENDING_APPROVAL" && (
        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.approveBtn,
              pressed && styles.pressed,
            ]}
            onPress={() => confirmAction("APPROVE", "Approve")}
          >
            <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
            <Text style={[styles.actionText, { color: Colors.success }]}>Approve</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.rejectBtn,
              pressed && styles.pressed,
            ]}
            onPress={() => confirmAction("REJECT", "Reject", true)}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Reject</Text>
          </Pressable>
        </View>
      )}

      {status === "ACTIVE" && (
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.suspendBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => confirmAction("SUSPEND", "Suspend", true)}
        >
          <MaterialCommunityIcons name="pause-circle" size={20} color={Colors.warning} />
          <Text style={[styles.actionText, { color: Colors.warning }]}>Suspend Client</Text>
        </Pressable>
      )}

      {status === "SUSPENDED" && (
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.reactivateBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => confirmAction("REACTIVATE", "Reactivate")}
        >
          <MaterialCommunityIcons name="play-circle" size={20} color={Colors.success} />
          <Text style={[styles.actionText, { color: Colors.success }]}>Reactivate</Text>
        </Pressable>
      )}

      {status && !["WITHDRAWN", "REJECTED", "ABANDONED"].includes(status) && (
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.cancelBtn,
            pressed && styles.pressed,
          ]}
          onPress={() => confirmAction("CANCEL", "Cancel")}
        >
          <MaterialCommunityIcons name="cancel" size={18} color={Colors.textLight} />
          <Text style={[styles.actionText, { color: Colors.textSecondary }]}>Cancel Service</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.white,
  },
  pressed: {
    backgroundColor: Colors.fill,
  },
  approveBtn: {
    borderColor: Colors.success + "40",
  },
  rejectBtn: {
    borderColor: Colors.error + "40",
  },
  suspendBtn: {
    borderColor: Colors.warning + "40",
  },
  reactivateBtn: {
    borderColor: Colors.success + "40",
  },
  cancelBtn: {
    borderColor: Colors.separator,
  },
  actionText: {
    ...Typography.subheadline,
    fontWeight: "600",
  },
});
