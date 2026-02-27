import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Animated,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { GradientButton } from "@/components/ui/GradientButton";
import { api } from "@/lib/api";
import {
  useCompaniesHouseSearch,
  CompanySearchResult,
} from "@/hooks/useCompaniesHouseSearch";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────
interface BusinessData {
  companyName: string;
  companyNumber: string;
  companyType: string;
  incorporationDate: string;
  registeredAddress: string;
  tradingAddress: string;
  phone: string;
}

interface DirectorData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  dateOfBirth: string;
  residentialAddress: string;
}

interface AccountData {
  email: string;
  password: string;
  confirmPassword: string;
}

const TOTAL_STEPS = 4;

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────
function formatCompanyType(type: string): string {
  const map: Record<string, string> = {
    ltd: "Private Limited",
    "private-limited-guarant-nsc": "Private Limited by Guarantee",
    "private-limited-guarant-nsc-limited-exemption":
      "Private Limited by Guarantee (Exempt)",
    plc: "Public Limited Company",
    llp: "Limited Liability Partnership",
  };
  return map[type] || type.replace(/-/g, " ");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDateOfBirth(dob: string): boolean {
  // Accept DD/MM/YYYY format
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dob);
}

// ────────────────────────────────────────────────────────────────────
// Step Indicator
// ────────────────────────────────────────────────────────────────────
function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const labels = ["Company", "Director", "Account", "Review"];
  return (
    <View style={siStyles.container}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <View key={i} style={siStyles.stepWrapper}>
            {/* Connector line (before step, except first) */}
            {i > 0 && (
              <View
                style={[
                  siStyles.line,
                  { backgroundColor: i <= current ? Colors.accent : Colors.fill },
                ]}
              />
            )}
            {/* Circle */}
            <View
              style={[
                siStyles.circle,
                isCompleted && siStyles.circleCompleted,
                isActive && siStyles.circleActive,
                !isCompleted && !isActive && siStyles.circleInactive,
              ]}
            >
              {isCompleted ? (
                <MaterialCommunityIcons
                  name="check"
                  size={14}
                  color={Colors.white}
                />
              ) : (
                <Text
                  style={[
                    siStyles.circleText,
                    isActive && siStyles.circleTextActive,
                  ]}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            {/* Label */}
            <Text
              style={[
                siStyles.label,
                (isActive || isCompleted) && siStyles.labelActive,
              ]}
            >
              {labels[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const siStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  stepWrapper: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  line: {
    position: "absolute",
    top: 14,
    right: "50%",
    left: undefined,
    width: "100%",
    height: 2,
    borderRadius: 1,
    zIndex: -1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  circleCompleted: {
    backgroundColor: Colors.accent,
  },
  circleActive: {
    backgroundColor: Colors.accent,
    ...Shadows.glow,
  },
  circleInactive: {
    backgroundColor: Colors.fill,
  },
  circleText: {
    ...Typography.caption1,
    fontWeight: "600",
    color: Colors.textLight,
  },
  circleTextActive: {
    color: Colors.white,
  },
  label: {
    ...Typography.caption2,
    color: Colors.textLight,
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: "600",
  },
});

// ────────────────────────────────────────────────────────────────────
// Main Screen
// ────────────────────────────────────────────────────────────────────
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 4 — Agreement
  const [agreed, setAgreed] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    // Only sync when moving to step 3 if account email is still empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ────────────────────────────────────────────────────────────────
  // Validation
  // ────────────────────────────────────────────────────────────────
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
      // Pre-fill account email from director
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

  // ────────────────────────────────────────────────────────────────
  // Success Screen
  // ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.successScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successCard}>
            <View style={styles.successIconWrap}>
              <MaterialCommunityIcons
                name="check-circle"
                size={64}
                color={Colors.success}
              />
            </View>
            <Text style={styles.successTitle}>Registration Submitted!</Text>
            <Text style={styles.successBody}>
              Your account has been created and is pending admin approval. You
              will receive an email once your account has been approved.
            </Text>
            <View style={styles.successDivider} />
            <View style={styles.successDetail}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={Colors.accent}
              />
              <Text style={styles.successDetailText}>{account.email}</Text>
            </View>
            <View style={styles.successDetail}>
              <MaterialCommunityIcons
                name="domain"
                size={20}
                color={Colors.accent}
              />
              <Text style={styles.successDetailText}>
                {business.companyName}
              </Text>
            </View>
            <GradientButton
              label="Back to Sign In"
              onPress={() => router.replace("/(auth)/login")}
              style={{ marginTop: Spacing["2xl"] }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // Step Renderers
  // ────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Company Details</Text>
      <Text style={styles.stepDescription}>
        Search for your company or enter details manually.
      </Text>

      {/* Search bar */}
      <TextInput
        label="Search Companies House"
        value={searchQuery}
        onChangeText={handleSearchChange}
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        outlineStyle={styles.inputOutline}
        style={styles.input}
        left={<TextInput.Icon icon="magnify" color={Colors.textLight} />}
        right={
          searchQuery ? (
            <TextInput.Icon
              icon="close"
              color={Colors.textLight}
              onPress={() => {
                setSearchQuery("");
                setShowResults(false);
                searchHook.clear();
              }}
            />
          ) : undefined
        }
        theme={{ roundness: Radius.sm }}
      />

      {/* Search results */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {searchHook.loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}
          {searchHook.error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color={Colors.error}
              />
              <Text style={styles.errorText}>{searchHook.error}</Text>
            </View>
          ) : null}
          {!searchHook.loading && searchHook.results.length > 0 && (
            <FlatList
              data={searchHook.results}
              keyExtractor={(item) => item.company_number}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selectCompany(item)}
                  style={({ pressed }) => [
                    styles.resultItem,
                    pressed && styles.resultItemPressed,
                  ]}
                >
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultName} numberOfLines={1}>
                      {item.company_name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.company_status === "active"
                              ? "rgba(52, 199, 89, 0.12)"
                              : "rgba(255, 59, 48, 0.08)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.company_status === "active"
                                ? Colors.success
                                : Colors.error,
                          },
                        ]}
                      >
                        {item.company_status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.resultDetail}>
                    {item.company_number} &middot;{" "}
                    {formatCompanyType(item.company_type)}
                  </Text>
                  {item.address_snippet ? (
                    <Text style={styles.resultAddress} numberOfLines={1}>
                      {item.address_snippet}
                    </Text>
                  ) : null}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.resultSep} />}
            />
          )}
          {!searchHook.loading &&
            searchHook.results.length === 0 &&
            !searchHook.error &&
            searchQuery.length >= 2 && (
              <Text style={styles.noResults}>No companies found</Text>
            )}
        </View>
      )}

      {/* Manual entry / auto-filled fields */}
      <View style={styles.fieldGap} />
      <View style={styles.inputGroup}>
        <TextInput
          label="Company Name *"
          value={business.companyName}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, companyName: t }));
            setErrors((e) => ({ ...e, companyName: "" }));
          }}
          mode="outlined"
          outlineColor={errors.companyName ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="domain" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
        {errors.companyName ? (
          <Text style={styles.fieldError}>{errors.companyName}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Company Number *"
          value={business.companyNumber}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, companyNumber: t }));
            setErrors((e) => ({ ...e, companyNumber: "" }));
          }}
          mode="outlined"
          outlineColor={errors.companyNumber ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="pound" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
        {errors.companyNumber ? (
          <Text style={styles.fieldError}>{errors.companyNumber}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Company Type"
          value={business.companyType}
          onChangeText={(t) =>
            setBusiness((p) => ({ ...p, companyType: t }))
          }
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="tag-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Registered Address *"
          value={business.registeredAddress}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, registeredAddress: t }));
            setErrors((e) => ({ ...e, registeredAddress: "" }));
          }}
          mode="outlined"
          outlineColor={
            errors.registeredAddress ? Colors.error : Colors.separator
          }
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          multiline
          left={
            <TextInput.Icon icon="map-marker-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
        {errors.registeredAddress ? (
          <Text style={styles.fieldError}>{errors.registeredAddress}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Trading Address (optional)"
          value={business.tradingAddress}
          onChangeText={(t) =>
            setBusiness((p) => ({ ...p, tradingAddress: t }))
          }
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="store-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Business Phone (optional)"
          value={business.phone}
          onChangeText={(t) => setBusiness((p) => ({ ...p, phone: t }))}
          keyboardType="phone-pad"
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="phone-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Director Details</Text>
      <Text style={styles.stepDescription}>
        Enter the details of the company director.
      </Text>

      <View style={styles.inputGroup}>
        <TextInput
          label="Full Name *"
          value={director.fullName}
          onChangeText={(t) => {
            setDirector((p) => ({ ...p, fullName: t }));
            setErrors((e) => ({ ...e, fullName: "" }));
          }}
          mode="outlined"
          outlineColor={errors.fullName ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          autoCapitalize="words"
          left={
            <TextInput.Icon icon="account-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
        {errors.fullName ? (
          <Text style={styles.fieldError}>{errors.fullName}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Email *"
          value={director.email}
          onChangeText={(t) => {
            setDirector((p) => ({ ...p, email: t }));
            setErrors((e) => ({ ...e, directorEmail: "" }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          mode="outlined"
          outlineColor={errors.directorEmail ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="email-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
        {errors.directorEmail ? (
          <Text style={styles.fieldError}>{errors.directorEmail}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Phone (optional)"
          value={director.phone}
          onChangeText={(t) =>
            setDirector((p) => ({ ...p, phone: t }))
          }
          keyboardType="phone-pad"
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="phone-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Position (optional)"
          value={director.position}
          onChangeText={(t) =>
            setDirector((p) => ({ ...p, position: t }))
          }
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="briefcase-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Date of Birth * (DD/MM/YYYY)"
          value={director.dateOfBirth}
          onChangeText={(t) => {
            setDirector((p) => ({ ...p, dateOfBirth: t }));
            setErrors((e) => ({ ...e, dateOfBirth: "" }));
          }}
          keyboardType="numbers-and-punctuation"
          mode="outlined"
          outlineColor={errors.dateOfBirth ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={
            <TextInput.Icon icon="calendar-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
        {errors.dateOfBirth ? (
          <Text style={styles.fieldError}>{errors.dateOfBirth}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Residential Address (optional)"
          value={director.residentialAddress}
          onChangeText={(t) =>
            setDirector((p) => ({ ...p, residentialAddress: t }))
          }
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          multiline
          left={
            <TextInput.Icon icon="home-outline" color={Colors.textLight} />
          }
          theme={{ roundness: Radius.sm }}
        />
      </View>
    </View>
  );

  const renderStep3 = () => {
    const passwordReqs = [
      { label: "At least 8 characters", met: account.password.length >= 8 },
      { label: "Contains a number", met: /\d/.test(account.password) },
      {
        label: "Contains uppercase letter",
        met: /[A-Z]/.test(account.password),
      },
    ];

    return (
      <View>
        <Text style={styles.stepTitle}>Account Setup</Text>
        <Text style={styles.stepDescription}>
          Create your login credentials. You can use the same email as the
          director or a different one.
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            label="Account Email *"
            value={account.email}
            onChangeText={(t) => {
              setAccount((p) => ({ ...p, email: t }));
              setErrors((e) => ({ ...e, accountEmail: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            mode="outlined"
            outlineColor={errors.accountEmail ? Colors.error : Colors.separator}
            activeOutlineColor={Colors.accent}
            outlineStyle={styles.inputOutline}
            style={styles.input}
            left={
              <TextInput.Icon icon="email-outline" color={Colors.textLight} />
            }
            theme={{ roundness: Radius.sm }}
          />
          {errors.accountEmail ? (
            <Text style={styles.fieldError}>{errors.accountEmail}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            label="Password *"
            value={account.password}
            onChangeText={(t) => {
              setAccount((p) => ({ ...p, password: t }));
              setErrors((e) => ({ ...e, password: "" }));
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            mode="outlined"
            outlineColor={errors.password ? Colors.error : Colors.separator}
            activeOutlineColor={Colors.accent}
            outlineStyle={styles.inputOutline}
            style={styles.input}
            left={
              <TextInput.Icon icon="lock-outline" color={Colors.textLight} />
            }
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off-outline" : "eye-outline"}
                color={Colors.textLight}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            theme={{ roundness: Radius.sm }}
          />
          {errors.password ? (
            <Text style={styles.fieldError}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Password requirements */}
        {account.password.length > 0 && (
          <View style={styles.reqsContainer}>
            {passwordReqs.map((req) => (
              <View key={req.label} style={styles.reqRow}>
                <MaterialCommunityIcons
                  name={req.met ? "check-circle" : "circle-outline"}
                  size={16}
                  color={req.met ? Colors.success : Colors.textLight}
                />
                <Text
                  style={[
                    styles.reqText,
                    req.met && styles.reqTextMet,
                  ]}
                >
                  {req.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.inputGroup}>
          <TextInput
            label="Confirm Password *"
            value={account.confirmPassword}
            onChangeText={(t) => {
              setAccount((p) => ({ ...p, confirmPassword: t }));
              setErrors((e) => ({ ...e, confirmPassword: "" }));
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            mode="outlined"
            outlineColor={
              errors.confirmPassword ? Colors.error : Colors.separator
            }
            activeOutlineColor={Colors.accent}
            outlineStyle={styles.inputOutline}
            style={styles.input}
            left={
              <TextInput.Icon icon="lock-check-outline" color={Colors.textLight} />
            }
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                color={Colors.textLight}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            theme={{ roundness: Radius.sm }}
          />
          {errors.confirmPassword ? (
            <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepDescription}>
        Please review your details before submitting.
      </Text>

      {/* Company summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <MaterialCommunityIcons
            name="domain"
            size={18}
            color={Colors.accent}
          />
          <Text style={styles.reviewLabel}>Company</Text>
        </View>
        <View style={styles.reviewBody}>
          <ReviewRow label="Name" value={business.companyName} />
          <ReviewRow label="Number" value={business.companyNumber} />
          {business.companyType ? (
            <ReviewRow label="Type" value={business.companyType} />
          ) : null}
          <ReviewRow label="Address" value={business.registeredAddress} />
          {business.tradingAddress ? (
            <ReviewRow label="Trading" value={business.tradingAddress} />
          ) : null}
        </View>
      </View>

      {/* Director summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <MaterialCommunityIcons
            name="account-outline"
            size={18}
            color={Colors.accent}
          />
          <Text style={styles.reviewLabel}>Director</Text>
        </View>
        <View style={styles.reviewBody}>
          <ReviewRow label="Name" value={director.fullName} />
          <ReviewRow label="Email" value={director.email} />
          {director.phone ? (
            <ReviewRow label="Phone" value={director.phone} />
          ) : null}
          {director.position ? (
            <ReviewRow label="Position" value={director.position} />
          ) : null}
          <ReviewRow label="DOB" value={director.dateOfBirth} />
        </View>
      </View>

      {/* Account summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <MaterialCommunityIcons
            name="shield-account-outline"
            size={18}
            color={Colors.accent}
          />
          <Text style={styles.reviewLabel}>Account</Text>
        </View>
        <View style={styles.reviewBody}>
          <ReviewRow label="Email" value={account.email} />
          <ReviewRow label="Password" value="********" />
        </View>
      </View>

      {/* Agreement */}
      <Pressable
        onPress={() => {
          setAgreed((a) => !a);
          setErrors((e) => ({ ...e, agreement: "" }));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={styles.agreementRow}
      >
        <MaterialCommunityIcons
          name={agreed ? "checkbox-marked" : "checkbox-blank-outline"}
          size={24}
          color={
            errors.agreement
              ? Colors.error
              : agreed
                ? Colors.accent
                : Colors.textLight
          }
        />
        <Text style={styles.agreementText}>
          I agree to the{" "}
          <Text style={styles.agreementLink}>Terms of Service</Text> and{" "}
          <Text style={styles.agreementLink}>Privacy Policy</Text>
        </Text>
      </Pressable>
      {errors.agreement ? (
        <Text style={[styles.fieldError, { marginLeft: Spacing["3xl"] }]}>
          {errors.agreement}
        </Text>
      ) : null}

      {/* Submit error */}
      {submitError ? (
        <View style={[styles.errorBox, { marginTop: Spacing.lg }]}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={18}
            color={Colors.error}
          />
          <Text style={styles.errorText}>{submitError}</Text>
        </View>
      ) : null}
    </View>
  );

  // ────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────
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
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={12}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={Colors.accent}
              />
              <Text style={styles.backText}>
                {step === 0 ? "Sign In" : "Back"}
              </Text>
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
            {step === 0 && renderStep1()}
            {step === 1 && renderStep2()}
            {step === 2 && renderStep3()}
            {step === 3 && renderStep4()}
          </Animated.View>

          {/* Navigation Buttons */}
          <View style={styles.navRow}>
            {step > 0 && (
              <GradientButton
                label="Back"
                onPress={handleBack}
                variant="outline"
                style={styles.navButtonBack}
              />
            )}
            {step < TOTAL_STEPS - 1 ? (
              <GradientButton
                label="Continue"
                onPress={handleNext}
                style={styles.navButton}
              />
            ) : (
              <GradientButton
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

// ────────────────────────────────────────────────────────────────────
// Review Row component
// ────────────────────────────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={reviewStyles.row}>
      <Text style={reviewStyles.label}>{label}</Text>
      <Text style={reviewStyles.value}>{value}</Text>
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  label: {
    ...Typography.footnote,
    color: Colors.textLight,
    flex: 1,
  },
  value: {
    ...Typography.footnote,
    fontWeight: "500",
    color: Colors.textPrimary,
    flex: 2,
    textAlign: "right",
  },
});

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
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

  // ── Header ──
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

  // ── Card ──
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    ...Shadows.lg,
  },
  stepTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },

  // ── Inputs ──
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
  fieldGap: {
    height: Spacing.md,
  },
  fieldError: {
    ...Typography.caption1,
    color: Colors.error,
    marginTop: 2,
    marginLeft: Spacing.xs,
  },

  // ── Search Results ──
  resultsContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginTop: Spacing.sm,
    maxHeight: 300,
    overflow: "hidden",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  loadingText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  resultItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  resultItemPressed: {
    backgroundColor: Colors.fill,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  resultName: {
    ...Typography.headline,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  statusText: {
    ...Typography.caption2,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  resultDetail: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resultAddress: {
    ...Typography.caption1,
    color: Colors.textLight,
    marginTop: 2,
  },
  resultSep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginHorizontal: Spacing.lg,
  },
  noResults: {
    ...Typography.footnote,
    color: Colors.textLight,
    textAlign: "center",
    padding: Spacing.xl,
  },

  // ── Error Box ──
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
    fontWeight: "500",
  },

  // ── Password Reqs ──
  reqsContainer: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  reqText: {
    ...Typography.caption1,
    color: Colors.textLight,
  },
  reqTextMet: {
    color: Colors.success,
  },

  // ── Review ──
  reviewSection: {
    marginBottom: Spacing.lg,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reviewLabel: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  reviewBody: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },

  // ── Agreement ──
  agreementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  agreementText: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    flex: 1,
    marginTop: 2,
  },
  agreementLink: {
    color: Colors.accent,
    fontWeight: "600",
  },

  // ── Navigation ──
  navRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  navButton: {
    flex: 1,
  },
  navButtonFull: {
    flex: 1,
  },
  navButtonBack: {
    flex: 0.5,
  },

  // ── Success ──
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
