import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { Colors } from "./colors";

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.accent,
    primaryContainer: Colors.fill,
    secondary: Colors.teal,
    secondaryContainer: Colors.fillSecondary,
    surface: Colors.white,
    surfaceVariant: Colors.bgPrimary,
    background: Colors.bgPrimary,
    error: Colors.error,
    onPrimary: Colors.white,
    onSecondary: Colors.white,
    onSurface: Colors.textPrimary,
    onSurfaceVariant: Colors.textSecondary,
    onBackground: Colors.textPrimary,
    outline: Colors.separator,
    elevation: {
      level0: "transparent",
      level1: Colors.white,
      level2: Colors.bgPrimary,
      level3: Colors.bgPrimary,
      level4: Colors.bgPrimary,
      level5: Colors.bgPrimary,
    },
  },
  roundness: 18,
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.accent,
    primaryContainer: Colors.primaryMid,
    secondary: Colors.accentLight,
    secondaryContainer: Colors.primaryLight,
    surface: Colors.cardDark,
    surfaceVariant: Colors.primaryMid,
    background: Colors.bgDark,
    error: Colors.errorDark,
    onPrimary: Colors.white,
    onSecondary: Colors.bgDark,
    onSurface: Colors.textOnDark,
    onSurfaceVariant: Colors.textLight,
    onBackground: Colors.textOnDark,
    outline: Colors.borderDark,
    elevation: {
      level0: "transparent",
      level1: Colors.cardDark,
      level2: Colors.primaryMid,
      level3: Colors.primaryMid,
      level4: Colors.primaryMid,
      level5: Colors.primaryMid,
    },
  },
  roundness: 18,
};
