import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

export default function Landing() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, ready, startDemo } = useApp();

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.background }} />;
  if (profile) return <Redirect href="/(tabs)" />;

  const topPad = Platform.OS === "web" ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 12;

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: bottomPad + 24 }]}>
      <View style={styles.brandRow}>
        <View style={[styles.brandDot, { backgroundColor: c.primary }]}>
          <Feather name="sun" size={14} color={c.primaryForeground} />
        </View>
        <Text style={[styles.brand, { color: c.primary }]}>SadeRutin</Text>
      </View>

      <View style={[styles.heroCard, { backgroundColor: c.primary, borderRadius: 24 }]}>
        <Text style={[styles.heroEyebrow, { color: c.primaryForeground }]}>FOR ADHD BRAINS</Text>
        <Text style={[styles.heroTitle, { color: c.primaryForeground }]}>Small habits.{"\n"}Soft routines.{"\n"}No streak shame.</Text>
        <Text style={[styles.heroSub, { color: c.primaryForeground }]}>A calm companion for the days you have energy, and the ones you don't.</Text>
      </View>

      <Pressable onPress={() => router.push("/auth")} style={({ pressed }) => [styles.cta, { backgroundColor: c.foreground, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={[styles.ctaText, { color: c.background }]}>Get started</Text>
        <Feather name="arrow-right" size={18} color={c.background} />
      </Pressable>
      <Pressable onPress={() => { startDemo(); router.replace("/(tabs)"); }} style={({ pressed }) => [styles.ctaSecondary, { borderColor: c.border, borderRadius: c.radius, backgroundColor: c.card, opacity: pressed ? 0.85 : 1 }]}>
        <Feather name="play-circle" size={16} color={c.primary} />
        <Text style={[styles.ctaSecondaryText, { color: c.foreground }]}>Try the demo</Text>
      </Pressable>

      <View style={styles.featureSection}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>WHY SADERUTIN</Text>
        <Feature c={c} icon="check-square" tint={c.primary} bgTint={c.muted} title="Habits and routines, together" body="Track simple habits, then weave them into morning, focus, or wind-down routines." />
        <Feature c={c} icon="battery" tint={c.accent} bgTint={c.secondary} title="Low-energy mode" body="One tap swaps your routine for its minimum version. Doing the small thing still counts." />
        <Feature c={c} icon="shield" tint={c.warm} bgTint={c.muted} title="Yours, only yours" body="Everything stays on your device. No accounts, no tracking, no ads." />
        <Feature c={c} icon="heart" tint={c.primary} bgTint={c.secondary} title="No streak shame" body="Streaks are gentle nudges, never punishments. ADHD mode hides them entirely." />
      </View>

      <Pressable onPress={() => router.push("/pricing")} style={styles.linkRow}>
        <Text style={[styles.link, { color: c.accent }]}>See pricing — free forever</Text>
        <Feather name="arrow-right" size={14} color={c.accent} />
      </Pressable>
    </ScrollView>
  );
}

function Feature({ c, icon, title, body, tint, bgTint }: { c: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; title: string; body: string; tint: string; bgTint: string }) {
  return (
    <View style={[styles.feature, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
      <View style={[styles.featureIcon, { backgroundColor: bgTint }]}>
        <Feather name={icon} size={20} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { color: c.foreground }]}>{title}</Text>
        <Text style={[styles.featureBody, { color: c.mutedForeground }]}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 22, gap: 14 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  brandDot: { height: 28, width: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  brand: { fontFamily: "Inter_700Bold", fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase" },
  heroCard: { padding: 24, gap: 8, marginTop: 4 },
  heroEyebrow: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, opacity: 0.85 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.8, marginTop: 6 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20, marginTop: 10, opacity: 0.92 },
  cta: { minHeight: 54, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 8 },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  ctaSecondary: { minHeight: 50, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: 8 },
  ctaSecondaryText: { fontFamily: "Inter_500Medium", fontSize: 15 },
  featureSection: { marginTop: 28, gap: 10 },
  sectionLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1.2, marginBottom: 4 },
  feature: { flexDirection: "row", alignItems: "flex-start", padding: 16, gap: 14, borderWidth: StyleSheet.hairlineWidth },
  featureIcon: { height: 44, width: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  featureBody: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19, marginTop: 3 },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 },
  link: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
