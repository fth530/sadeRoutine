import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp, makeId } from "@/contexts/AppContext";
import { Routine, RoutineStep, TimeOfDay } from "@/lib/types";
import { getTodayStr } from "@/lib/dates";

const TIMES: TimeOfDay[] = ["morning","midday","evening","anytime"];

export default function RoutineForm() {
  const c = useColors();
  const params = useLocalSearchParams<{ id?: string }>();
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useApp();
  const existing = params.id ? routines.find(r => r.id === params.id) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(existing?.timeOfDay ?? "anytime");
  const [steps, setSteps] = useState<RoutineStep[]>(existing?.steps ?? []);

  const valid = name.trim().length > 0;

  const addStep = () => setSteps([...steps, { id: makeId("s"), name: "", minutes: 5, includeInMinimum: false }]);
  const updateStep = (i: number, patch: Partial<RoutineStep>) => setSteps(steps.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    setSteps(next);
  };

  const onSave = () => {
    if (!valid) return;
    const r: Routine = {
      id: existing?.id ?? makeId("r"),
      name: name.trim(),
      timeOfDay,
      steps: steps.filter(s => s.name.trim()),
      createdAt: existing?.createdAt ?? getTodayStr(),
    };
    if (existing) updateRoutine(existing.id, r); else addRoutine(r);
    router.back();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert("Remove routine?", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => { deleteRoutine(existing.id); router.back(); } },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{
        title: existing ? "Edit routine" : "New routine",
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
          <TextInput value={name} onChangeText={setName} placeholder="e.g. gentle morning" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
        </Field>

        <Field label="When">
          <View style={styles.timeRow}>
            {TIMES.map(t => (
              <Pressable key={t} onPress={() => setTimeOfDay(t)} style={[styles.timePill, { borderColor: timeOfDay === t ? c.primary : c.border, backgroundColor: timeOfDay === t ? c.primary : "transparent" }]}>
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: timeOfDay === t ? c.primaryForeground : c.foreground, textTransform: "capitalize" }}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Steps" hint="Tap the pill to keep a step in your low-energy version">
          <View style={{ gap: 10 }}>
            {steps.map((s, i) => (
              <View key={s.id} style={[styles.stepCard, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
                <TextInput value={s.name} onChangeText={(v) => updateStep(i, { name: v })} placeholder={`Step ${i + 1}`} placeholderTextColor={c.mutedForeground} style={[styles.stepInput, { color: c.foreground, borderColor: c.border, backgroundColor: c.background, borderRadius: 10 }]} />
                <View style={styles.stepControls}>
                  <View style={[styles.minBox, { borderColor: c.border, backgroundColor: c.background, borderRadius: 10 }]}>
                    <TextInput value={String(s.minutes)} onChangeText={(v) => updateStep(i, { minutes: Math.max(0, Number(v) || 0) })} keyboardType="number-pad" style={{ color: c.foreground, fontFamily: "Inter_500Medium", fontSize: 14, width: 32, textAlign: "center" }} />
                    <Text style={{ color: c.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}>min</Text>
                  </View>
                  <Pressable onPress={() => updateStep(i, { includeInMinimum: !s.includeInMinimum })} style={[styles.minPill, { backgroundColor: s.includeInMinimum ? c.accent : c.muted }]}>
                    <Feather name={s.includeInMinimum ? "battery-charging" : "battery"} size={12} color={s.includeInMinimum ? c.accentForeground : c.mutedForeground} />
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: s.includeInMinimum ? c.accentForeground : c.mutedForeground }}>{s.includeInMinimum ? "in low-energy" : "add to low-energy"}</Text>
                  </Pressable>
                  <Pressable onPress={() => move(i, -1)} hitSlop={8}><Feather name="chevron-up" size={18} color={c.mutedForeground} /></Pressable>
                  <Pressable onPress={() => move(i, 1)} hitSlop={8}><Feather name="chevron-down" size={18} color={c.mutedForeground} /></Pressable>
                  <Pressable onPress={() => removeStep(i)} hitSlop={8}><Feather name="x" size={18} color={c.destructive} /></Pressable>
                </View>
              </View>
            ))}
            <Pressable onPress={addStep} style={({ pressed }) => [styles.addStep, { borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.7 : 1 }]}>
              <Feather name="plus" size={16} color={c.mutedForeground} />
              <Text style={{ fontFamily: "Inter_500Medium", color: c.mutedForeground, fontSize: 14 }}>Add step</Text>
            </Pressable>
          </View>
        </Field>

        {existing ? (
          <Pressable onPress={onDelete} style={({ pressed }) => [styles.deleteBtn, { borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="trash-2" size={16} color={c.destructive} />
            <Text style={{ fontFamily: "Inter_500Medium", color: c.destructive }}>Remove routine</Text>
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
  timeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  timePill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  stepCard: { padding: 12, gap: 10, borderWidth: StyleSheet.hairlineWidth },
  stepInput: { borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingVertical: 10, fontFamily: "Inter_500Medium", fontSize: 14, minHeight: 40 },
  stepControls: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  minBox: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth },
  minPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  addStep: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" },
  deleteBtn: { marginTop: 12, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderWidth: StyleSheet.hairlineWidth },
});
