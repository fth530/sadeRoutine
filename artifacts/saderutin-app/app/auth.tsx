import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/contexts/AppContext";

export default function Auth() {
  const c = useColors();
  const { signUp, startDemo } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const valid = name.trim().length > 0 && email.trim().length > 0;
  const onSubmit = () => {
    if (!valid) return;
    signUp(name, email);
    router.replace("/onboarding");
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen options={{ title: "", headerShadowVisible: false, headerStyle: { backgroundColor: c.background as string }, headerTintColor: c.foreground as string }} />
      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.scroll} bottomOffset={20} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: c.foreground }]}>Create a local account</Text>
        <Text style={[styles.sub, { color: c.mutedForeground }]}>No password. No server. Just a name on this device.</Text>

        <Text style={[styles.label, { color: c.mutedForeground }]}>What should we call you?</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />

        <Text style={[styles.label, { color: c.mutedForeground }]}>Email (optional, for export)</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" placeholderTextColor={c.mutedForeground} style={[styles.input, { color: c.foreground, borderColor: c.border, backgroundColor: c.card, borderRadius: c.radius }]} />

        <Pressable onPress={onSubmit} disabled={!valid} style={({ pressed }) => [styles.btn, { backgroundColor: c.primary, borderRadius: c.radius, opacity: !valid ? 0.4 : pressed ? 0.85 : 1 }]}>
          <Text style={[styles.btnText, { color: c.primaryForeground }]}>Continue</Text>
          <Feather name="arrow-right" size={18} color={c.primaryForeground} />
        </Pressable>

        <Pressable onPress={() => { startDemo(); router.replace("/(tabs)"); }} style={styles.demoLink}>
          <Text style={[styles.demoText, { color: c.accent }]}>Or try the demo without signing up</Text>
        </Pressable>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 22, gap: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.3 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 4, marginBottom: 18 },
  label: { fontFamily: "Inter_500Medium", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 14, fontFamily: "Inter_400Regular", fontSize: 16, minHeight: 50 },
  btn: { marginTop: 24, minHeight: 54, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  demoLink: { alignItems: "center", marginTop: 16 },
  demoText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
