import { View, Text, StyleSheet, Pressable, ActivityIndicator, FlatList } from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Typography } from "@/theme/spacing";
import { BusinessData, formatCompanyType } from "./types";
import { CompanySearchResult } from "@/hooks/useCompaniesHouseSearch";

interface StepCompanyProps {
  business: BusinessData;
  setBusiness: React.Dispatch<React.SetStateAction<BusinessData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  showResults: boolean;
  setShowResults: (v: boolean) => void;
  searchHook: {
    loading: boolean;
    error: string | null;
    results: CompanySearchResult[];
    clear: () => void;
  };
  onSelectCompany: (company: CompanySearchResult) => void;
}

export function StepCompany({
  business,
  setBusiness,
  errors,
  setErrors,
  searchQuery,
  onSearchChange,
  showResults,
  setShowResults,
  searchHook,
  onSelectCompany,
}: StepCompanyProps) {
  return (
    <View>
      <Text style={styles.stepTitle}>Company Details</Text>
      <Text style={styles.stepDescription}>
        Search for your company or enter details manually.
      </Text>

      {/* Search bar */}
      <TextInput
        label="Search Companies House"
        value={searchQuery}
        onChangeText={onSearchChange}
        mode="outlined"
        outlineColor={Colors.separator}
        activeOutlineColor={Colors.accent}
        outlineStyle={styles.inputOutline}
        style={styles.input}
        left={<TextInput.Icon icon="magnify" color={Colors.textLight} />}
        right={
          searchQuery ? (
            <TextInput.Icon
              icon="close"
              color={Colors.textLight}
              onPress={() => {
                onSearchChange("");
                setShowResults(false);
                searchHook.clear();
              }}
            />
          ) : undefined
        }
        theme={{ roundness: Radius.sm }}
      />

      {/* Search results */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {searchHook.loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}
          {searchHook.error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{searchHook.error}</Text>
            </View>
          ) : null}
          {!searchHook.loading && searchHook.results.length > 0 && (
            <FlatList
              data={searchHook.results}
              keyExtractor={(item) => item.company_number}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelectCompany(item)}
                  style={({ pressed }) => [
                    styles.resultItem,
                    pressed && styles.resultItemPressed,
                  ]}
                >
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultName} numberOfLines={1}>
                      {item.company_name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.company_status === "active"
                              ? Colors.success + "1F"
                              : Colors.error + "14",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.company_status === "active"
                                ? Colors.success
                                : Colors.error,
                          },
                        ]}
                      >
                        {item.company_status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.resultDetail}>
                    {item.company_number} &middot;{" "}
                    {formatCompanyType(item.company_type)}
                  </Text>
                  {item.address_snippet ? (
                    <Text style={styles.resultAddress} numberOfLines={1}>
                      {item.address_snippet}
                    </Text>
                  ) : null}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.resultSep} />}
            />
          )}
          {!searchHook.loading &&
            searchHook.results.length === 0 &&
            !searchHook.error &&
            searchQuery.length >= 2 && (
              <Text style={styles.noResults}>No companies found</Text>
            )}
        </View>
      )}

      {/* Manual entry / auto-filled fields */}
      <View style={styles.fieldGap} />
      <View style={styles.inputGroup}>
        <TextInput
          label="Company Name *"
          value={business.companyName}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, companyName: t }));
            setErrors((e) => ({ ...e, companyName: "" }));
          }}
          mode="outlined"
          outlineColor={errors.companyName ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="domain" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
        {errors.companyName ? (
          <Text style={styles.fieldError}>{errors.companyName}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Company Number *"
          value={business.companyNumber}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, companyNumber: t }));
            setErrors((e) => ({ ...e, companyNumber: "" }));
          }}
          mode="outlined"
          outlineColor={errors.companyNumber ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="pound" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
        {errors.companyNumber ? (
          <Text style={styles.fieldError}>{errors.companyNumber}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Company Type"
          value={business.companyType}
          onChangeText={(t) => setBusiness((p) => ({ ...p, companyType: t }))}
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="tag-outline" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Registered Address *"
          value={business.registeredAddress}
          onChangeText={(t) => {
            setBusiness((p) => ({ ...p, registeredAddress: t }));
            setErrors((e) => ({ ...e, registeredAddress: "" }));
          }}
          mode="outlined"
          outlineColor={errors.registeredAddress ? Colors.error : Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          multiline
          left={<TextInput.Icon icon="map-marker-outline" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
        {errors.registeredAddress ? (
          <Text style={styles.fieldError}>{errors.registeredAddress}</Text>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Trading Address (optional)"
          value={business.tradingAddress}
          onChangeText={(t) => setBusiness((p) => ({ ...p, tradingAddress: t }))}
          mode="outlined"
          outlineColor={Colors.separator}
          activeOutlineColor={Colors.accent}
          outlineStyle={styles.inputOutline}
          style={styles.input}
          left={<TextInput.Icon icon="store-outline" color={Colors.textLight} />}
          theme={{ roundness: Radius.sm }}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          label="Business Phone (optional)"
          value={business.phone}
          onChangeText={(t) => setBusiness((p) => ({ ...p, phone: t }))}
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
  fieldGap: {
    height: Spacing.md,
  },
  fieldError: {
    ...Typography.caption1,
    color: Colors.error,
    marginTop: 2,
    marginLeft: Spacing.xs,
  },
  resultsContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.separator,
    marginTop: Spacing.sm,
    maxHeight: 300,
    overflow: "hidden",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  loadingText: {
    ...Typography.footnote,
    color: Colors.textLight,
  },
  resultItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  resultItemPressed: {
    backgroundColor: Colors.fill,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  resultName: {
    ...Typography.headline,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  statusText: {
    ...Typography.caption2,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  resultDetail: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resultAddress: {
    ...Typography.caption1,
    color: Colors.textLight,
    marginTop: 2,
  },
  resultSep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginHorizontal: Spacing.lg,
  },
  noResults: {
    ...Typography.footnote,
    color: Colors.textLight,
    textAlign: "center",
    padding: Spacing.xl,
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
