import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { Routine } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";

export function RoutineCard({ routine }: { routine: Routine }) {
  const c = useColors();
  const { lowEnergy } = useApp();
  const steps = lowEnergy ? routine.steps.filter(s => s.includeInMinimum) : routine.steps;
  const totalMin = steps.reduce((a, s) => a + s.minutes, 0);

  return (
    <Pressable onPress={() => router.push({ pathname: "/routine-form", params: { id: routine.id } })} style={({ pressed }) => [styles.card, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.headerRow}>
        <View style={[styles.tagDot, { backgroundColor: c.accent }]} />
        <Text style={[styles.timeTag, { color: c.mutedForeground }]}>{routine.timeOfDay}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.minutes, { color: c.mutedForeground }]}>~{totalMin} min</Text>
      </View>
      <Text style={[styles.title, { color: c.foreground }]}>{routine.name}</Text>
      <View style={styles.stepList}>
        {steps.slice(0, 5).map((s, i) => (
          <View key={s.id} style={styles.stepRow}>
            <Text style={[styles.stepNum, { color: c.mutedForeground }]}>{i + 1}.</Text>
            <Text style={[styles.stepName, { color: c.foreground }]} numberOfLines={1}>{s.name}</Text>
            <Text style={[styles.stepMin, { color: c.mutedForeground }]}>{s.minutes}m</Text>
          </View>
        ))}
        {steps.length > 5 ? <Text style={[styles.more, { color: c.mutedForeground }]}>+{steps.length - 5} more</Text> : null}
        {steps.length === 0 ? <Text style={[styles.more, { color: c.mutedForeground }]}>No steps yet · tap to add</Text> : null}
      </View>
      <View style={styles.footer}>
        <Feather name="edit-2" size={14} color={c.mutedForeground} />
        <Text style={[styles.footerText, { color: c.mutedForeground }]}>Edit routine</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 8, borderWidth: StyleSheet.hairlineWidth },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tagDot: { height: 8, width: 8, borderRadius: 4 },
  timeTag: { fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  minutes: { fontFamily: "Inter_500Medium", fontSize: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 18 },
  stepList: { gap: 6, marginTop: 4 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepNum: { fontFamily: "Inter_500Medium", fontSize: 13, width: 18 },
  stepName: { fontFamily: "Inter_400Regular", fontSize: 14, flex: 1 },
  stepMin: { fontFamily: "Inter_400Regular", fontSize: 12 },
  more: { fontFamily: "Inter_400Regular", fontSize: 12, fontStyle: "italic" },
  footer: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  footerText: { fontFamily: "Inter_500Medium", fontSize: 12 },
});
