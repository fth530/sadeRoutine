import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function PrimaryButton({ label, onPress, variant = "primary", disabled, loading, icon, style, testID }: Props) {
  const c = useColors();
  const palette: Record<string, { bg: string; fg: string; border: string }> = {
    primary: { bg: c.primary, fg: c.primaryForeground, border: c.primary },
    secondary: { bg: c.secondary, fg: c.secondaryForeground, border: c.border },
    ghost: { bg: "transparent", fg: c.foreground, border: c.border },
    destructive: { bg: "transparent", fg: c.destructive, border: c.border },
  };
  const p = palette[variant];
  const handle = () => {
    if (disabled || loading) return;
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };
  return (
    <Pressable
      testID={testID}
      onPress={handle}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: p.bg, borderColor: p.border, borderRadius: c.radius, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={p.fg} /> : (
        <View style={styles.row}>
          {icon}
          <Text style={[styles.label, { color: p.fg }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 52, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
