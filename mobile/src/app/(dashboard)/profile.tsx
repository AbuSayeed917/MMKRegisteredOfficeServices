import { useState } from "react";
import { ScrollView, View, Text, StyleSheet, RefreshControl, Alert, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useDashboard } from "@/hooks/useDashboard";
import { logout } from "@/lib/auth";
import { router } from "expo-router";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { formatDate } from "@/lib/format";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { BiometricToggle } from "@/components/profile/BiometricToggle";
import { BusinessEditForm } from "@/components/profile/BusinessEditForm";

function GroupedRow({
  label,
  value,
  valueColor,
  showSeparator = true,
}: {
  label: string;
  value?: string | null;
  valueColor?: string;
  showSeparator?: boolean;
}) {
  return (
    <>
      <View style={styles.groupedRow}>
        <Text style={styles.groupedLabel}>{label}</Text>
        <Text
          style={[styles.groupedValue, valueColor ? { color: valueColor } : null]}
          numberOfLines={2}
        >
          {value || "—"}
        </Text>
      </View>
      {showSeparator && <View style={styles.groupedSeparator} />}
    </>
  );
}

export default function ProfileScreen() {
  const { data, isLoading, refetch, isRefetching } = useDashboard();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const user = data?.user;
  const business = data?.business;
  const directors = business?.directors ?? [];

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

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
        {/* Large Title Header with Avatar */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {isLoading ? (
            <Text style={styles.largeTitle}>Profile</Text>
          ) : (
            <View style={styles.profileRow}>
              <Avatar name={business?.companyName} email={user?.email} size={60} />
              <View style={styles.profileText}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {business?.companyName ?? "Your Account"}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>{user?.email}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Account Information */}
              <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
              <View style={styles.card}>
                <GroupedRow label="Email" value={user?.email} />
                <GroupedRow
                  label="Email Status"
                  value={user?.emailVerified ? "Verified" : "Not verified"}
                  valueColor={user?.emailVerified ? Colors.success : Colors.warning}
                />
                {!user?.emailVerified && (
                  <>
                    <View style={styles.groupedSeparator} />
                    <Pressable
                      style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/(dashboard)/verify-email");
                      }}
                    >
                      <Text style={styles.actionRowLabel}>Verify Email</Text>
                      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textLight} />
                    </Pressable>
                  </>
                )}
                <GroupedRow label="Member Since" value={formatDate(user?.createdAt)} />
                <GroupedRow label="Last Login" value={formatDate(user?.lastLogin)} showSeparator={false} />
              </View>

              {/* Security */}
              <Text style={styles.sectionTitle}>SECURITY</Text>
              <View style={styles.card}>
                {showPasswordChange ? (
                  <PasswordChangeForm onDone={() => setShowPasswordChange(false)} />
                ) : (
                  <Pressable
                    style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowPasswordChange(true);
                    }}
                  >
                    <Text style={styles.actionRowLabel}>Change Password</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textLight} />
                  </Pressable>
                )}
              </View>

              {/* Biometric Authentication */}
              <BiometricToggle />

              {/* Business Details */}
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>
                {!editing && (
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setEditing(true);
                    }}
                    hitSlop={12}
                    style={({ pressed }) => pressed && { opacity: 0.6 }}
                  >
                    <Text style={styles.editAction}>Edit</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.card}>
                <GroupedRow label="Company" value={business?.companyName} />
                <GroupedRow label="CRN" value={business?.crn} />
                <GroupedRow label="Type" value={business?.companyType} />
                <GroupedRow label="Registered Address" value={business?.registeredAddress} />

                {editing ? (
                  <BusinessEditForm
                    initialTradingAddress={business?.tradingAddress ?? ""}
                    initialPhone={business?.phone ?? ""}
                    onDone={() => setEditing(false)}
                    onSaved={() => refetch()}
                  />
                ) : (
                  <>
                    <GroupedRow label="Trading Address" value={business?.tradingAddress} />
                    <GroupedRow label="Phone" value={business?.phone} showSeparator={false} />
                  </>
                )}
              </View>

              {/* Directors */}
              {directors.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>DIRECTORS & OFFICERS</Text>
                  <View style={styles.card}>
                    {directors.map((d, i) => (
                      <View key={d.id}>
                        <View style={styles.directorRow}>
                          <Avatar name={d.fullName} size={40} />
                          <View style={styles.directorInfo}>
                            <Text style={styles.directorName}>{d.fullName}</Text>
                            <Text style={styles.directorRole}>{d.position}</Text>
                          </View>
                        </View>
                        {i < directors.length - 1 && <View style={styles.groupedSeparator} />}
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Support */}
              <Text style={styles.sectionTitle}>SUPPORT</Text>
              <View style={styles.card}>
                <Pressable
                  style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/(dashboard)/support");
                  }}
                >
                  <View style={styles.helpRow}>
                    <MaterialCommunityIcons name="lifebuoy" size={22} color={Colors.accent} />
                    <Text style={styles.helpLabel}>Need Help?</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textLight} />
                </Pressable>
              </View>

              {/* Sign Out */}
              <View style={styles.signOutContainer}>
                <Pressable
                  style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutPressed]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handleLogout();
                  }}
                >
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
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
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bgPrimary,
  },
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  profileEmail: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
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
  editAction: {
    ...Typography.body,
    color: Colors.accent,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  groupedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 10,
  },
  groupedLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  groupedValue: {
    ...Typography.body,
    color: Colors.textLight,
    flex: 1,
    textAlign: "right",
  },
  groupedSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: 10,
  },
  actionRowPressed: {
    opacity: 0.6,
  },
  actionRowLabel: {
    ...Typography.body,
    color: Colors.accent,
  },
  directorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    minHeight: 56,
    paddingVertical: Spacing.sm,
  },
  directorInfo: {
    flex: 1,
  },
  directorName: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  directorRole: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 1,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  helpLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  signOutContainer: {
    marginTop: Spacing["3xl"],
    marginBottom: Spacing.lg,
  },
  signOutBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
    minHeight: 50,
  },
  signOutPressed: {
    backgroundColor: Colors.fill,
  },
  signOutText: {
    ...Typography.headline,
    color: Colors.error,
  },
});
