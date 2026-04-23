import React from "react";
import { Alert, Platform, Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function Settings() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, exportJson, wipeAll, signOut } = useApp();
  if (!profile) return null;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const onExport = async () => {
    const json = exportJson();
    try {
      await Share.share({ message: json, title: "SadeRutin export" });
    } catch {}
  };

  const onDelete = () => {
    Alert.alert("Erase everything?", "This removes all SadeRutin data on this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Erase", style: "destructive", onPress: () => { wipeAll(); router.replace("/"); } },
    ]);
  };

  const onSignOut = () => {
    Alert.alert("Sign out?", "Your local data will be cleared. Export first if you want to keep it.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => { signOut(); router.replace("/"); } },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}>
      <ScreenHeader title="You" subtitle="Quiet, sensible defaults. Tweak anything." />

      <Section title="Profile">
        <Row label="Name" value={profile.name} />
        <Row label="Email" value={profile.email || "—"} />
        <Row label="Mode" value={profile.isDemo ? "Demo (local only)" : "Local account"} />
      </Section>

      <Section title="Calm preferences">
        <ToggleRow label="ADHD mode" hint="Hides streak counts. Softer everywhere." value={profile.adhdMode} onChange={(v) => updateProfile({ adhdMode: v })} />
        <ToggleRow label="Morning nudge" value={profile.reminderPrefs.morning} onChange={(v) => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, morning: v } })} />
        <ToggleRow label="Midday nudge" value={profile.reminderPrefs.midday} onChange={(v) => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, midday: v } })} />
        <ToggleRow label="Evening nudge" value={profile.reminderPrefs.evening} onChange={(v) => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, evening: v } })} />
      </Section>

      <Section title="Your data">
        <ActionRow label="Export as JSON" icon="download" onPress={onExport} />
        <ActionRow label="Delete all my data" icon="trash-2" onPress={onDelete} destructive />
      </Section>

      <Section title="More">
        <ActionRow label="Pricing" icon="tag" onPress={() => router.push("/pricing")} />
        <ActionRow label="Sign out" icon="log-out" onPress={onSignOut} />
      </Section>

      <Text style={[styles.foot, { color: c.mutedForeground }]}>SadeRutin · made with care</Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>{title.toUpperCase()}</Text>
      <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
        {children}
      </View>
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  const c = useColors();
  return (
    <View style={[styles.row, { borderColor: c.border }]}>
      <Text style={[styles.rowLabel, { color: c.foreground }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: c.mutedForeground }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}
function ToggleRow({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  const c = useColors();
  return (
    <View style={[styles.row, { borderColor: c.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: c.foreground }]}>{label}</Text>
        {hint ? <Text style={[styles.rowHint, { color: c.mutedForeground }]}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.primary, false: c.border }} />
    </View>
  );
}
function ActionRow({ label, icon, onPress, destructive }: { label: string; icon: keyof typeof Feather.glyphMap; onPress: () => void; destructive?: boolean }) {
  const c = useColors();
  const color = destructive ? c.destructive : c.foreground;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderColor: c.border, opacity: pressed ? 0.6 : 1 }]}>
      <Feather name={icon} size={16} color={color} />
      <Text style={[styles.rowLabel, { color, marginLeft: 10, flex: 1 }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={c.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 22, gap: 8 },
  sectionTitle: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1.2, marginBottom: 4 },
  group: { borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 14, minHeight: 52, borderTopWidth: StyleSheet.hairlineWidth },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 14 },
  rowValue: { fontFamily: "Inter_400Regular", fontSize: 14, marginLeft: 12, flexShrink: 1, textAlign: "right" },
  rowHint: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  foot: { textAlign: "center", marginTop: 36, fontFamily: "Inter_400Regular", fontSize: 12 },
});
