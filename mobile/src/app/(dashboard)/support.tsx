import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { GradientButton } from "@/components/ui/GradientButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { timeAgo, humanize } from "@/lib/format";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function CategoryPill({ category }: { category: string }) {
  return (
    <View style={styles.categoryPill}>
      <Text style={styles.categoryPillText}>{humanize(category)}</Text>
    </View>
  );
}

function TicketItem({ ticket }: { ticket: Ticket }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.ticketCard, pressed && styles.ticketCardPressed]}
      onPress={() => router.push(`/(dashboard)/support-detail?id=${ticket.id}`)}
    >
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketSubject} numberOfLines={2}>
          {ticket.subject}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textLight} />
      </View>
      <View style={styles.ticketMeta}>
        <CategoryPill category={ticket.category} />
        <StatusBadge status={ticket.status} size="sm" />
      </View>
      <Text style={styles.ticketDate}>{timeAgo(ticket.updatedAt || ticket.createdAt)}</Text>
    </Pressable>
  );
}

export default function SupportScreen() {
  const { data, isLoading, refetch, isRefetching } = useSupportTickets();
  const insets = useSafeAreaInsets();

  const tickets: Ticket[] = data?.tickets ?? [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.accent} />
          </Pressable>
          <Text style={styles.largeTitle}>Support</Text>
        </View>
        <View style={styles.newTicketRow}>
          <GradientButton
            label="New Ticket"
            onPress={() => router.push("/(dashboard)/support-new")}
            size="compact"
            icon={
              <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
            }
          />
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.content}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : tickets.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.accent}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="lifebuoy"
              title="No Tickets Yet"
              message="Submit a ticket and our team will help you."
              actionLabel="Create Ticket"
              onAction={() => router.push("/(dashboard)/support-new")}
            />
          }
        />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TicketItem ticket={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.accent}
            />
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
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginLeft: -8,
    marginRight: 4,
  },
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  newTicketRow: {
    marginTop: Spacing.md,
    alignItems: "flex-start",
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    paddingTop: Spacing.sm,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  ticketCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  ticketSubject: {
    ...Typography.headline,
    color: Colors.textPrimary,
    flex: 1,
  },
  ticketMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  categoryPill: {
    backgroundColor: Colors.accent + "14",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryPillText: {
    ...Typography.caption1,
    color: Colors.accent,
    fontWeight: "600",
  },
  ticketDate: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
});
