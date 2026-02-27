import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { GradientButton } from "@/components/ui/GradientButton";
import { api } from "@/lib/api";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/password/reset", { token, password });
      setSuccess(true);
    } catch {
      setError("Invalid or expired reset link. Please request a new one.");
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
          {success ? (
            <View style={styles.center}>
              <MaterialCommunityIcons name="check-circle" size={48} color={Colors.success} />
              <Text style={styles.title}>Password Reset</Text>
              <Text style={styles.description}>
                Your password has been updated. You can now sign in.
              </Text>
              <GradientButton
                label="Sign In"
                onPress={() => router.replace("/(auth)/login")}
                style={{ marginTop: Spacing["2xl"] }}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Set New Password</Text>
              <Text style={styles.description}>Enter your new password below.</Text>

              {error ? (
                <View style={styles.errorBox}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TextInput
                label="New Password"
                value={password}
                onChangeText={(text) => { setPassword(text); setError(""); }}
                secureTextEntry
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                outlineStyle={styles.inputOutline}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" color={Colors.textLight} />}
                theme={{ roundness: Radius.sm }}
              />

              <TextInput
                label="Confirm Password"
                value={confirm}
                onChangeText={(text) => { setConfirm(text); setError(""); }}
                secureTextEntry
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                outlineStyle={styles.inputOutline}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check-outline" color={Colors.textLight} />}
                theme={{ roundness: Radius.sm }}
              />

              <GradientButton
                label="Reset Password"
                onPress={handleReset}
                loading={loading}
                style={{ marginTop: Spacing.sm }}
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
  center: { alignItems: "center", paddingVertical: Spacing.lg },
  title: {
    ...Typography.title2,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
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
    marginBottom: Spacing.md,
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
});
