import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";

const LABELS = ["Company", "Director", "Account", "Review"];

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <View key={i} style={styles.stepWrapper}>
            {i > 0 && (
              <View
                style={[
                  styles.line,
                  { backgroundColor: i <= current ? Colors.accent : Colors.fill },
                ]}
              />
            )}
            <View
              style={[
                styles.circle,
                isCompleted && styles.circleCompleted,
                isActive && styles.circleActive,
                !isCompleted && !isActive && styles.circleInactive,
              ]}
            >
              {isCompleted ? (
                <MaterialCommunityIcons name="check" size={14} color={Colors.white} />
              ) : (
                <Text style={[styles.circleText, isActive && styles.circleTextActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.label, (isActive || isCompleted) && styles.labelActive]}>
              {LABELS[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
