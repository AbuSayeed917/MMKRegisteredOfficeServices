import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { BusinessData, DirectorData, AccountData } from "./types";

interface StepReviewProps {
  business: BusinessData;
  director: DirectorData;
  account: AccountData;
  agreed: boolean;
  setAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  submitError: string;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewRowLabel}>{label}</Text>
      <Text style={styles.reviewRowValue}>{value}</Text>
    </View>
  );
}

export function StepReview({
  business,
  director,
  account,
  agreed,
  setAgreed,
  errors,
  setErrors,
  submitError,
}: StepReviewProps) {
  return (
    <View>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepDescription}>
        Please review your details before submitting.
      </Text>

      {/* Company summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <MaterialCommunityIcons name="domain" size={18} color={Colors.accent} />
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
          <MaterialCommunityIcons name="account-outline" size={18} color={Colors.accent} />
          <Text style={styles.reviewLabel}>Director</Text>
        </View>
        <View style={styles.reviewBody}>
          <ReviewRow label="Name" value={director.fullName} />
          <ReviewRow label="Email" value={director.email} />
          {director.phone ? <ReviewRow label="Phone" value={director.phone} /> : null}
          {director.position ? <ReviewRow label="Position" value={director.position} /> : null}
          <ReviewRow label="DOB" value={director.dateOfBirth} />
        </View>
      </View>

      {/* Account summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <MaterialCommunityIcons name="shield-account-outline" size={18} color={Colors.accent} />
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
          <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
          <Text style={styles.errorText}>{submitError}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  reviewRowLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    flex: 1,
  },
  reviewRowValue: {
    ...Typography.footnote,
    fontWeight: "500",
    color: Colors.textPrimary,
    flex: 2,
    textAlign: "right",
  },
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
  fieldError: {
    ...Typography.caption1,
    color: Colors.error,
    marginTop: 2,
    marginLeft: Spacing.xs,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.error + "14",
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
});
