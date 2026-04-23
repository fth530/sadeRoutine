import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";
import { ScreenHeader } from "@/components/ScreenHeader";
import { RoutineCard } from "@/components/RoutineCard";
import { EmptyState } from "@/components/EmptyState";

export default function Routines() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { routines } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 100 : insets.bottom + 90;

  const addBtn = (
    <Pressable onPress={() => router.push("/routine-form")} style={({ pressed }) => [styles.add, { backgroundColor: c.primary, borderRadius: c.radius, opacity: pressed ? 0.85 : 1 }]}>
      <Feather name="plus" size={18} color={c.primaryForeground} />
    </Pressable>
  );

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}>
      <ScreenHeader title="Routines" subtitle="Sequences you can lean on, even on hard days." right={addBtn} />
      <View style={styles.body}>
        {routines.length === 0 ? (
          <EmptyState icon="list" title="No routines yet" subtitle="A routine is a few small steps in order. Tap + to build one." />
        ) : (
          <View style={{ gap: 12 }}>
            {routines.map(r => <RoutineCard key={r.id} routine={r} />)}
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
