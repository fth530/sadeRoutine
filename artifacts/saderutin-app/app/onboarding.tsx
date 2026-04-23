import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

const TOTAL = 4;

export default function Onboarding() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [adhdMode, setAdhdMode] = useState(false);
  const [reminders, setReminders] = useState({ morning: true, midday: false, evening: true });

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming((step + 1) / TOTAL, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const next = () => {
    Haptics.selectionAsync().catch(() => {});
    if (step < TOTAL - 1) setStep(step + 1);
    else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      updateProfile({ goal, adhdMode, reminderPrefs: reminders });
      router.replace("/(tabs)");
    }
  };
  const back = () => {
    Haptics.selectionAsync().catch(() => {});
    if (step > 0) setStep(step - 1);
  };

  if (!profile) return <View style={{ flex: 1 }} />;
  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 12;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <AmbientBackdrop c={c} stepKey={step} />

      <View style={[styles.headerBar, { paddingTop: topPad }]}>
        <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
          <Animated.View style={[styles.progressFill, progressStyle]}>
            <LinearGradient colors={[c.goldStart, c.goldEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </View>
        <Text style={[styles.stepCount, { color: c.mutedForeground }]}>{step + 1} of {TOTAL}</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 120 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 0 && <StepWelcome key="s0" c={c} name={profile.name} />}
        {step === 1 && <StepGoal key="s1" c={c} goal={goal} setGoal={setGoal} />}
        {step === 2 && <StepAdhd key="s2" c={c} adhdMode={adhdMode} setAdhdMode={setAdhdMode} />}
        {step === 3 && <StepReminders key="s3" c={c} reminders={reminders} setReminders={setReminders} />}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 12, backgroundColor: c.background, borderTopColor: c.border }]}>
        {step > 0 ? (
          <Pressable onPress={back} style={({ pressed }) => [styles.btnGhost, { borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius, opacity: pressed ? 0.75 : 1 }]}>
            <Feather name="arrow-left" size={20} color={c.foreground} />
          </Pressable>
        ) : <View style={{ width: 60 }} />}
        <Pressable onPress={next} style={({ pressed }) => [{ flex: 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <LinearGradient colors={[c.inkEnd, c.inkStart]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.btnPrimary, { borderRadius: c.radius }]}>
            <Text style={styles.btnPrimaryText}>{step < TOTAL - 1 ? "Continue" : "Begin"}</Text>
            <Feather name="arrow-right" size={18} color="#F7F3EA" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function AmbientBackdrop({ c, stepKey }: { c: ReturnType<typeof useColors>; stepKey: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);
  const blob1 = useAnimatedStyle(() => ({ transform: [{ translateX: -40 + t.value * 80 }, { translateY: -20 + t.value * 40 }, { scale: 1 + t.value * 0.15 }] }));
  const blob2 = useAnimatedStyle(() => ({ transform: [{ translateX: 60 - t.value * 80 }, { translateY: 40 - t.value * 30 }, { scale: 1.1 - t.value * 0.1 }] }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View key={`a-${stepKey}`} entering={FadeIn.duration(700)} style={[styles.blob, { top: -120, left: -100 }, blob1]}>
        <LinearGradient colors={[c.inkEnd + "55", "transparent"]} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View key={`b-${stepKey}`} entering={FadeIn.duration(700).delay(150)} style={[styles.blob, { top: 180, right: -120 }, blob2]}>
        <LinearGradient colors={[c.goldStart + "44", "transparent"]} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

function PulsingIcon({ c, icon, gold }: { c: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; gold?: boolean }) {
  const scale = useSharedValue(0.7);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 110 });
    ringScale.value = withRepeat(withSequence(
      withTiming(1.4, { duration: 1600, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 0 })
    ), -1, false);
    ringOpacity.value = withRepeat(withSequence(
      withTiming(0, { duration: 1600, easing: Easing.out(Easing.cubic) }),
      withTiming(0.6, { duration: 0 })
    ), -1, false);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ringScale.value }], opacity: ringOpacity.value }));
  const colors = gold ? [c.goldStart, c.goldEnd] as const : [c.inkEnd, c.inkStart] as const;
  const ringColor = gold ? c.goldStart : c.primary;

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[styles.ring, { borderColor: ringColor }, ringStyle]} />
      <Animated.View style={iconStyle}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bigIcon}>
          <Feather name={icon} size={36} color={gold ? "#1A1206" : "#F7F3EA"} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

