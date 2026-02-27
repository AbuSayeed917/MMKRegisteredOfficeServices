import { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, Pressable, TextInput, ScrollView as HScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useAdminClients } from "@/hooks/useAdminClients";
import { ClientRow } from "@/components/admin/ClientRow";
import { SkeletonList } from "@/components/ui/SkeletonLoader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { AdminClientItem } from "@/types/api";

const STATUS_FILTERS = [
  { value: "", label: "All", icon: "account-group" },
  { value: "ACTIVE", label: "Active", icon: "check-circle" },
  { value: "PENDING_APPROVAL", label: "Pending", icon: "clock-outline" },
  { value: "SUSPENDED", label: "Suspended", icon: "alert-circle" },
  { value: "EXPIRED", label: "Expired", icon: "calendar-remove" },
];

export default function ClientsListScreen() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();

  const { data, isLoading, refetch, isRefetching } = useAdminClients({ page, search: query, status });

  const handleSearch = useCallback(() => {
    setQuery(search);
    setPage(1);
  }, [search]);

  const clients = data?.clients ?? [];
  const pagination = data?.pagination;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Clients</Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textLight} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            placeholder="Search company, CRN, email..."
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

        {/* Filter pills */}
        <HScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {STATUS_FILTERS.map((f) => {
            const isActive = status === f.value;
            return (
              <Pressable
                key={f.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStatus(f.value);
                  setPage(1);
                }}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <MaterialCommunityIcons
                  name={f.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={14}
                  color={isActive ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </HScrollView>
      </View>

      {isLoading && !data ? (
        <View style={styles.skeletonContainer}><SkeletonList count={6} /></View>
      ) : (
        <FlatList<AdminClientItem>
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClientRow client={item} onPress={() => router.push(`/(admin)/clients/${item.id}`)} />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={clients.length === 0 ? styles.centered : styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-search-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Clients Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
            </View>
          }
          ListFooterComponent={
            pagination && pagination.totalPages > 1 ? (
              <View style={styles.pagination}>
                <Text style={styles.pageText}>
                  Page {page} of {pagination.totalPages}
                </Text>
                <View style={styles.pageButtons}>
                  <Pressable
                    style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <MaterialCommunityIcons name="chevron-left" size={18} color={page <= 1 ? Colors.textLight : Colors.accent} />
                    <Text style={[styles.pageBtnText, page <= 1 && styles.pageBtnTextDisabled]}>Previous</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.pageBtn, page >= pagination.totalPages && styles.pageBtnDisabled]}
                    onPress={() => setPage((p) => p + 1)}
                    disabled={page >= pagination.totalPages}
                  >
                    <Text style={[styles.pageBtnText, page >= pagination.totalPages && styles.pageBtnTextDisabled]}>Next</Text>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={page >= pagination.totalPages ? Colors.textLight : Colors.accent} />
                  </Pressable>
                </View>
              </View>
            ) : null
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
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bgPrimary,
  },
  headerTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.fill,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    height: 36,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterScroll: {
    marginTop: Spacing.md,
    marginHorizontal: -Spacing.xl,
  },
  filterContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.fill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
  },
  filterText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingBottom: 100,
  },
  skeletonContainer: {
    padding: Spacing.lg,
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
  pageBtnText: {
    ...Typography.subheadline,
    color: Colors.accent,
    fontWeight: "600",
  },
  pageBtnTextDisabled: {
    color: Colors.textLight,
  },
});
