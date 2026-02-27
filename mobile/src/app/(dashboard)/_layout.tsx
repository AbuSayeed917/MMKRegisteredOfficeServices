import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/theme/colors";
import { useDashboard } from "@/hooks/useDashboard";

function AlertsBadge({ color, size }: { color: string; size: number }) {
  const { data } = useDashboard();
  const unread = data?.notifications?.filter((n: { isRead: boolean }) => !n.isRead).length ?? 0;

  return (
    <View>
      <MaterialCommunityIcons name="bell" size={size} color={color} />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? "9+" : unread}</Text>
        </View>
      )}
    </View>
  );
}

/** iOS 26 glass tab bar background */
function GlassTabBar() {
  return (
    <BlurView
      intensity={80}
      tint="systemChromeMaterial"
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.glassOverlay} />
    </BlurView>
  );
}

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          backgroundColor: "transparent",
          elevation: 0,
        },
        tabBarBackground: () => <GlassTabBar />,
        tabBarLabelStyle: {
          ...Typography.caption2,
          marginTop: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="square-rounded" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="credit-card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agreement"
        options={{
          title: "Agreement",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => <AlertsBadge color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden screens — accessible via router.push but not shown in tab bar */}
      <Tabs.Screen
        name="verify-email"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="agreement-view"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

// Import Typography for tab labels
import { Typography } from "@/theme/spacing";

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -3,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.glassUltraThin,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.separator,
  },
});
