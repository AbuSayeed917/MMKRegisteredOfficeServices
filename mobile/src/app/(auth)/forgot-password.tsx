import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { GradientButton } from "@/components/ui/GradientButton";
import { api } from "@/lib/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/password/forgot", { email: email.trim() });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {sent ? (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <MaterialCommunityIcons name="check-circle" size={48} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successMessage}>
                If an account exists for {email}, we've sent a password reset link.
              </Text>
              <GradientButton
                label="Back to Sign In"
                onPress={() => router.back()}
                variant="outline"
                style={{ marginTop: Spacing["2xl"] }}
              />
            </View>
          ) : (
            <>
              <MaterialCommunityIcons
                name="lock-reset"
                size={40}
                color={Colors.accent}
                style={styles.icon}
              />
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              {error ? (
                <View style={styles.errorBox}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => { setEmail(text); setError(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                outlineStyle={styles.inputOutline}
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" color={Colors.textLight} />}
                theme={{ roundness: Radius.sm }}
              />

              <GradientButton
                label="Send Reset Link"
                onPress={handleSubmit}
                loading={loading}
                style={{ marginTop: Spacing.sm }}
              />

              <GradientButton
                label="Back to Sign In"
                onPress={() => router.back()}
                variant="outline"
                style={{ marginTop: Spacing.md }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["5xl"],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    ...Shadows.lg,
  },
  icon: { alignSelf: "center", marginBottom: Spacing.md },
  title: {
    ...Typography.title2,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  input: {
    backgroundColor: Colors.white,
    fontSize: 17,
    marginBottom: Spacing.lg,
  },
  inputOutline: {
    borderRadius: Radius.sm,
    borderWidth: 0.5,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    ...Typography.footnote,
    flex: 1,
    fontWeight: "500" as const,
  },
  successContainer: { alignItems: "center", paddingVertical: Spacing.lg },
  successIcon: { marginBottom: Spacing.lg },
  successTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
