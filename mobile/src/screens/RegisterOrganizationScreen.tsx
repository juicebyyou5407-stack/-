import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { ApiError } from "../api/client";
import { colors, spacing } from "../theme";

export function RegisterOrganizationScreen() {
  const { registerOrganization } = useAuth();
  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await registerOrganization({
        organizationName: organizationName.trim(),
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>代理店を新規登録</Text>
        <Text style={styles.subtitle}>あなたが最初の管理者になります</Text>

        <Field label="代理店名" value={organizationName} onChangeText={setOrganizationName} placeholder="〇〇共済代理店" />
        <Field label="お名前" value={name} onChangeText={setName} placeholder="山田 太郎" />
        <Field
          label="メールアドレス"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <Field
          label="パスワード(8文字以上)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="登録する" onPress={onSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing(3), justifyContent: "center", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: spacing(0.5) },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing(3) },
  error: { color: colors.danger, marginBottom: spacing(1.5) },
});
