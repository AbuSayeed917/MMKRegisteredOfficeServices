import { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, Pressable, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { api } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { logout } from "@/lib/auth";
import { router } from "expo-router";

function SettingRow({
  icon,
  text,
  color,
  isLast,
}: {
  icon: string;
  text: string;
  color?: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !isLast && styles.settingRowSeparator]}>
      <View style={[styles.settingIcon, { backgroundColor: (color ?? Colors.accent) + "12" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={16}
          color={color ?? Colors.accent}
        />
      </View>
      <Text style={styles.settingText}>{text}</Text>
    </View>
  );
}

export default function AdminSettingsScreen() {
  const [annualFee, setAnnualFee] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    api
      .get("/api/admin/settings")
      .then((res) => {
        const pence = res.data.annualFeePence ?? 7500;
        setAnnualFee(String(pence / 100));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const pounds = parseFloat(annualFee);
    if (isNaN(pounds) || pounds <= 0) {
      Alert.alert("Error", "Please enter a valid fee amount");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/api/admin/settings", { annualFeePence: Math.round(pounds * 100) });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Settings updated");
    } catch {
      Alert.alert("Error", "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

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
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSub}>Manage your system configuration</Text>
        </View>

        <View style={styles.content}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Fee Configuration */}
              <View>
                <Text style={styles.groupHeader}>FEE CONFIGURATION</Text>
                <View style={styles.sectionCard}>
                  <View style={styles.feeRow}>
                    <View style={[styles.feeIconBg, { backgroundColor: Colors.success + "12" }]}>
                      <MaterialCommunityIcons name="currency-gbp" size={18} color={Colors.success} />
                    </View>
                    <View style={styles.feeInfo}>
                      <Text style={styles.feeLabel}>Annual Service Fee</Text>
                      <View style={styles.feeInputRow}>
                        <Text style={styles.feeCurrency}>\u00a3</Text>
                        <TextInput
                          value={annualFee}
                          onChangeText={setAnnualFee}
                          keyboardType="decimal-pad"
                          style={styles.feeInput}
                          placeholder="0.00"
                          placeholderTextColor={Colors.textLight}
                        />
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <Text style={styles.saveBtnText}>Saving...</Text>
                    ) : (
                      <Text style={styles.saveBtnText}>Save Changes</Text>
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Security Settings */}
              <View>
                <Text style={styles.groupHeader}>SECURITY</Text>
                <View style={styles.sectionCard}>
                  <SettingRow icon="lock-clock" text="Account lockout after 5 failed attempts" color={Colors.warning} />
                  <SettingRow icon="timer-outline" text="Session timeout: 30 minutes" />
                  <SettingRow icon="shield-check-outline" text="Min 8 chars, uppercase, lowercase, number" color={Colors.success} />
                  <SettingRow icon="security" text="CSRF protection enabled" color={Colors.success} isLast />
                </View>
              </View>

              {/* System Info */}
              <View>
                <Text style={styles.groupHeader}>SYSTEM</Text>
                <View style={styles.sectionCard}>
                  <SettingRow icon="react" text="Next.js 16 + React Native (Expo)" />
                  <SettingRow icon="database" text="PostgreSQL with Prisma ORM" />
                  <SettingRow icon="credit-card" text="Stripe Payment Processing" />
                  <SettingRow icon="cloud" text="Hosted on Railway" isLast />
                </View>
              </View>

              {/* Sign Out */}
              <Pressable
                style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutPressed]}
                onPress={handleLogout}
              >
                <MaterialCommunityIcons name="logout" size={20} color={Colors.error} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bgPrimary,
  },
  headerTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  headerSub: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  groupHeader: {
    ...Typography.footnote,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  feeIconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  feeInfo: {
    flex: 1,
  },
  feeLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginBottom: 4,
  },
  feeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  feeCurrency: {
    ...Typography.title2,
    color: Colors.textSecondary,
  },
  feeInput: {
    ...Typography.title2,
    color: Colors.textPrimary,
    flex: 1,
    paddingVertical: 0,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    margin: Spacing.lg,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
  },
  saveBtnPressed: {
    opacity: 0.8,
  },
  saveBtnText: {
    ...Typography.headline,
    color: Colors.white,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  settingRowSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    ...Shadows.sm,
  },
  signOutPressed: {
    opacity: 0.7,
  },
  signOutText: {
    ...Typography.headline,
    color: Colors.error,
  },
});
