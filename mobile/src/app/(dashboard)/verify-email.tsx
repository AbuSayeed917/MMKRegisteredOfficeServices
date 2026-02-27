import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { GradientButton } from "@/components/ui/GradientButton";
import { useDashboard } from "@/hooks/useDashboard";
import { api } from "@/lib/api";

const CODE_LENGTH = 6;

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const { data, refetch } = useDashboard();
  const email = data?.user?.email ?? "";

  const [step, setStep] = useState<"idle" | "sent" | "verifying" | "success">("idle");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // ── Send verification code ──────────────────────────────────
  const handleSendCode = useCallback(async () => {
    setSending(true);
    setError(null);
    try {
      await api.post("/api/email/send-verification");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("sent");
    } catch {
      setError("Failed to send verification code. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSending(false);
    }
  }, []);

  // ── Handle individual digit input ──────────────────────────
  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const digit = text.replace(/[^0-9]/g, "").slice(-1);
      const next = [...code];
      next[index] = digit;
      setCode(next);
      setError(null);

      // Auto-advance to next input
      if (digit && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...code];
        next[index - 1] = "";
        setCode(next);
      }
    },
    [code],
  );

  // ── Verify the OTP code ────────────────────────────────────
  const handleVerify = useCallback(async () => {
    const otp = code.join("");
    if (otp.length !== CODE_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      // NOTE: This endpoint needs to be implemented on the backend.
      // Expected: POST /api/email/verify  body: { code: "123456" }
      await api.post("/api/email/verify", { code: otp });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("success");
      refetch();
    } catch {
      setError("Invalid or expired code. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setVerifying(false);
    }
  }, [code, refetch]);

  // ── Success state ──────────────────────────────────────────
  if (step === "success") {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={Colors.accent}
            />
            <Text style={styles.backText}>Profile</Text>
          </Pressable>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconBg}>
            <MaterialCommunityIcons
              name="check-circle"
              size={56}
              color={Colors.success}
            />
          </View>
          <Text style={styles.successTitle}>Email Verified</Text>
          <Text style={styles.successMessage}>
            Your email address has been successfully verified.
          </Text>
          <GradientButton
            label="Back to Profile"
            onPress={() => router.back()}
            style={styles.successBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={Colors.accent}
          />
          <Text style={styles.backText}>Profile</Text>
        </Pressable>
        <Text style={styles.largeTitle}>Verify Email</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Email display card */}
          <View style={styles.card}>
            <View style={styles.emailRow}>
              <View style={styles.emailIconBg}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color={Colors.accent}
                />
              </View>
              <View style={styles.emailInfo}>
                <Text style={styles.emailLabel}>Email Address</Text>
                <Text style={styles.emailValue} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>
          </View>

          {step === "idle" && (
            <>
              <Text style={styles.description}>
                We will send a 6-digit verification code to your email address.
                Please check your inbox and spam folder.
              </Text>
              <GradientButton
                label="Send Verification Code"
                onPress={handleSendCode}
                loading={sending}
                icon={
                  !sending ? (
                    <MaterialCommunityIcons
                      name="email-fast-outline"
                      size={20}
                      color={Colors.white}
                    />
                  ) : undefined
                }
                style={styles.sendBtn}
              />
            </>
          )}

          {step === "sent" && (
            <>
              <Text style={styles.description}>
                Enter the 6-digit code sent to{" "}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              {/* OTP Input Boxes */}
              <View style={styles.otpContainer}>
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => {
                      inputRefs.current[i] = ref;
                    }}
                    style={[
                      styles.otpBox,
                      code[i] ? styles.otpBoxFilled : null,
                      error ? styles.otpBoxError : null,
                    ]}
                    value={code[i]}
                    onChangeText={(text) => handleChangeText(text, i)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, i)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textContentType="oneTimeCode"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                  />
                ))}
              </View>

              {error && (
                <View style={styles.errorRow}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color={Colors.error}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <GradientButton
                label="Verify"
                onPress={handleVerify}
                loading={verifying}
                disabled={code.join("").length !== CODE_LENGTH}
                style={styles.verifyBtn}
              />

              {/* Resend option */}
              <Pressable
                onPress={handleSendCode}
                disabled={sending}
                style={({ pressed }) => [
                  styles.resendBtn,
                  pressed && styles.resendPressed,
                ]}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={Colors.accent} />
                ) : (
                  <Text style={styles.resendText}>Resend Code</Text>
                )}
              </Pressable>
            </>
          )}
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
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: Colors.accent,
  },
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  emailIconBg: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accent + "14",
    alignItems: "center",
    justifyContent: "center",
  },
  emailInfo: {
    flex: 1,
  },
  emailLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  emailValue: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    lineHeight: 24,
  },
  emailHighlight: {
    ...Typography.headline,
    color: Colors.accent,
  },
  sendBtn: {
    marginTop: Spacing.xl,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing["2xl"],
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.separator,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    ...Shadows.sm,
  },
  otpBoxFilled: {
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  otpBoxError: {
    borderColor: Colors.error,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.md,
    justifyContent: "center",
  },
  errorText: {
    ...Typography.footnote,
    color: Colors.error,
  },
  verifyBtn: {
    marginTop: Spacing.xl,
  },
  resendBtn: {
    alignSelf: "center",
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 40,
    justifyContent: "center",
  },
  resendPressed: {
    opacity: 0.6,
  },
  resendText: {
    ...Typography.body,
    color: Colors.accent,
  },
  // Success state
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: 80,
  },
  successIconBg: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Colors.success + "14",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  successTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
  },
  successBtn: {
    width: "100%",
  },
});
