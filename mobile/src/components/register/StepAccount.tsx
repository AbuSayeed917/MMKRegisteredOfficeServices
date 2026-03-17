import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { AccountData } from "./types";

interface StepAccountProps {
  account: AccountData;
  setAccount: React.Dispatch<React.SetStateAction<AccountData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function StepAccount({ account, setAccount, errors, setErrors }: StepAccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordReqs = [
    { label: "At least 8 characters", met: account.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(account.password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(account.password) },
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
          left={<TextInput.Icon icon="email-outline" color={Colors.textLight} />}
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
              <Text style={[styles.reqText, req.met && styles.reqTextMet]}>
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
          outlineColor={errors.confirmPassword ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="lock-check-outline" color={Colors.textLight} />}
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
  inputGroup: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.white,
    fontSize: 14,
  },
  inputOutline: {
    borderRadius: Radius.sm,
    borderWidth: 0.5,
  },
  fieldError: {
    ...Typography.caption1,
    color: Colors.error,
    marginTop: 2,
    marginLeft: Spacing.xs,
  },
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
});
