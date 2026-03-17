import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/theme/colors";
import { Typography, Radius, Spacing } from "@/theme/spacing";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0ea5e9", "#38bdf8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoBg}
      >
        <Text style={styles.logoText}>MMK</Text>
      </LinearGradient>
      <Text style={styles.appName}>MMK Office</Text>
      <ActivityIndicator size="small" color={Colors.accent} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgPrimary,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  appName: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  spinner: {
    marginTop: Spacing.xl,
  },
  message: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
});
