import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { GradientButton } from "@/components/ui/GradientButton";

export default function PaymentSuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="check-circle" size={56} color={Colors.success} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.amount}>£75.00 received</Text>

        <View style={styles.badge}>
          <MaterialCommunityIcons name="shield-check" size={14} color={Colors.success} />
          <Text style={styles.badgeText}>Subscription Active</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoItem}>{"\u2022"} Your registered office address is now active</Text>
          <Text style={styles.infoItem}>{"\u2022"} Mail forwarded within 2 working days</Text>
          <Text style={styles.infoItem}>{"\u2022"} View subscription details in your dashboard</Text>
          <Text style={styles.infoItem}>{"\u2022"} Confirmation email sent</Text>
        </View>

        <GradientButton
          label="Go to Dashboard"
          onPress={() => router.replace("/(dashboard)")}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  iconCircle: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  amount: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.success + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.success,
  },
  infoBox: {
    backgroundColor: Colors.accent + "0A",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    width: "100%",
  },
});
