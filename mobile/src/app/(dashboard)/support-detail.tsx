import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useSupportTicketDetail, useReplyTicket } from "@/hooks/useSupportTickets";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { humanize, timeAgo } from "@/lib/format";

interface Message {
  id: string;
  content: string;
  senderRole: string;
  senderName?: string;
  createdAt: string;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.senderRole === "USER" || message.senderRole === "CUSTOMER";
  const isAdmin = !isUser;

  return (
    <View
      style={[
        styles.bubbleContainer,
        isUser ? styles.bubbleContainerRight : styles.bubbleContainerLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAdmin,
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            isUser ? styles.bubbleTextUser : styles.bubbleTextAdmin,
          ]}
        >
          {message.content}
        </Text>
      </View>
      <View
        style={[
          styles.bubbleMeta,
          isUser ? styles.bubbleMetaRight : styles.bubbleMetaLeft,
        ]}
      >
        <Text style={styles.bubbleSender}>
          {isAdmin ? (message.senderName || "Support") : "You"}
        </Text>
        <Text style={styles.bubbleTime}>{timeAgo(message.createdAt)}</Text>
      </View>
    </View>
  );
}

export default function SupportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading, refetch, isRefetching } = useSupportTicketDetail(id ?? "");
  const replyMutation = useReplyTicket(id ?? "");

  const [replyText, setReplyText] = useState("");

  const ticket = data?.ticket ?? data;
  const messages: Message[] = ticket?.messages ?? [];

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages.length]);

  const handleSend = async () => {
    const text = replyText.trim();
    if (!text) return;

    try {
      setReplyText("");
      await replyMutation.mutateAsync({ message: text });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 400);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setReplyText(text);
      Alert.alert("Error", "Could not send reply. Please try again.");
    }
  };

  const isClosed = ticket?.status === "CLOSED" || ticket?.status === "RESOLVED";

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerTopRow}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.accent} />
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {isLoading ? "Loading..." : ticket?.subject ?? "Ticket"}
            </Text>
          </View>
          {!isLoading && ticket && (
            <View style={styles.headerBadges}>
              <StatusBadge status={ticket.status} size="sm" />
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>
                  {humanize(ticket.category ?? "")}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Messages */}
        {isLoading ? (
          <View style={styles.loadingContent}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <View style={styles.emptyMessages}>
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={48}
                  color={Colors.textLight}
                />
                <Text style={styles.emptyText}>No messages yet</Text>
              </View>
            }
          />
        )}

        {/* Reply Input Bar */}
        {!isLoading && !isClosed && (
          <View style={[styles.replyBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
            <View style={styles.replyInputRow}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Type a reply..."
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                style={styles.replyInput}
                theme={{ roundness: Radius.md }}
                multiline
                maxLength={2000}
                dense
              />
              <Pressable
                onPress={handleSend}
                disabled={!replyText.trim() || replyMutation.isPending}
                style={({ pressed }) => [
                  styles.sendButton,
                  (!replyText.trim() || replyMutation.isPending) && styles.sendButtonDisabled,
                  pressed && styles.sendButtonPressed,
                ]}
                hitSlop={8}
              >
                {replyMutation.isPending ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <MaterialCommunityIcons name="send" size={20} color={Colors.white} />
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Closed ticket notice */}
        {!isLoading && isClosed && (
          <View style={[styles.closedBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
            <MaterialCommunityIcons name="lock" size={16} color={Colors.textLight} />
            <Text style={styles.closedText}>This ticket is closed</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginLeft: -8,
    marginRight: 4,
  },
  headerTitle: {
    ...Typography.title3,
    color: Colors.textPrimary,
    flex: 1,
  },
  headerBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    marginLeft: 24,
  },
  categoryPill: {
    backgroundColor: Colors.accent + "14",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryPillText: {
    ...Typography.caption1,
    color: Colors.accent,
    fontWeight: "600",
  },
  loadingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    flexGrow: 1,
  },
  bubbleContainer: {
    marginBottom: Spacing.lg,
    maxWidth: "80%",
  },
  bubbleContainerRight: {
    alignSelf: "flex-end",
  },
  bubbleContainerLeft: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleUser: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: Radius.xs,
  },
  bubbleAdmin: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Radius.xs,
    ...Shadows.sm,
  },
  bubbleText: {
    ...Typography.body,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  bubbleTextAdmin: {
    color: Colors.textPrimary,
  },
  bubbleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 4,
  },
  bubbleMetaRight: {
    justifyContent: "flex-end",
  },
  bubbleMetaLeft: {
    justifyContent: "flex-start",
  },
  bubbleSender: {
    ...Typography.caption1,
    color: Colors.textLight,
    fontWeight: "500",
  },
  bubbleTime: {
    ...Typography.caption1,
    color: Colors.textLight,
  },
  emptyMessages: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyText: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: Spacing.md,
  },
  replyBar: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
  },
  replyInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  replyInput: {
    flex: 1,
    backgroundColor: Colors.white,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  sendButtonDisabled: {
    opacity: 0.35,
  },
  sendButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  closedBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
  },
  closedText: {
    ...Typography.subheadline,
    color: Colors.textLight,
  },
});
