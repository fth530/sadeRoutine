import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { HabitCard } from "@/components/HabitCard";
import { EmptyState } from "@/components/EmptyState";

export default function Habits() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { habits, profile } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const addBtn = (
    <Pressable onPress={() => router.push("/habit-form")} style={({ pressed }) => [styles.add, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
      <Feather name="plus" size={18} color={c.primaryForeground} />
    </Pressable>
  );

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}>
      <ScreenHeader title="Habits" subtitle="Small, repeatable, kind." right={addBtn} />
      <View style={styles.body}>
        {habits.length === 0 ? (
          <EmptyState icon="plus-circle" title="No habits yet" subtitle="Tap + to add your first one. Start with something almost laughably small." />
        ) : (
          <View style={{ gap: 10 }}>
            {habits.map(h => <HabitCard key={h.id} habit={h} hideStreak={profile?.adhdMode} />)}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20 },
  add: { height: 40, width: 40, alignItems: "center", justifyContent: "center" },
});
