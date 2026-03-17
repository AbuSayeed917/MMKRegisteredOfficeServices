import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { DirectorData } from "./types";

interface StepDirectorProps {
  director: DirectorData;
  setDirector: React.Dispatch<React.SetStateAction<DirectorData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function StepDirector({ director, setDirector, errors, setErrors }: StepDirectorProps) {
  return (
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
          left={<TextInput.Icon icon="account-outline" color={Colors.textLight} />}
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
          left={<TextInput.Icon icon="email-outline" color={Colors.textLight} />}
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
          onChangeText={(t) => setDirector((p) => ({ ...p, phone: t }))}
          keyboardType="phone-pad"
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="phone-outline" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Position (optional)"
          value={director.position}
          onChangeText={(t) => setDirector((p) => ({ ...p, position: t }))}
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="briefcase-outline" color={Colors.textLight} />}
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
          left={<TextInput.Icon icon="calendar-outline" color={Colors.textLight} />}
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
          onChangeText={(t) => setDirector((p) => ({ ...p, residentialAddress: t }))}
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          multiline
          left={<TextInput.Icon icon="home-outline" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
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
});
