import { useEffect, useMemo } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";
import { Radius, Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

function SkeletonItem({ width = "100%", height = 16, borderRadius = Radius.sm, style }: SkeletonProps) {
  const opacity = useMemo(() => new Animated.Value(0.3), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: Colors.bgSection,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonItem width={40} height={40} borderRadius={Radius.md} />
        <View style={styles.cardHeaderText}>
          <SkeletonItem width="60%" height={14} />
          <SkeletonItem width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <SkeletonItem height={12} style={{ marginTop: Spacing.md }} />
      <SkeletonItem width="80%" height={12} style={{ marginTop: 6 }} />
    </View>
  );
}

export function SkeletonMetric() {
  return (
    <View style={styles.metric}>
      <SkeletonItem width={32} height={32} borderRadius={Radius.sm} />
      <SkeletonItem width="50%" height={20} style={{ marginTop: Spacing.sm }} />
      <SkeletonItem width="70%" height={12} style={{ marginTop: 4 }} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <SkeletonItem width={44} height={44} borderRadius={22} />
          <View style={styles.listItemText}>
            <SkeletonItem width="70%" height={14} />
            <SkeletonItem width="50%" height={12} style={{ marginTop: 6 }} />
          </View>
          <SkeletonItem width={60} height={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  metric: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flex: 1,
    marginHorizontal: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  listItemText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
