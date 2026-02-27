import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { GradientButton } from "@/components/ui/GradientButton";

export default function PaymentCancelScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="close-circle" size={56} color={Colors.warning} />
        </View>

        <Text style={styles.title}>Payment Cancelled</Text>
        <Text style={styles.message}>No charges were made to your account.</Text>

        <GradientButton
          label="Back to Dashboard"
          onPress={() => router.replace("/(dashboard)")}
          variant="outline"
          style={styles.button}
        />

        <GradientButton
          label="Try Again"
          onPress={() => router.replace("/(dashboard)/subscription")}
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
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    width: "100%",
  },
});
