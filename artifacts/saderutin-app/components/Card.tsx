import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

export function Card({ children, style, padded = true }: { children: React.ReactNode; style?: ViewStyle; padded?: boolean }) {
  const c = useColors();
  return (
    <View style={[
      styles.card,
      { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius },
      padded && styles.padded,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
  padded: { padding: 16 },
});
