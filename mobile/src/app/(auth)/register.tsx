import { useState, useRef, useMemo, useEffect, useCallback } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { ActionButton } from "@/components/ui/ActionButton";
import { api } from "@/lib/api";
import {
  useCompaniesHouseSearch,
  CompanySearchResult,
} from "@/hooks/useCompaniesHouseSearch";
import {
  BusinessData,
  DirectorData,
  AccountData,
  formatCompanyType,
  isValidEmail,
  isValidDateOfBirth,
} from "@/components/register/types";
import { StepIndicator } from "@/components/register/StepIndicator";
import { StepCompany } from "@/components/register/StepCompany";
import { StepDirector } from "@/components/register/StepDirector";
import { StepAccount } from "@/components/register/StepAccount";
import { StepReview } from "@/components/register/StepReview";

const TOTAL_STEPS = 4;

export default function RegisterScreen() {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Step 1 — Company
  const [business, setBusiness] = useState<BusinessData>({
    companyName: "",
    companyNumber: "",
    companyType: "",
    incorporationDate: "",
    registeredAddress: "",
    tradingAddress: "",
    phone: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchHook = useCompaniesHouseSearch();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // Step 2 — Director
  const [director, setDirector] = useState<DirectorData>({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    dateOfBirth: "",
    residentialAddress: "",
  });

  // Step 3 — Account
  const [account, setAccount] = useState<AccountData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 4 — Agreement
  const [agreed, setAgreed] = useState(false);

  // Animations
  const fadeAnim = useMemo(() => new Animated.Value(1), []);
  const slideAnim = useMemo(() => new Animated.Value(0), []);

  const animateTransition = useCallback(
    (direction: "forward" | "back") => {
      const exitX = direction === "forward" ? -30 : 30;
      const enterX = direction === "forward" ? 30 : -30;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: exitX,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        slideAnim.setValue(enterX);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim],
  );

  // Debounced search
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (text.length >= 2) {
      setShowResults(true);
      searchTimerRef.current = setTimeout(() => {
        searchHook.search(text);
      }, 400);
    } else {
      setShowResults(false);
      searchHook.clear();
    }
  };

  const selectCompany = (company: CompanySearchResult) => {
    setBusiness({
      companyName: company.company_name,
      companyNumber: company.company_number,
      companyType: formatCompanyType(company.company_type),
      incorporationDate: company.date_of_creation || "",
      registeredAddress: company.address_snippet || "",
      tradingAddress: "",
      phone: "",
    });
    setShowResults(false);
    setSearchQuery("");
    searchHook.clear();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Sync director email to account email
  useEffect(() => {
    if (director.email && !account.email) {
      setAccount((prev) => ({ ...prev, email: director.email }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── Validation ──
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!business.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!business.companyNumber.trim())
        newErrors.companyNumber = "Company number is required";
      if (!business.registeredAddress.trim())
        newErrors.registeredAddress = "Registered address is required";
    }

    if (step === 1) {
      if (!director.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!director.email.trim()) {
        newErrors.directorEmail = "Email is required";
      } else if (!isValidEmail(director.email)) {
        newErrors.directorEmail = "Please enter a valid email address";
      }
      if (!director.dateOfBirth.trim()) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else if (!isValidDateOfBirth(director.dateOfBirth)) {
        newErrors.dateOfBirth = "Use DD/MM/YYYY format";
      }
    }

    if (step === 2) {
      if (!account.email.trim()) {
        newErrors.accountEmail = "Email is required";
      } else if (!isValidEmail(account.email)) {
        newErrors.accountEmail = "Please enter a valid email address";
      }
      if (!account.password) {
        newErrors.password = "Password is required";
      } else if (account.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!account.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (account.password !== account.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 3) {
      if (!agreed) newErrors.agreement = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      if (step === 1 && !account.email) {
        setAccount((prev) => ({ ...prev, email: director.email }));
      }
      setStep((s) => s + 1);
      animateTransition("forward");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      setErrors({});
      animateTransition("back");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      await api.post("/api/register", {
        business: {
          companyName: business.companyName,
          companyNumber: business.companyNumber,
          companyType: business.companyType,
          incorporationDate: business.incorporationDate || undefined,
          registeredAddress: business.registeredAddress,
          tradingAddress: business.tradingAddress || undefined,
          phone: business.phone || undefined,
        },
        director: {
          fullName: director.fullName,
          email: director.email,
          phone: director.phone || undefined,
          position: director.position || undefined,
          dateOfBirth: director.dateOfBirth,
          residentialAddress: director.residentialAddress || undefined,
        },
        account: {
          email: account.email,
          password: account.password,
        },
        agreement: {
          signatureType: "typed" as const,
          signatureData: director.fullName,
          signerName: director.fullName,
        },
      });

      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response?.data
              ?.error || "Registration failed. Please try again.";
      setSubmitError(message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.successScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successCard}>
            <View style={styles.successIconWrap}>
              <MaterialCommunityIcons name="check-circle" size={64} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>Registration Submitted!</Text>
            <Text style={styles.successBody}>
              Your account has been created and is pending admin approval. You
              will receive an email once your account has been approved.
            </Text>
            <View style={styles.successDivider} />
            <View style={styles.successDetail}>
              <MaterialCommunityIcons name="email-outline" size={20} color={Colors.accent} />
              <Text style={styles.successDetailText}>{account.email}</Text>
            </View>
            <View style={styles.successDetail}>
              <MaterialCommunityIcons name="domain" size={20} color={Colors.accent} />
              <Text style={styles.successDetailText}>{business.companyName}</Text>
            </View>
            <ActionButton
              label="Back to Sign In"
              onPress={() => router.replace("/(auth)/login")}
              style={{ marginTop: Spacing["2xl"] }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Main Render ──
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
          {/* Header with back button */}
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.accent} />
              <Text style={styles.backText}>{step === 0 ? "Sign In" : "Back"}</Text>
            </Pressable>
          </View>

          {/* Step Indicator */}
          <StepIndicator current={step} total={TOTAL_STEPS} />

          {/* Form Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {step === 0 && (
              <StepCompany
                business={business}
                setBusiness={setBusiness}
                errors={errors}
                setErrors={setErrors}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                showResults={showResults}
                setShowResults={setShowResults}
                searchHook={searchHook}
                onSelectCompany={selectCompany}
              />
            )}
            {step === 1 && (
              <StepDirector
                director={director}
                setDirector={setDirector}
                errors={errors}
                setErrors={setErrors}
              />
            )}
            {step === 2 && (
              <StepAccount
                account={account}
                setAccount={setAccount}
                errors={errors}
                setErrors={setErrors}
              />
            )}
            {step === 3 && (
              <StepReview
                business={business}
                director={director}
                account={account}
                agreed={agreed}
                setAgreed={setAgreed}
                errors={errors}
                setErrors={setErrors}
                submitError={submitError}
              />
            )}
          </Animated.View>

          {/* Navigation Buttons */}
          <View style={styles.navRow}>
            {step > 0 && (
              <ActionButton
                label="Back"
                onPress={handleBack}
                variant="outline"
                style={styles.navButtonBack}
              />
            )}
            {step < TOTAL_STEPS - 1 ? (
              <ActionButton
                label="Continue"
                onPress={handleNext}
                style={styles.navButton}
              />
            ) : (
              <ActionButton
                label="Register"
                onPress={handleSubmit}
                loading={submitting}
                style={styles.navButton}
              />
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              MMK Accountants & Business Advisors
            </Text>
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
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["5xl"],
    paddingBottom: Spacing["3xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    ...Typography.body,
    color: Colors.accent,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    ...Shadows.lg,
  },
  navRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  navButton: {
    flex: 1,
  },
  navButtonBack: {
    flex: 0.5,
  },
  successScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing["5xl"],
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    alignItems: "center",
    ...Shadows.lg,
  },
  successIconWrap: {
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  successBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  successDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    width: "100%",
    marginVertical: Spacing.xl,
  },
  successDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  successDetailText: {
    ...Typography.subheadline,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  footerText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
});
