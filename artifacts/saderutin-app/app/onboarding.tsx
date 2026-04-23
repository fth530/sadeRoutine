import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

export default function Onboarding() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [adhdMode, setAdhdMode] = useState(false);
  const [reminders, setReminders] = useState({ morning: true, midday: false, evening: true });

  const finish = () => {
    updateProfile({ goal, adhdMode, reminderPrefs: reminders });
    router.replace("/(tabs)");
  };

  if (!profile) return <View style={{ flex: 1 }} />;
  const total = 4;
  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: topPad }]}>
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i <= step ? c.primary : c.border }]} />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepWrap}>
            <View style={[styles.bigIcon, { backgroundColor: c.primary }]}>
              <Feather name="sun" size={36} color={c.primaryForeground} />
            </View>
            <Text style={[styles.title, { color: c.foreground }]}>Welcome, {profile.name}.</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>Let's set up SadeRutin in four small steps. Nothing here is permanent — change anything anytime.</Text>
            <View style={[styles.calloutCard, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
              <View style={styles.bullet}><Feather name="lock" size={14} color={c.primary} /><Text style={[styles.bulletText, { color: c.foreground }]}>Your data stays on this device.</Text></View>
              <View style={styles.bullet}><Feather name="heart" size={14} color={c.warm} /><Text style={[styles.bulletText, { color: c.foreground }]}>No streak guilt. No noisy nudges.</Text></View>
              <View style={styles.bullet}><Feather name="battery-charging" size={14} color={c.accent} /><Text style={[styles.bulletText, { color: c.foreground }]}>Low-energy days are first-class.</Text></View>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepWrap}>
            <View style={[styles.bigIcon, { backgroundColor: c.warm }]}>
              <Feather name="compass" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: c.foreground }]}>What's one small thing you'd like to feel?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>This is just for you — a quiet north star. Skip if you'd rather not.</Text>
            <TextInput value={goal} onChangeText={setGoal} placeholder="e.g. a calmer morning" placeholderTextColor={c.mutedForeground} multiline style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
            <View style={styles.suggestionRow}>
              {["a calmer morning","kinder to myself","one steady habit","less scattered"].map(s => (
                <Pressable key={s} onPress={() => setGoal(s)} style={({ pressed }) => [styles.suggestion, { borderColor: c.border, backgroundColor: c.card, opacity: pressed ? 0.7 : 1 }]}>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: c.foreground }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepWrap}>
            <View style={[styles.bigIcon, { backgroundColor: c.accent }]}>
              <Feather name="cloud" size={36} color={c.accentForeground} />
            </View>
            <Text style={[styles.title, { color: c.foreground }]}>Turn on ADHD mode?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>Hides streak counts, removes secondary metrics, softens nudges. Always toggleable in settings.</Text>
            <Pressable onPress={() => setAdhdMode(!adhdMode)} style={[styles.toggleRow, { borderColor: adhdMode ? c.primary : c.border, backgroundColor: c.card, borderRadius: c.radius, borderWidth: adhdMode ? 2 : StyleSheet.hairlineWidth }]}>
              <View style={[styles.toggleIcon, { backgroundColor: adhdMode ? c.primary : c.muted }]}>
                <Feather name="feather" size={18} color={adhdMode ? c.primaryForeground : c.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.toggleTitle, { color: c.foreground }]}>ADHD mode</Text>
                <Text style={[styles.toggleSub, { color: c.mutedForeground }]}>Quieter, gentler interface</Text>
              </View>
              <Switch value={adhdMode} onValueChange={setAdhdMode} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepWrap}>
            <View style={[styles.bigIcon, { backgroundColor: c.primary }]}>
              <Feather name="bell" size={36} color={c.primaryForeground} />
            </View>
            <Text style={[styles.title, { color: c.foreground }]}>When should we whisper?</Text>
            <Text style={[styles.sub, { color: c.mutedForeground }]}>Pick the moments that feel useful. None of these are loud.</Text>
            {([
              { k: "morning", icon: "sunrise", label: "Morning", hint: "A soft start to the day" },
              { k: "midday", icon: "sun", label: "Midday", hint: "A gentle reset" },
              { k: "evening", icon: "moon", label: "Evening", hint: "A wind-down nudge" },
            ] as const).map(({ k, icon, label, hint }) => {
              const on = reminders[k];
              return (
                <Pressable key={k} onPress={() => setReminders({ ...reminders, [k]: !on })} style={[styles.toggleRow, { borderColor: on ? c.primary : c.border, backgroundColor: c.card, borderRadius: c.radius, borderWidth: on ? 2 : StyleSheet.hairlineWidth }]}>
                  <View style={[styles.toggleIcon, { backgroundColor: on ? c.primary : c.muted }]}>
                    <Feather name={icon} size={18} color={on ? c.primaryForeground : c.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.toggleTitle, { color: c.foreground }]}>{label}</Text>
                    <Text style={[styles.toggleSub, { color: c.mutedForeground }]}>{hint}</Text>
                  </View>
                  <Switch value={on} onValueChange={(v) => setReminders({ ...reminders, [k]: v })} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={({ pressed }) => [styles.btnGhost, { borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius, opacity: pressed ? 0.8 : 1 }]}>
              <Feather name="arrow-left" size={18} color={c.foreground} />
            </Pressable>
          ) : <View style={{ width: 60 }} />}
          <Pressable onPress={() => step < total - 1 ? setStep(step + 1) : finish()} style={({ pressed }) => [styles.btnPrimary, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
            <Text style={[styles.btnPrimaryText, { color: c.primaryForeground }]}>{step < total - 1 ? "Continue" : "Begin"}</Text>
            <Feather name="arrow-right" size={18} color={c.primaryForeground} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 22, gap: 16, paddingBottom: 40 },
  dots: { flexDirection: "row", gap: 6, marginBottom: 20 },
  dot: { height: 6, width: 32, borderRadius: 3 },
  stepWrap: { gap: 14 },
  bigIcon: { height: 72, width: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5, lineHeight: 32 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  input: { borderWidth: StyleSheet.hairlineWidth, padding: 14, fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 100, textAlignVertical: "top", marginTop: 8 },
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  suggestion: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  calloutCard: { padding: 16, gap: 12, borderWidth: StyleSheet.hairlineWidth, marginTop: 8 },
  bullet: { flexDirection: "row", alignItems: "center", gap: 10 },
  bulletText: { fontFamily: "Inter_500Medium", fontSize: 14, flex: 1 },
  toggleRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, marginTop: 8 },
  toggleIcon: { height: 40, width: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  toggleTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  toggleSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  btnRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 32, gap: 12 },
  btnGhost: { width: 60, height: 54, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  btnPrimary: { flex: 1, height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  btnPrimaryText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
