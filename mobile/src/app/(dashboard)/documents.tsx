import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

interface DirectorDoc {
  id: string;
  fullName: string;
  position: string;
  idDocumentName?: string;
  hasIdDocument?: boolean;
  addressProofName?: string;
  hasAddressProof?: boolean;
}

function DocCard({
  label,
  fileName,
  uploaded,
  icon,
}: {
  label: string;
  fileName?: string;
  uploaded: boolean;
  icon: string;
}) {
  return (
    <View style={[styles.docCard, uploaded ? styles.docCardUploaded : styles.docCardMissing]}>
      <View style={styles.docCardHeader}>
        <MaterialCommunityIcons
          name={uploaded ? "check-circle" : "close-circle"}
          size={18}
          color={uploaded ? Colors.success : Colors.textLight}
        />
        <Text style={styles.docCardLabel}>{label}</Text>
      </View>
      {uploaded ? (
        <View style={styles.docFileRow}>
          <MaterialCommunityIcons
            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={14}
            color={Colors.textLight}
          />
          <Text style={styles.docFileName} numberOfLines={1}>
            {fileName || "Uploaded"}
          </Text>
        </View>
      ) : (
        <Text style={styles.docMissingText}>Not uploaded</Text>
      )}
    </View>
  );
}

export default function DocumentsScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const insets = useSafeAreaInsets();

  const directors: DirectorDoc[] = (data?.business?.directors as DirectorDoc[]) ?? [];

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
          <Text style={styles.largeTitle}>Documents</Text>
          <Text style={styles.subtitle}>Your uploaded identification documents</Text>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : directors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="shield-check-outline" size={48} color={Colors.textLight} />
              </View>
              <Text style={styles.emptyTitle}>No Documents</Text>
              <Text style={styles.emptyMessage}>
                No KYC documents have been uploaded yet.
              </Text>
            </View>
          ) : (
            <>
              {directors.map((d) => (
                <View key={d.id}>
                  {/* Director Header */}
                  <View style={styles.directorHeader}>
                    <Text style={styles.directorName}>{d.fullName}</Text>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>{d.position}</Text>
                    </View>
                  </View>

                  {/* Document Cards */}
                  <View style={styles.card}>
                    <DocCard
                      label="Photo ID"
                      fileName={d.idDocumentName}
                      uploaded={!!d.hasIdDocument}
                      icon="image-outline"
                    />
                    <View style={styles.docSeparator} />
                    <DocCard
                      label="Proof of Address"
                      fileName={d.addressProofName}
                      uploaded={!!d.hasAddressProof}
                      icon="file-document-outline"
                    />
                  </View>
                </View>
              ))}

              {/* Security Info */}
              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color={Colors.accent}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Document Security</Text>
                  <Text style={styles.infoDesc}>
                    Your documents are stored securely and are only accessible to our
                    admin team for identity verification purposes.
                  </Text>
                </View>
              </View>
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
  subtitle: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 2,
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
  directorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  directorName: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  positionBadge: {
    backgroundColor: Colors.fill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  positionText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  docSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginVertical: Spacing.md,
  },
  docCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  docCardUploaded: {
    backgroundColor: Colors.success + "0A",
    borderWidth: 1,
    borderColor: Colors.success + "30",
  },
  docCardMissing: {
    backgroundColor: Colors.fill,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  docCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  docCardLabel: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  docFileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginLeft: 26,
  },
  docFileName: {
    ...Typography.caption1,
    color: Colors.textLight,
    flex: 1,
  },
  docMissingText: {
    ...Typography.caption1,
    color: Colors.textLight,
    marginLeft: 26,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    backgroundColor: Colors.accent + "0A",
    borderWidth: 1,
    borderColor: Colors.accent + "30",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoDesc: {
    ...Typography.caption1,
    color: Colors.textLight,
    lineHeight: 18,
  },
});
