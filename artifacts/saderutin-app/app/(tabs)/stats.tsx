import React, { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { dayShort, getPreviousWeekDays, getWeekDays } from "@/lib/dates";

export default function Stats() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { habits, habitLogs, checkIns } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const week = getWeekDays();
  const prev = getPreviousWeekDays();

  const dailyCounts = useMemo(() => week.map(d => habitLogs.filter(l => l.date === d && l.completed).length), [week.join(","), habitLogs]);
  const maxCount = Math.max(1, ...dailyCounts);
  const thisWeekTotal = dailyCounts.reduce((a, b) => a + b, 0);
  const lastWeekTotal = prev.reduce((acc, d) => acc + habitLogs.filter(l => l.date === d && l.completed).length, 0);
  const trend = thisWeekTotal - lastWeekTotal;

  const perHabit = useMemo(() => habits.map(h => ({
    name: h.name,
    color: h.color,
    count: week.reduce((a, d) => a + (habitLogs.find(l => l.habitId === h.id && l.date === d && l.completed) ? 1 : 0), 0),
  })), [habits, habitLogs, week.join(",")]);

  const checkinDays = checkIns.filter(c => week.includes(c.date)).length;

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}>
      <ScreenHeader title="Your week" subtitle="A gentle look back. No grades." />

      <View style={styles.body}>
        <View style={styles.statRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Check-offs</Text>
            <Text style={[styles.statValue, { color: c.foreground }]}>{thisWeekTotal}</Text>
            <Text style={[styles.statHint, { color: c.mutedForeground }]}>this week</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: c.mutedForeground }]}>vs last week</Text>
            <Text style={[styles.statValue, { color: c.foreground }]}>{trend >= 0 ? "+" : ""}{trend}</Text>
            <Text style={[styles.statHint, { color: c.mutedForeground }]}>{trend >= 0 ? "a little more" : "a little less"}</Text>
          </Card>
        </View>

        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Daily completions</Text>
          <View style={styles.barWrap}>
            {dailyCounts.map((n, i) => {
              const h = (n / maxCount) * 100;
              return (
                <View key={i} style={styles.barCol}>
                  <View style={[styles.barTrack, { backgroundColor: c.muted }]}>
                    <View style={{ height: `${h}%`, backgroundColor: c.primary, width: "100%", borderTopLeftRadius: 6, borderTopRightRadius: 6 }} />
                  </View>
                  <Text style={[styles.barLabel, { color: c.mutedForeground }]}>{dayShort(week[i])}</Text>
                  <Text style={[styles.barNum, { color: c.foreground }]}>{n}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Per habit</Text>
          {perHabit.length === 0 ? (
            <EmptyState icon="bar-chart-2" title="No habits yet" subtitle="Add a habit and your numbers will live here." />
          ) : (
            <View style={{ gap: 10, marginTop: 6 }}>
              {perHabit.map(p => (
                <View key={p.name} style={styles.habitRow}>
                  <View style={[styles.dot, { backgroundColor: p.color }]} />
                  <Text style={[styles.habitName, { color: c.foreground }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.habitCount, { color: c.mutedForeground }]}>{p.count}/7</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Check-ins</Text>
          <Text style={[styles.kindNote, { color: c.mutedForeground }]}>
            You checked in on {checkinDays} of the last 7 days. {checkinDays > 0 ? "Thanks for noticing yourself." : "It's okay if today is the first."}
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20 },
  statRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 28, marginTop: 4 },
  statHint: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  cardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  barWrap: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, height: 140, gap: 6 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  barTrack: { width: "100%", height: 100, justifyContent: "flex-end", borderRadius: 6, overflow: "hidden" },
  barLabel: { fontFamily: "Inter_500Medium", fontSize: 10 },
  barNum: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  habitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { height: 10, width: 10, borderRadius: 5 },
  habitName: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  habitCount: { fontFamily: "Inter_500Medium", fontSize: 13 },
  kindNote: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20, marginTop: 6 },
});
