import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

export function LowEnergyToggle() {
  const c = useColors();
  const { lowEnergy, setLowEnergy } = useApp();
  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync().catch(() => {}); setLowEnergy(!lowEnergy); }}
      style={({ pressed }) => [styles.btn, { backgroundColor: lowEnergy ? c.accent : c.secondary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}
    >
      <Feather name={lowEnergy ? "battery-charging" : "battery"} size={16} color={lowEnergy ? c.accentForeground : c.foreground} />
      <Text style={[styles.text, { color: lowEnergy ? c.accentForeground : c.foreground }]}>{lowEnergy ? "Low-energy mode on" : "Low-energy mode"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, alignSelf: "flex-start" },
  text: { fontFamily: "Inter_500Medium", fontSize: 13 },
});
