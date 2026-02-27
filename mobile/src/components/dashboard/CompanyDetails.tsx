import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import type { BusinessProfile } from "@/types/api";

interface CompanyDetailsProps {
  business: BusinessProfile | null;
}

interface DetailRowConfig {
  icon: string;
  label: string;
  value?: string | null;
  color?: string;
}

function DetailRow({
  icon,
  label,
  value,
  color = Colors.accent,
  isLast = false,
}: DetailRowConfig & { isLast?: boolean }) {
  if (!value) return null;
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={[styles.iconRect, { backgroundColor: color + "1F" }]}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={17}
          color={color}
        />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={3}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export function CompanyDetails({ business }: CompanyDetailsProps) {
  if (!business) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="office-building-outline"
          size={40}
          color={Colors.textLight}
        />
        <Text style={styles.emptyText}>No company details available</Text>
      </View>
    );
  }

  // Collect detail rows to figure out which is last
  const details: DetailRowConfig[] = [
    {
      icon: "domain",
      label: "Company",
      value: business.companyName,
      color: Colors.accent,
    },
    {
      icon: "pound",
      label: "CRN",
      value: business.crn,
      color: Colors.indigo,
    },
    {
      icon: "briefcase-outline",
      label: "Company Type",
      value: business.companyType,
      color: Colors.purple,
    },
    {
      icon: "office-building-marker",
      label: "Registered Office",
      value: business.registeredAddress,
      color: Colors.success,
    },
    {
      icon: "map-marker-outline",
      label: "Trading Address",
      value: business.tradingAddress,
      color: Colors.warning,
    },
    {
      icon: "phone-outline",
      label: "Phone",
      value: business.phone,
      color: Colors.teal,
    },
  ].filter((d) => d.value);

  return (
    <View style={styles.container}>
      {details.map((detail, index) => (
        <DetailRow
          key={detail.label}
          icon={detail.icon}
          label={detail.label}
          value={detail.value}
          color={detail.color}
          isLast={index === details.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    ...Shadows.sm,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  iconRect: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginBottom: 2,
  },
  rowValue: {
    ...Typography.subheadline,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
});
