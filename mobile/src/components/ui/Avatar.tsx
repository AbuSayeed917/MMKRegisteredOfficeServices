import { View, Text, StyleSheet } from "react-native";

type AvatarProps = {
  name?: string | null;
  email?: string | null;
  size?: number;
  color?: string;
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
  if (email) return email.substring(0, 2).toUpperCase();
  return "?";
}

// iOS 26 system colors
const avatarColors = [
  "#007AFF", "#34C759", "#FF9500", "#AF52DE", "#FF2D55",
  "#5856D6", "#00C7BE", "#32ADE6", "#FF3B30", "#5AC8FA",
];

function getColor(name?: string | null, email?: string | null): string {
  const str = name || email || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function Avatar({ name, email, size = 44, color }: AvatarProps) {
  const bgColor = color || getColor(name, email);
  const initials = getInitials(name, email);
  const fontSize = size * 0.36;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32, // iOS 26 squircle proportion
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: -0.3,
  },
});
