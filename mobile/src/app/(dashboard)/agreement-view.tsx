import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "@/theme/colors";
import { Spacing, Radius, Shadows, Typography } from "@/theme/spacing";
import { api } from "@/lib/api";

interface AgreementTemplate {
  id: string;
  version: string;
  contentHtml: string;
}

/**
 * Wrap the agreement HTML in a responsive shell that
 * matches the iOS 26 design language.
 */
function wrapHtml(html: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #000000;
          padding: 16px;
          margin: 0;
          background: #FFFFFF;
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #000000;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        h1 { font-size: 22px; }
        h2 { font-size: 20px; }
        h3 { font-size: 17px; }
        p { margin: 0 0 12px 0; color: #3C3C43; }
        ul, ol { padding-left: 24px; color: #3C3C43; }
        li { margin-bottom: 6px; }
        a { color: #007AFF; text-decoration: none; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th, td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(60,60,67,0.12);
          text-align: left;
          font-size: 15px;
        }
        th { font-weight: 600; color: #000000; }
        td { color: #3C3C43; }
        hr { border: none; border-top: 1px solid rgba(60,60,67,0.12); margin: 20px 0; }
        strong { font-weight: 600; color: #000000; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;
}

export default function AgreementViewScreen() {
  const insets = useSafeAreaInsets();
  const [template, setTemplate] = useState<AgreementTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTemplate = async () => {
      try {
        const { data } = await api.get("/api/agreements/template");
        if (!cancelled) {
          setTemplate(data);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load the agreement. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchTemplate();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Flat header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={Colors.accent}
          />
          <Text style={styles.backText}>Agreement</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Service Agreement</Text>
        {template?.version && (
          <Text style={styles.versionLabel}>Version {template.version}</Text>
        )}
      </View>

      {/* Content */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading agreement...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centered}>
          <View style={styles.errorIconBg}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color={Colors.error}
            />
          </View>
          <Text style={styles.errorTitle}>Unable to Load</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.retryBtn,
              pressed && styles.retryPressed,
            ]}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      )}

      {template && !loading && (
        <View style={styles.webviewWrapper}>
          <WebView
            source={{ html: wrapHtml(template.contentHtml) }}
            style={styles.webview}
            scrollEnabled
            showsVerticalScrollIndicator
            originWhitelist={["*"]}
            javaScriptEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: Colors.accent,
  },
  headerTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  versionLabel: {
    ...Typography.footnote,
    color: Colors.textLight,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: 60,
  },
  loadingText: {
    ...Typography.subheadline,
    color: Colors.textLight,
    marginTop: Spacing.md,
  },
  errorIconBg: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.error + "14",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  errorTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  retryBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    backgroundColor: Colors.fill,
  },
  retryPressed: {
    backgroundColor: Colors.fillSecondary,
  },
  retryText: {
    ...Typography.headline,
    color: Colors.accent,
  },
  webviewWrapper: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
