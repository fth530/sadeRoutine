import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { getTodayStr } from "@/lib/dates";
import { CheckIn, Energy, Mood } from "@/lib/types";
import { Card } from "./Card";

const MOOD_LABELS = ["Rough", "Low", "Okay", "Good", "Great"];
const ENERGY_LABELS = ["Empty", "Low", "Mid", "High", "Full"];

function Picker({ values, selected, onSelect, color }: { values: string[]; selected: number | null; onSelect: (v: number) => void; color: string }) {
  const c = useColors();
  return (
    <View style={styles.pickerRow}>
      {values.map((label, i) => {
        const v = i + 1;
        const active = selected === v;
        return (
          <Pressable key={label} onPress={() => { Haptics.selectionAsync().catch(() => {}); onSelect(v); }} style={({ pressed }) => [styles.pip, { borderColor: active ? color : c.border, backgroundColor: active ? color : "transparent", opacity: pressed ? 0.8 : 1 }]}>
            <Text style={[styles.pipNum, { color: active ? "#fff" : c.foreground }]}>{v}</Text>
            <Text style={[styles.pipLabel, { color: active ? "#fff" : c.mutedForeground }]} numberOfLines={1}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CheckInCard() {
  const c = useColors();
  const { checkIns, saveCheckIn } = useApp();
  const today = getTodayStr();
  const existing = checkIns.find(x => x.date === today);
  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? null);
  const [energy, setEnergy] = useState<Energy | null>(existing?.energy ?? null);

  const canSave = mood !== null && energy !== null;
  const onSave = () => {
    if (!canSave) return;
    const c2: CheckIn = { date: today, mood: mood as Mood, energy: energy as Energy };
    saveCheckIn(c2);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <Card>
      <View style={styles.titleRow}>
        <Feather name="sun" size={16} color={c.accent} />
        <Text style={[styles.title, { color: c.foreground }]}>How are you, right now?</Text>
      </View>
      <Text style={[styles.label, { color: c.mutedForeground }]}>Mood</Text>
      <Picker values={MOOD_LABELS} selected={mood} onSelect={(v) => setMood(v as Mood)} color={c.primary} />
      <Text style={[styles.label, { color: c.mutedForeground }]}>Energy</Text>
      <Picker values={ENERGY_LABELS} selected={energy} onSelect={(v) => setEnergy(v as Energy)} color={c.accent} />
      <Pressable onPress={onSave} disabled={!canSave} style={({ pressed }) => [styles.saveBtn, { backgroundColor: c.primary, borderRadius: c.radius, opacity: !canSave ? 0.4 : pressed ? 0.85 : 1 }]}>
        <Text style={[styles.saveText, { color: c.primaryForeground }]}>{existing ? "Update check-in" : "Save check-in"}</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  label: { fontFamily: "Inter_500Medium", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 12, marginBottom: 6 },
  pickerRow: { flexDirection: "row", gap: 6 },
  pip: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 12, borderWidth: 1.5, gap: 2 },
  pipNum: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  pipLabel: { fontFamily: "Inter_400Regular", fontSize: 10 },
  saveBtn: { marginTop: 14, minHeight: 44, alignItems: "center", justifyContent: "center" },
  saveText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
});
