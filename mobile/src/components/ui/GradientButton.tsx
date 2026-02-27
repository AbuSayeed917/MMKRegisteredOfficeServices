import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Colors } from "@/theme/colors";
import { Radius, Shadows, Typography } from "@/theme/spacing";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: "accent" | "outline" | "destructive" | "glass";
  icon?: React.ReactNode;
  size?: "default" | "compact";
}

export function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  variant = "accent",
  icon,
  size = "default",
}: GradientButtonProps) {
  const isDisabled = disabled || loading;
  const isCompact = size === "compact";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Glass variant — iOS 26 frosted glass button
  if (variant === "glass") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.glassOuter,
          isCompact && styles.compact,
          pressed && styles.glassPressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        <BlurView intensity={30} tint="light" style={styles.glassBlur}>
          <View style={[styles.glassInner, isCompact && styles.compact]}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.accent} />
            ) : (
              <View style={styles.contentRow}>
                {icon}
                <Text style={styles.glassText}>{label}</Text>
              </View>
            )}
          </View>
        </BlurView>
      </Pressable>
    );
  }

  if (variant === "outline") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.outline,
          isCompact && styles.compact,
          pressed && styles.outlinePressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.accent} />
        ) : (
          <View style={styles.contentRow}>
            {icon}
            <Text style={styles.outlineText}>{label}</Text>
          </View>
        )}
      </Pressable>
    );
  }

  if (variant === "destructive") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.destructive,
          isCompact && styles.compact,
          pressed && styles.destructivePressed,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <View style={styles.contentRow}>
            {icon}
            <Text style={styles.destructiveText}>{label}</Text>
          </View>
        )}
      </Pressable>
    );
  }

  // Accent (default) — iOS system blue filled button
  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.accent,
        isCompact && styles.compact,
        pressed && styles.accentPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.contentRow}>
          {icon}
          <Text style={styles.accentText}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  // ── Accent (filled blue) ──
  accent: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.glow,
  },
  accentText: {
    color: "#fff",
    ...Typography.headline,
  },
  accentPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  // ── Glass ──
  glassOuter: {
    borderRadius: Radius.md,
    overflow: "hidden",
    ...Shadows.glass,
  },
  glassBlur: {
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  glassInner: {
    backgroundColor: Colors.glassLight,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.md,
  },
  glassText: {
    color: Colors.accent,
    ...Typography.headline,
  },
  glassPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  // ── Outline ──
  outline: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  outlineText: {
    color: Colors.accent,
    ...Typography.headline,
  },
  outlinePressed: {
    backgroundColor: Colors.fill,
    transform: [{ scale: 0.98 }],
  },
  // ── Destructive ──
  destructive: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.md,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  destructiveText: {
    color: Colors.white,
    ...Typography.headline,
  },
  destructivePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  compact: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.35,
  },
});
