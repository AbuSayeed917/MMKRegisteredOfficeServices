import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { useCreateTicket } from "@/hooks/useSupportTickets";
import { GradientButton } from "@/components/ui/GradientButton";

const CATEGORIES = [
  { key: "GENERAL", label: "General" },
  { key: "BILLING", label: "Billing" },
  { key: "MAIL_FORWARDING", label: "Mail" },
  { key: "ACCOUNT", label: "Account" },
  { key: "TECHNICAL", label: "Technical" },
  { key: "OTHER", label: "Other" },
] as const;

export default function SupportNewScreen() {
  const insets = useSafeAreaInsets();
  const createTicket = useCreateTicket();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [message, setMessage] = useState("");

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      await createTicket.mutateAsync({
        subject: subject.trim(),
        category,
        message: message.trim(),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Could not create ticket. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.accent} />
            </Pressable>
            <Text style={styles.largeTitle}>New Ticket</Text>
          </View>
        </View>

        {/* Form */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subject */}
          <Text style={styles.sectionTitle}>SUBJECT</Text>
          <View style={styles.card}>
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              outlineColor={Colors.separator}
              activeOutlineColor={Colors.accent}
              style={styles.input}
              theme={{ roundness: Radius.sm }}
              placeholder="Brief description of your issue"
              maxLength={200}
            />
          </View>

          {/* Category */}
          <Text style={styles.sectionTitle}>CATEGORY</Text>
          <View style={styles.card}>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <Pressable
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCategory(cat.key);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <View style={styles.card}>
            <TextInput
              label="Describe your issue"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              outlineColor={Colors.separator}
              activeOutlineColor={Colors.accent}
              style={[styles.input, styles.multilineInput]}
              theme={{ roundness: Radius.sm }}
              multiline
              numberOfLines={6}
              placeholder="Please provide as much detail as possible..."
              maxLength={2000}
            />
          </View>

          {/* Submit */}
          <View style={styles.submitContainer}>
            <GradientButton
              label="Submit Ticket"
              onPress={handleSubmit}
              loading={createTicket.isPending}
              disabled={!canSubmit}
              icon={
                <MaterialCommunityIcons name="send" size={18} color={Colors.white} />
              }
            />
          </View>
        </ScrollView>
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
  formContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...Typography.footnote,
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  input: {
    backgroundColor: Colors.white,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 140,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.fill,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  categoryChipSelected: {
    backgroundColor: Colors.accent + "14",
    borderColor: Colors.accent,
  },
  categoryChipText: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: Colors.accent,
    fontWeight: "600",
  },
  submitContainer: {
    marginTop: Spacing["2xl"],
  },
});
