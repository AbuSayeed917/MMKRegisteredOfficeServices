import { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Pressable, TextInput } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, statusColor } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import { PaymentSummary } from "@/components/admin/PaymentSummary";
import { SkeletonList } from "@/components/ui/SkeletonLoader";
import { formatCurrency, formatDate } from "@/lib/format";
import type { AdminPaymentItem } from "@/types/api";

export default function AdminPaymentsScreen() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useAdminPayments({ page, search: query });

  const handleSearch = useCallback(() => {
    setQuery(search);
    setPage(1);
  }, [search]);

  const payments = data?.payments ?? [];
  const pagination = data?.pagination;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Payments</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textLight} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            placeholder="Search company or email..."
            placeholderTextColor={Colors.textLight}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {search ? (
            <Pressable onPress={() => { setSearch(""); setQuery(""); setPage(1); }} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textLight} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Summary cards — always tight below header */}
      {!isLoading && data?.summary && (
        <View style={styles.summaryWrap}>
          <PaymentSummary summary={data.summary} />
        </View>
      )}

      {isLoading && !data ? (
        <View style={styles.skeletonContainer}><SkeletonList count={5} /></View>
      ) : (
        <FlatList<AdminPaymentItem>
          data={payments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={payments.length > 0 ? <View style={styles.listCardTop} /> : null}
          renderItem={({ item }) => {
            const color = statusColor(item.status);
            return (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={[styles.rowIcon, { backgroundColor: color + "12" }]}>
                  <MaterialCommunityIcons
                    name={item.status === "SUCCEEDED" ? "check-circle" : item.status === "FAILED" ? "close-circle" : "clock-outline"}
                    size={20}
                    color={color}
                  />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName} numberOfLines={1}>{item.companyName ?? item.email}</Text>
                  <Text style={styles.rowDate}>{formatDate(item.paidAt ?? item.createdAt)}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
                  <View style={[styles.rowStatusPill, { backgroundColor: color + "12" }]}>
                    <Text style={[styles.rowStatusText, { color }]}>{item.status.toLowerCase()}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={payments.length === 0 ? styles.centered : styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorWrap}>
              <View style={styles.separator} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="credit-card-off-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Payments Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search criteria</Text>
            </View>
          }
          ListFooterComponent={
            <>
            {payments.length > 0 && <View style={styles.listCardBottom} />}
            {pagination && pagination.totalPages > 1 ? (
              <View style={styles.pagination}>
                <Text style={styles.pageText}>
                  Page {page} of {pagination.totalPages}
                </Text>
                <View style={styles.pageButtons}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.pageBtn,
                      page <= 1 && styles.pageBtnDisabled,
                      pressed && !(page <= 1) && styles.pageBtnPressed,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={page <= 1}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={18} color={page <= 1 ? Colors.textLight : Colors.accent} />
                    <Text style={[styles.pageBtnText, page <= 1 && styles.pageBtnTextDisabled]}>Previous</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.pageBtn,
                      page >= pagination.totalPages && styles.pageBtnDisabled,
                      pressed && !(page >= pagination.totalPages) && styles.pageBtnPressed,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setPage((p) => p + 1);
                    }}
                    disabled={page >= pagination.totalPages}
                  >
                    <Text style={[styles.pageBtnText, page >= pagination.totalPages && styles.pageBtnTextDisabled]}>Next</Text>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={page >= pagination.totalPages ? Colors.textLight : Colors.accent} />
                  </Pressable>
                </View>
              </View>
            ) : null}
            </>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
  },
  headerTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.fill,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    height: 32,
    gap: 4,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  summaryWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: Spacing.lg,
  },
  skeletonContainer: {
    padding: Spacing.lg,
  },
  listCardTop: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    height: Spacing.sm,
    ...Shadows.sm,
  },
  listCardBottom: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    height: Spacing.sm,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  rowPressed: {
    backgroundColor: Colors.fill,
  },
  separatorWrap: {
    backgroundColor: Colors.white,
    paddingLeft: 68,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  rowDate: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 1,
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  rowAmount: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  rowStatusPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  rowStatusText: {
    ...Typography.caption2,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.title3,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    ...Typography.subheadline,
    color: Colors.textLight,
  },
  pagination: {
    paddingVertical: Spacing.xl,
    paddingBottom: 120,
    alignItems: "center",
    gap: Spacing.md,
  },
  pageText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  pageButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    ...Shadows.sm,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  pageBtnText: {
    ...Typography.subheadline,
    color: Colors.accent,
    fontWeight: "600",
  },
  pageBtnTextDisabled: {
    color: Colors.textLight,
  },
});