function StepWelcome({ c, name }: { c: ReturnType<typeof useColors>; name: string }) {
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} style={styles.stepWrap}>
      <PulsingIcon c={c} icon="sun" />
      <Animated.Text entering={FadeInDown.delay(150).duration(550)} style={[styles.title, { color: c.foreground }]}>Welcome, {name}.</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(280).duration(550)} style={[styles.sub, { color: c.mutedForeground }]}>Let's set up SadeRutin in four small steps. Nothing here is permanent.</Animated.Text>
      <Animated.View entering={FadeInUp.delay(420).duration(600)} style={[styles.calloutCard, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
        <Bullet c={c} icon="lock" tint={c.primary} text="Your data stays on this device." delay={520} />
        <Bullet c={c} icon="heart" tint={c.warm} text="No streak guilt. No noisy nudges." delay={640} />
        <Bullet c={c} icon="battery-charging" tint={c.accent} text="Low-energy days are first-class." delay={760} />
      </Animated.View>
    </Animated.View>
  );
}

function Bullet({ c, icon, text, tint, delay }: { c: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; text: string; tint: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)} style={styles.bullet}>
      <View style={[styles.bulletIcon, { backgroundColor: tint + "22" }]}>
        <Feather name={icon} size={14} color={tint} />
      </View>
      <Text style={[styles.bulletText, { color: c.foreground }]}>{text}</Text>
    </Animated.View>
  );
}

