import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Shadows, Spacing, Radius } from "@/theme/spacing";
import { Colors } from "@/theme/colors";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: "glass" | "elevated" | "outlined" | "filled";
  padded?: boolean;
};

export function Card({ children, style, onPress, variant = "glass", padded = true }: CardProps) {
  if (variant === "glass") {
    const inner = (
      <View style={[styles.glassOuter, style]}>
        <BlurView intensity={40} tint="light" style={styles.glassBlur}>
          <View style={[styles.glassOverlay, padded && styles.padded]}>
            {children}
          </View>
        </BlurView>
      </View>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
          {inner}
        </Pressable>
      );
    }
    return inner;
  }

  const cardStyle = [
    styles.base,
    padded && styles.padded,
    variant === "elevated" && styles.elevated,
    variant === "outlined" && styles.outlined,
    variant === "filled" && styles.filled,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    overflow: "hidden",
  },
  padded: {
    padding: Spacing.lg,
  },
  glassOuter: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.glass,
  },
  glassBlur: {
    overflow: "hidden",
    borderRadius: Radius.xl,
  },
  glassOverlay: {
    backgroundColor: Colors.glass,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  elevated: {
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.separator,
  },
  filled: {
    backgroundColor: Colors.fill,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
