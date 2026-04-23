import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { HabitCard } from "@/components/HabitCard";
import { RoutineCard } from "@/components/RoutineCard";
import { CheckInCard } from "@/components/CheckInCard";
import { LowEnergyToggle } from "@/components/LowEnergyToggle";
import { EmptyState } from "@/components/EmptyState";
import { greeting, getTimeOfDayLabel, getTodayStr } from "@/lib/dates";
import { isHabitDueOn, isCompletedOn } from "@/lib/streaks";

export default function Today() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { profile, habits, habitLogs, routines } = useApp();
  if (!profile) return null;

  const today = getTodayStr();
  const todays = habits.filter(h => isHabitDueOn(h, today));
  const tod = getTimeOfDayLabel();
  const todayRoutine = routines.find(r => r.timeOfDay === tod) ?? routines[0];

  const done = todays.filter(h => isCompletedOn(h.id, today, habitLogs)).length;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}>
      <ScreenHeader title={greeting(profile.name)} subtitle={profile.adhdMode ? "Take it gently. One thing is enough." : `${done} of ${todays.length} done today`} />

      <View style={styles.toggleWrap}>
        <LowEnergyToggle />
      </View>

      <Section title="A check-in">
        <CheckInCard />
      </Section>

      <Section title="Today's habits">
        {todays.length === 0 ? (
          <EmptyState icon="plus-circle" title="No habits yet" subtitle="Add one from the Habits tab when you're ready." />
        ) : (
          <View style={{ gap: 10 }}>
            {todays.map(h => <HabitCard key={h.id} habit={h} hideStreak={profile.adhdMode} />)}
          </View>
        )}
      </Section>

      {todayRoutine ? (
        <Section title={`Your ${tod} routine`}>
          <RoutineCard routine={todayRoutine} />
        </Section>
      ) : null}

      <View style={styles.footer}>
        <Feather name="heart" size={14} color={c.mutedForeground} />
        <Text style={[styles.footerText, { color: c.mutedForeground }]}>You showed up. That's the win.</Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleWrap: { paddingHorizontal: 20, marginBottom: 18 },
  section: { paddingHorizontal: 20, marginTop: 22, gap: 10 },
  sectionTitle: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1.2, marginBottom: 4 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 },
  footerText: { fontFamily: "Inter_400Regular", fontSize: 12, fontStyle: "italic" },
});
