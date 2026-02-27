import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { GradientButton } from "@/components/ui/GradientButton";
import { loginWithCredentials, restoreSession } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import {
  isBiometricAvailable,
  isBiometricEnabled,
  getBiometricType,
  authenticateWithBiometric,
} from "@/lib/biometric";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState("Biometric");
  const [biometricLoading, setBiometricLoading] = useState(false);

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(24), []);
  const shakeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    (async () => {
      const available = await isBiometricAvailable();
      const enabled = await isBiometricEnabled();
      if (available && enabled) {
        setBiometricAvailable(true);
        const type = await getBiometricType();
        setBiometricLabel(type);
      }
    })();
  }, []);

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError("");
    try {
      const authenticated = await authenticateWithBiometric();
      if (!authenticated) {
        setBiometricLoading(false);
        return;
      }
      const restored = await restoreSession();
      if (!restored) {
        setError("No saved session. Please sign in with your credentials.");
        setBiometricLoading(false);
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const user = useAuthStore.getState().user;
      const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
      router.replace(isAdmin ? "/(admin)" : "/(dashboard)");
    } catch {
      setError("Biometric authentication failed. Please try again.");
    } finally {
      setBiometricLoading(false);
    }
  };

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      shakeCard();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await loginWithCredentials(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      router.replace(isAdmin ? "/(admin)" : "/(dashboard)");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message === "Invalid credentials" ? "Invalid email or password" : message);
      shakeCard();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* App Icon & Branding */}
          <Animated.View
            style={[
              styles.brandContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>MMK</Text>
            </View>
            <Text style={styles.appName}>MMK Office</Text>
            <Text style={styles.tagline}>Registered Office Services</Text>
          </Animated.View>

          {/* Sign In Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            <Text style={styles.formTitle}>Sign In</Text>

            {error ? (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => { setEmail(text); setError(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                outlineStyle={styles.inputOutline}
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" color={Colors.textLight} />}
                theme={{ roundness: Radius.sm }}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => { setPassword(text); setError(""); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                mode="outlined"
                outlineColor={Colors.separator}
                activeOutlineColor={Colors.accent}
                outlineStyle={styles.inputOutline}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" color={Colors.textLight} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    color={Colors.textLight}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={{ roundness: Radius.sm }}
              />
            </View>

            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotLink}
              hitSlop={12}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <GradientButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {biometricAvailable && (
              <GradientButton
                label={`Sign in with ${biometricLabel}`}
                onPress={handleBiometricLogin}
                loading={biometricLoading}
                variant="outline"
                icon={biometricLabel === "Face ID" ? "face-recognition" : "fingerprint"}
                style={styles.biometricButton}
              />
            )}

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Don&apos;t have an account? </Text>
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                hitSlop={12}
              >
                <Text style={styles.registerLink}>Register</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>MMK Accountants & Business Advisors</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["5xl"],
  },
  // ── Branding ──
  brandContainer: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  appIcon: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    ...Shadows.glow,
  },
  appIconText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  appName: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  tagline: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // ── Form ──
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    ...Shadows.lg,
  },
  formTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.white,
    fontSize: 17,
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
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  forgotText: {
    color: Colors.accent,
    ...Typography.footnote,
    fontWeight: "600" as const,
  },
  loginButton: {
    marginTop: Spacing.xs,
  },
  biometricButton: {
    marginTop: Spacing.md,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  registerPrompt: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  registerLink: {
    ...Typography.footnote,
    color: Colors.accent,
    fontWeight: "600" as const,
  },
  // ── Footer ──
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  footerText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
});
