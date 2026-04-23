import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function Pricing() {
  const c = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Stack.Screen options={{ title: "Pricing", headerStyle: { backgroundColor: c.background as string }, headerShadowVisible: false, headerTintColor: c.foreground as string, headerTitleStyle: { fontFamily: "Inter_600SemiBold" } }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.lede, { color: c.mutedForeground }]}>No features are paywalled. The Supporter tier is optional and exists only to fund development. You can switch tiers, cancel, or export your data at any time.</Text>

        <Tier c={c} primary name="Free" price="$0" tagline="Forever. Really." features={[
          "Unlimited habits and routines",
          "Daily check-ins, low-energy mode, ADHD mode",
          "Stats and exports",
          "Works offline, on your device",
        ]} />

        <Tier c={c} name="Supporter" price="$4 / month" tagline="Pay-what-helps. No locked features." features={[
          "Everything in Free",
          "Helps fund development and hosting",
          "Optional supporter badge",
          "Cancel anytime, no questions",
        ]} />

        <View style={[styles.promise, { backgroundColor: c.secondary, borderRadius: c.radius }]}>
          <Text style={[styles.promiseTitle, { color: c.foreground }]}>Our promise</Text>
          <Text style={[styles.promiseLine, { color: c.mutedForeground }]}>· No upsell modals, no countdown timers, no "limited offer" pressure.</Text>
          <Text style={[styles.promiseLine, { color: c.mutedForeground }]}>· No selling your data. Ever.</Text>
          <Text style={[styles.promiseLine, { color: c.mutedForeground }]}>· Clear, plain-language billing. No surprise charges.</Text>
        </View>

        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.cta, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={[styles.ctaText, { color: c.primaryForeground }]}>Got it</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Tier({ c, name, price, tagline, features, primary }: { c: ReturnType<typeof useColors>; name: string; price: string; tagline: string; features: string[]; primary?: boolean }) {
  return (
    <View style={[styles.tier, { borderColor: primary ? c.primary : c.border, backgroundColor: primary ? c.muted : c.card, borderRadius: c.radius }]}>
      <View style={styles.tierHead}>
        <Text style={[styles.tierName, { color: c.foreground }]}>{name}</Text>
        <Text style={[styles.tierPrice, { color: c.foreground }]}>{price}</Text>
      </View>
      <Text style={[styles.tierTag, { color: c.mutedForeground }]}>{tagline}</Text>
      <View style={{ gap: 8, marginTop: 12 }}>
        {features.map(f => (
          <View key={f} style={styles.featRow}>
            <Feather name="check" size={14} color={c.primary} />
            <Text style={[styles.featText, { color: c.foreground }]}>{f}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 16 },
  lede: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  tier: { padding: 18, borderWidth: StyleSheet.hairlineWidth },
  tierHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  tierName: { fontFamily: "Inter_700Bold", fontSize: 20 },
  tierPrice: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  tierTag: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 4 },
  featRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  featText: { fontFamily: "Inter_400Regular", fontSize: 14, flex: 1, lineHeight: 20 },
  promise: { padding: 16, gap: 6 },
  promiseTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  promiseLine: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  cta: { marginTop: 8, minHeight: 52, alignItems: "center", justifyContent: "center" },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
