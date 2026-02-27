/**
 * iOS 26 Style Header — Clean, no gradient.
 * Apple uses flat backgrounds with large bold titles.
 */
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";
import { Typography, Spacing } from "@/theme/spacing";

type GradientHeaderProps = {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
};

export function GradientHeader({ title, subtitle, rightAction, children, compact }: GradientHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (compact ? 8 : 12) }]}>
      <View style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={compact ? styles.titleCompact : styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction && <View>{rightAction}</View>}
      </View>
      {children && <View style={styles.childContainer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bgPrimary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  titleCompact: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  childContainer: {
    marginTop: Spacing.md,
  },
});