function StepGoal({ c, goal, setGoal }: { c: ReturnType<typeof useColors>; goal: string; setGoal: (v: string) => void }) {
  const suggestions = ["a calmer morning", "kinder to myself", "one steady habit", "less scattered"];
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} style={styles.stepWrap}>
      <PulsingIcon c={c} icon="compass" gold />
      <Animated.Text entering={FadeInDown.delay(150).duration(550)} style={[styles.title, { color: c.foreground }]}>What's one small thing{"\n"}you'd like to feel?</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(280).duration(550)} style={[styles.sub, { color: c.mutedForeground }]}>A quiet north star — just for you. Skip if you'd rather not.</Animated.Text>
      <Animated.View entering={FadeInUp.delay(380).duration(550)}>
        <TextInput value={goal} onChangeText={setGoal} placeholder="e.g. a calmer morning" placeholderTextColor={c.mutedForeground} multiline style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />
      </Animated.View>
      <View style={styles.suggestionRow}>
        {suggestions.map((s, i) => (
          <Animated.View key={s} entering={FadeInUp.delay(520 + i * 90).duration(450)}>
            <Pressable onPress={() => { Haptics.selectionAsync().catch(() => {}); setGoal(s); }} style={({ pressed }) => [styles.suggestion, { borderColor: goal === s ? c.primary : c.border, backgroundColor: goal === s ? c.primary : c.card, opacity: pressed ? 0.75 : 1 }]}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: goal === s ? c.primaryForeground : c.foreground }}>{s}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

function StepAdhd({ c, adhdMode, setAdhdMode }: { c: ReturnType<typeof useColors>; adhdMode: boolean; setAdhdMode: (v: boolean) => void }) {
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} style={styles.stepWrap}>
      <PulsingIcon c={c} icon="feather" />
      <Animated.Text entering={FadeInDown.delay(150).duration(550)} style={[styles.title, { color: c.foreground }]}>Turn on{"\n"}ADHD mode?</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(280).duration(550)} style={[styles.sub, { color: c.mutedForeground }]}>Hides streak counts. Removes secondary metrics. Softens nudges. Toggle anytime in settings.</Animated.Text>
      <Animated.View entering={FadeInUp.delay(420).duration(550)}>
        <Pressable onPress={() => { Haptics.selectionAsync().catch(() => {}); setAdhdMode(!adhdMode); }} style={[styles.modeCard, { borderColor: adhdMode ? c.primary : c.border, backgroundColor: c.card, borderRadius: c.radius, borderWidth: adhdMode ? 2 : StyleSheet.hairlineWidth }]}>
          {adhdMode ? (
            <LinearGradient colors={[c.primary + "10", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          ) : null}
          <View style={[styles.modeIcon, { backgroundColor: adhdMode ? c.primary : c.muted }]}>
            <Feather name="feather" size={20} color={adhdMode ? c.primaryForeground : c.mutedForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.modeTitle, { color: c.foreground }]}>ADHD mode</Text>
            <Text style={[styles.modeSub, { color: c.mutedForeground }]}>Quieter, gentler interface throughout the app.</Text>
          </View>
          <Switch value={adhdMode} onValueChange={setAdhdMode} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function StepReminders({ c, reminders, setReminders }: { c: ReturnType<typeof useColors>; reminders: { morning: boolean; midday: boolean; evening: boolean }; setReminders: (r: { morning: boolean; midday: boolean; evening: boolean }) => void }) {
  const items = [
    { k: "morning", icon: "sunrise", label: "Morning", hint: "A soft start to the day" },
    { k: "midday", icon: "sun", label: "Midday", hint: "A gentle reset" },
    { k: "evening", icon: "moon", label: "Evening", hint: "A wind-down nudge" },
  ] as const;
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} style={styles.stepWrap}>
      <PulsingIcon c={c} icon="bell" gold />
      <Animated.Text entering={FadeInDown.delay(150).duration(550)} style={[styles.title, { color: c.foreground }]}>When should{"\n"}we whisper?</Animated.Text>
      <Animated.Text entering={FadeInDown.delay(280).duration(550)} style={[styles.sub, { color: c.mutedForeground }]}>Pick the moments that feel useful. None of these are loud.</Animated.Text>
      {items.map((it, i) => {
        const on = reminders[it.k];
        return (
          <Animated.View key={it.k} entering={FadeInUp.delay(380 + i * 110).duration(500)}>
            <Pressable onPress={() => { Haptics.selectionAsync().catch(() => {}); setReminders({ ...reminders, [it.k]: !on }); }} style={[styles.modeCard, { borderColor: on ? c.primary : c.border, backgroundColor: c.card, borderRadius: c.radius, borderWidth: on ? 2 : StyleSheet.hairlineWidth }]}>
              <View style={[styles.modeIcon, { backgroundColor: on ? c.primary : c.muted }]}>
                <Feather name={it.icon} size={20} color={on ? c.primaryForeground : c.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modeTitle, { color: c.foreground }]}>{it.label}</Text>
                <Text style={[styles.modeSub, { color: c.mutedForeground }]}>{it.hint}</Text>
              </View>
              <Switch value={on} onValueChange={(v) => setReminders({ ...reminders, [it.k]: v })} trackColor={{ true: c.primary, false: c.border }} thumbColor="#fff" />
            </Pressable>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blob: { position: "absolute", height: 360, width: 360, borderRadius: 180, overflow: "hidden" },
  headerBar: { paddingHorizontal: 22, paddingBottom: 14, gap: 8 },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2, overflow: "hidden" },
  stepCount: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  scroll: { padding: 22, gap: 16 },
  stepWrap: { gap: 14 },
  iconWrap: { alignItems: "flex-start", marginBottom: 4 },
  ring: { position: "absolute", top: 0, left: 0, height: 72, width: 72, borderRadius: 36, borderWidth: 2 },
  bigIcon: { height: 72, width: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 32, letterSpacing: -0.8, lineHeight: 38 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  input: { borderWidth: StyleSheet.hairlineWidth, padding: 14, fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 100, textAlignVertical: "top", marginTop: 6 },
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  suggestion: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, borderWidth: StyleSheet.hairlineWidth },
  calloutCard: { padding: 18, gap: 14, borderWidth: StyleSheet.hairlineWidth },
  bullet: { flexDirection: "row", alignItems: "center", gap: 12 },
  bulletIcon: { height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  bulletText: { fontFamily: "Inter_500Medium", fontSize: 14, flex: 1 },
  modeCard: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14, overflow: "hidden", marginTop: 6 },
  modeIcon: { height: 44, width: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  modeTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  modeSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 3, lineHeight: 17 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 22, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 12 },
  btnGhost: { width: 60, height: 56, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  btnPrimary: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  btnPrimaryText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#F7F3EA" },
});
