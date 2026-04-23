import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

export default function Onboarding() {
  const c = useColors();
  const { profile, updateProfile, addRoutine } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [adhdMode, setAdhdMode] = useState(false);
  const [reminders, setReminders] = useState({ morning: true, midday: false, evening: true });

  const finish = () => {
    updateProfile({ goal, adhdMode, reminderPrefs: reminders });
    router.replace("/(tabs)");
  };

  if (!profile) {
    return <View style={{ flex: 1 }} />;
  }

  const total = 3;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ title: "", headerShadowVisible: false, headerStyle: { backgroundColor: c.background as string }, headerTintColor: c.foreground as string }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i <= step ? c.primary : c.border }]} />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepWrap}>
            <Text style={[styles.title, { color: c.foreground }]}>What's one small thing you'd like to feel?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>This is just for you. Skip if you'd rather not.</Text>
            <TextInput value={goal} onChangeText={setGoal} placeholder="e.g. a calmer morning" placeholderTextColor={c.mutedForeground} multiline style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepWrap}>
            <Text style={[styles.title, { color: c.foreground }]}>Turn on ADHD mode?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>Hides streak counts, removes secondary metrics, and softens nudges. You can change this anytime in settings.</Text>
            <View style={[styles.toggleRow, { borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleTitle, { color: c.foreground }]}>ADHD mode</Text>
                <Text style={[styles.toggleSub, { color: c.mutedForeground }]}>Quieter, gentler interface</Text>
              </View>
              <Switch value={adhdMode} onValueChange={setAdhdMode} trackColor={{ true: c.primary, false: c.border }} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepWrap}>
            <Text style={[styles.title, { color: c.foreground }]}>When should we whisper?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>Pick the times that feel useful. None of these are loud.</Text>
            {(["morning","midday","evening"] as const).map(k => (
              <View key={k} style={[styles.toggleRow, { borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]}>
                <Text style={[styles.toggleTitle, { color: c.foreground, textTransform: "capitalize" }]}>{k}</Text>
                <Switch value={reminders[k]} onValueChange={(v) => setReminders({ ...reminders, [k]: v })} trackColor={{ true: c.primary, false: c.border }} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={({ pressed }) => [styles.btnGhost, { borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.8 : 1 }]}>
              <Feather name="arrow-left" size={18} color={c.foreground} />
            </Pressable>
          ) : <View style={{ width: 60 }} />}
          <Pressable onPress={() => step < total - 1 ? setStep(step + 1) : finish()} style={({ pressed }) => [styles.btnPrimary, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
            <Text style={[styles.btnPrimaryText, { color: c.primaryForeground }]}>{step < total - 1 ? "Next" : "Begin"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 22, gap: 16 },
  dots: { flexDirection: "row", gap: 6, marginBottom: 12 },
  dot: { height: 6, width: 32, borderRadius: 3 },
  stepWrap: { gap: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.3 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  input: { borderWidth: StyleSheet.hairlineWidth, padding: 14, fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 100, textAlignVertical: "top" },
  toggleRow: { flexDirection: "row", alignItems: "center", padding: 16, borderWidth: StyleSheet.hairlineWidth, gap: 12, marginTop: 8 },
  toggleTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  toggleSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  btnRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 32, gap: 12 },
  btnGhost: { width: 60, height: 50, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  btnPrimary: { flex: 1, height: 54, alignItems: "center", justifyContent: "center" },
  btnPrimaryText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
