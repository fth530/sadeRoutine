import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp, makeId } from "@/contexts/AppContext";
import { Frequency, Habit } from "@/lib/types";
import { getTodayStr } from "@/lib/dates";

const COLORS = ["#88B4B0","#6E9E83","#9CB380","#C9A66B","#B68B6E","#7A8FA6","#9E7AB6"];
const FREQS: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "x-per-week", label: "X / week" },
];

export default function HabitForm() {
  const c = useColors();
  const params = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit, deleteHabit } = useApp();
  const existing = params.id ? habits.find(h => h.id === params.id) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [color, setColor] = useState(existing?.color ?? COLORS[0]);
  const [frequency, setFrequency] = useState<Frequency>(existing?.frequency ?? "daily");
  const [perWeek, setPerWeek] = useState(String(existing?.perWeek ?? 3));
  const [reminderTime, setReminderTime] = useState(existing?.reminderTime ?? "");
  const [minimumNote, setMinimumNote] = useState(existing?.minimumNote ?? "");

  const valid = name.trim().length > 0;

  const onSave = () => {
    if (!valid) return;
    const h: Habit = {
      id: existing?.id ?? makeId("h"),
      name: name.trim(),
      color,
      frequency,
      perWeek: frequency === "x-per-week" ? Math.max(1, Math.min(7, Number(perWeek) || 1)) : undefined,
      reminderTime: reminderTime.trim() || undefined,
      minimumNote: minimumNote.trim() || undefined,
      createdAt: existing?.createdAt ?? getTodayStr(),
    };
    if (existing) updateHabit(existing.id, h); else addHabit(h);
    router.back();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert("Remove habit?", `${existing.name} will be gone, with its history.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => { deleteHabit(existing.id); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{
        title: existing ? "Edit habit" : "New habit",
        headerStyle: { backgroundColor: c.background as string },
        headerShadowVisible: false,
        headerTintColor: c.foreground as string,
        headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        headerRight: () => (
          <Pressable onPress={onSave} disabled={!valid} hitSlop={12}>
            <Text style={{ fontFamily: "Inter_600SemiBold", color: valid ? c.primary : c.mutedForeground, fontSize: 16 }}>Save</Text>
          </Pressable>
        ),
      }} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Field label="Name">
          <TextInput value={name} onChangeText={setName} placeholder="e.g. drink water" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
        </Field>

        <Field label="Color">
          <View style={styles.colorRow}>
            {COLORS.map(co => (
              <Pressable key={co} onPress={() => setColor(co)} style={[styles.swatch, { backgroundColor: co, borderColor: color === co ? c.foreground : "transparent" }]} />
            ))}
          </View>
        </Field>

        <Field label="Frequency">
          <View style={styles.freqRow}>
            {FREQS.map(f => (
              <Pressable key={f.value} onPress={() => setFrequency(f.value)} style={[styles.freqPill, { borderColor: frequency === f.value ? c.primary : c.border, backgroundColor: frequency === f.value ? c.primary : "transparent" }]}>
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: frequency === f.value ? c.primaryForeground : c.foreground }}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
          {frequency === "x-per-week" ? (
            <TextInput value={perWeek} onChangeText={setPerWeek} keyboardType="number-pad" placeholder="3" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius, marginTop: 8, width: 100 }]} />
          ) : null}
        </Field>

        <Field label="Reminder time (optional)" hint="Free text — e.g. 8:00 or after coffee">
          <TextInput value={reminderTime} onChangeText={setReminderTime} placeholder="after lunch" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
        </Field>

        <Field label="Low-energy version" hint="What's the smallest version of this habit?">
          <TextInput value={minimumNote} onChangeText={setMinimumNote} placeholder="just one sip" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
        </Field>

        {existing ? (
          <Pressable onPress={onDelete} style={({ pressed }) => [styles.deleteBtn, { borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="trash-2" size={16} color={c.destructive} />
            <Text style={{ fontFamily: "Inter_500Medium", color: c.destructive }}>Remove habit</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: c.mutedForeground, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</Text>
      {children}
      {hint ? <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: c.mutedForeground }}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, gap: 20 },
  input: { borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 48 },
  colorRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  swatch: { height: 36, width: 36, borderRadius: 18, borderWidth: 3 },
  freqRow: { flexDirection: "row", gap: 8 },
  freqPill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  deleteBtn: { marginTop: 12, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderWidth: StyleSheet.hairlineWidth },
});
