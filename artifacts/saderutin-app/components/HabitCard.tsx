import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { Habit } from "@/lib/types";
import { currentStreak, isCompletedOn } from "@/lib/streaks";
import { useApp } from "@/contexts/AppContext";
import { getTodayStr } from "@/lib/dates";

export function HabitCard({ habit, hideStreak }: { habit: Habit; hideStreak?: boolean }) {
  const c = useColors();
  const { habitLogs, toggleHabit, lowEnergy } = useApp();
  const today = getTodayStr();
  const done = isCompletedOn(habit.id, today, habitLogs);
  const streak = currentStreak(habit, habitLogs);

  const onToggle = () => {
    Haptics.impactAsync(done ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    toggleHabit(habit.id, today);
  };

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, borderRadius: c.radius }]}>
      <Pressable onPress={onToggle} hitSlop={8} style={({ pressed }) => [styles.check, { borderColor: done ? habit.color : c.border, backgroundColor: done ? habit.color : "transparent", opacity: pressed ? 0.7 : 1 }]}>
        {done ? <Feather name="check" size={18} color="#fff" /> : null}
      </Pressable>
      <Pressable style={styles.body} onPress={() => router.push({ pathname: "/habit-form", params: { id: habit.id } })}>
        <Text style={[styles.name, { color: c.foreground, textDecorationLine: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }]} numberOfLines={1}>{habit.name}</Text>
        <View style={styles.metaRow}>
          {!hideStreak && streak > 0 ? (
            <Text style={[styles.meta, { color: c.mutedForeground }]}>{streak} day{streak === 1 ? "" : "s"} in a row</Text>
          ) : (
            <Text style={[styles.meta, { color: c.mutedForeground }]}>{habit.frequency === "daily" ? "Daily" : habit.frequency === "weekdays" ? "Weekdays" : `${habit.perWeek ?? 3}x / week`}</Text>
          )}
          {lowEnergy && habit.minimumNote ? (
            <Text style={[styles.minNote, { color: c.accent }]} numberOfLines={1}>· {habit.minimumNote}</Text>
          ) : null}
        </View>
      </Pressable>
      <Feather name="chevron-right" size={18} color={c.mutedForeground} style={{ marginLeft: 4 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderWidth: StyleSheet.hairlineWidth },
  check: { height: 28, width: 28, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 4 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  meta: { fontFamily: "Inter_400Regular", fontSize: 12 },
  minNote: { fontFamily: "Inter_500Medium", fontSize: 12, flex: 1 },
});
