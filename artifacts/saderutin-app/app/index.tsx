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
      <Text style={[styles.brand, { color: c.primary }]}>SadeRutin</Text>
      <Text style={[styles.headline, { color: c.foreground }]}>A calm habit and routine companion, made for ADHD brains.</Text>
      <Text style={[styles.lede, { color: c.mutedForeground }]}>Build gentle daily habits and flexible routines without streak shaming, dark patterns, or noisy nudges. Low-energy days are first-class.</Text>

      <Pressable onPress={() => router.push("/auth")} style={({ pressed }) => [styles.cta, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={[styles.ctaText, { color: c.primaryForeground }]}>Get started</Text>
        <Feather name="arrow-right" size={18} color={c.primaryForeground} />
      </Pressable>
      <Pressable onPress={() => { startDemo(); router.replace("/(tabs)"); }} style={({ pressed }) => [styles.ctaSecondary, { borderColor: c.border, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={[styles.ctaSecondaryText, { color: c.foreground }]}>Try the demo</Text>
      </Pressable>

      <View style={styles.featureSection}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>WHY SADERUTIN</Text>
        <Feature c={c} icon="check-square" title="Habits and routines, together" body="Track simple habits, then weave them into flexible morning, focus, or wind-down routines." />
        <Feature c={c} icon="battery" title="Low-energy mode" body="One tap swaps your routine for its minimum version. Doing the small thing still counts." />
        <Feature c={c} icon="shield" title="Yours, only yours" body="Everything stays on your device. No accounts, no tracking, no ads. Export your data anytime." />
        <Feature c={c} icon="heart" title="No streak shame" body="Streaks are gentle nudges, never punishments. ADHD mode hides them entirely." />
      </View>

      <Pressable onPress={() => router.push("/pricing")} style={styles.linkRow}>
        <Text style={[styles.link, { color: c.accent }]}>See pricing — free forever</Text>
      </Pressable>
    </ScrollView>
  );
}

function Feature({ c, icon, title, body }: { c: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; title: string; body: string }) {
  return (
    <View style={[styles.feature, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
      <View style={[styles.featureIcon, { backgroundColor: c.muted }]}>
        <Feather name={icon} size={18} color={c.primary} />
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
  brand: { fontFamily: "Inter_600SemiBold", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" },
  headline: { fontFamily: "Inter_700Bold", fontSize: 30, lineHeight: 36, letterSpacing: -0.5, marginTop: 4 },
  lede: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 14 },
  cta: { minHeight: 54, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  ctaSecondary: { minHeight: 50, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  ctaSecondaryText: { fontFamily: "Inter_500Medium", fontSize: 15 },
  featureSection: { marginTop: 28, gap: 10 },
  sectionLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1.2, marginBottom: 4 },
  feature: { flexDirection: "row", alignItems: "flex-start", padding: 14, gap: 12, borderWidth: StyleSheet.hairlineWidth },
  featureIcon: { height: 38, width: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  featureBody: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18, marginTop: 2 },
  linkRow: { alignItems: "center", marginTop: 14 },
  link: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
