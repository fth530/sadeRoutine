import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={[styles.scroll, { paddingTop: topPad + 12, paddingBottom: bottomPad + 24 }]}>
      <View style={styles.brandRow}>
        <LinearGradient colors={[c.goldStart, c.goldEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.brandDot}>
          <Feather name="sun" size={14} color="#1A1206" />
        </LinearGradient>
        <Text style={[styles.brand, { color: c.foreground }]}>SADERUTIN</Text>
      </View>

      <LinearGradient
        colors={[c.inkStart, c.inkEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroBadge}>
          <View style={[styles.badgeDot, { backgroundColor: c.goldStart }]} />
          <Text style={styles.heroEyebrow}>FOR ADHD BRAINS</Text>
        </View>
        <Text style={styles.heroTitle}>Small habits.{"\n"}Soft routines.</Text>
        <LinearGradient colors={[c.goldStart, c.goldEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.goldUnderline} />
        <Text style={styles.heroSub}>A calm companion for the days you have energy — and the ones you don't.</Text>

        <View style={styles.heroStatRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>0</Text>
            <Text style={styles.heroStatLabel}>streak shame</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>100%</Text>
            <Text style={styles.heroStatLabel}>on device</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>1-tap</Text>
            <Text style={styles.heroStatLabel}>low-energy</Text>
          </View>
        </View>
      </LinearGradient>

      <Pressable onPress={() => router.push("/auth")} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, marginTop: 4 }]}>
        <LinearGradient colors={[c.inkEnd, c.inkStart]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.cta, { borderRadius: c.radius }]}>
          <Text style={styles.ctaText}>Get started</Text>
          <Feather name="arrow-right" size={18} color="#F7F3EA" />
        </LinearGradient>
      </Pressable>
      <Pressable onPress={() => { startDemo(); router.replace("/(tabs)"); }} style={({ pressed }) => [styles.ctaSecondary, { borderColor: c.border, borderRadius: c.radius, backgroundColor: c.card, opacity: pressed ? 0.85 : 1 }]}>
        <Feather name="play-circle" size={16} color={c.primary} />
        <Text style={[styles.ctaSecondaryText, { color: c.foreground }]}>Try the demo</Text>
      </Pressable>

      <View style={styles.featureSection}>
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>WHY SADERUTIN</Text>
        <Feature c={c} icon="check-square" gold title="Habits & routines, woven together" body="Track simple habits, then weave them into morning, focus, or wind-down routines." />
        <Feature c={c} icon="battery-charging" title="Low-energy mode" body="One tap swaps your routine for its minimum version. Doing the small thing still counts." />
        <Feature c={c} icon="shield" title="Yours, only yours" body="Everything stays on your device. No accounts, no tracking, no ads." />
        <Feature c={c} icon="heart" gold title="No streak shame" body="Streaks are gentle nudges, never punishments. ADHD mode hides them entirely." />
      </View>

      <Pressable onPress={() => router.push("/pricing")} style={styles.linkRow}>
        <Text style={[styles.link, { color: c.foreground }]}>See pricing</Text>
        <View style={[styles.priceTag, { backgroundColor: c.muted, borderColor: c.border }]}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: c.primary, letterSpacing: 0.5 }}>FREE FOREVER</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

function Feature({ c, icon, title, body, gold }: { c: ReturnType<typeof useColors>; icon: keyof typeof Feather.glyphMap; title: string; body: string; gold?: boolean }) {
  return (
    <View style={[styles.feature, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
      {gold ? (
        <LinearGradient colors={[c.goldStart, c.goldEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featureIcon}>
          <Feather name={icon} size={20} color="#1A1206" />
        </LinearGradient>
      ) : (
        <LinearGradient colors={[c.inkEnd, c.inkStart]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featureIcon}>
          <Feather name={icon} size={20} color="#F7F3EA" />
        </LinearGradient>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { color: c.foreground }]}>{title}</Text>
        <Text style={[styles.featureBody, { color: c.mutedForeground }]}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 22, gap: 14 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  brandDot: { height: 28, width: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  brand: { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 2.5 },
  heroCard: { padding: 28, gap: 4, marginTop: 4, borderRadius: 28, overflow: "hidden" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 100 },
  badgeDot: { height: 6, width: 6, borderRadius: 3 },
  heroEyebrow: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.8, color: "#E8E0CC" },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 36, lineHeight: 42, letterSpacing: -1, color: "#FFFFFF", marginTop: 18 },
  goldUnderline: { height: 3, width: 56, borderRadius: 2, marginTop: 14 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, color: "rgba(241,236,221,0.78)", marginTop: 14 },
  heroStatRow: { flexDirection: "row", alignItems: "center", marginTop: 24, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255,255,255,0.12)" },
  heroStat: { flex: 1, alignItems: "flex-start" },
  heroStatNum: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFFFFF" },
  heroStatLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(241,236,221,0.6)", marginTop: 2 },
  heroDivider: { width: StyleSheet.hairlineWidth, height: 32, backgroundColor: "rgba(255,255,255,0.12)", marginHorizontal: 4 },
  cta: { minHeight: 56, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#F7F3EA" },
  ctaSecondary: { minHeight: 52, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, flexDirection: "row", gap: 8 },
  ctaSecondaryText: { fontFamily: "Inter_500Medium", fontSize: 15 },
  featureSection: { marginTop: 28, gap: 10 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, marginBottom: 4 },
  feature: { flexDirection: "row", alignItems: "flex-start", padding: 16, gap: 14, borderWidth: StyleSheet.hairlineWidth },
  featureIcon: { height: 44, width: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  featureBody: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19, marginTop: 3 },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 18 },
  link: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  priceTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, borderWidth: StyleSheet.hairlineWidth },
});
