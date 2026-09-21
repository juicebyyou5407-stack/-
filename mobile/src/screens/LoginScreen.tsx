import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { ApiError } from "../api/client";
import { colors, spacing } from "../theme";
import type { AuthStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>共済代理店CRM</Text>
      <Text style={styles.subtitle}>アカウントにログイン</Text>

      <Field
        label="メールアドレス"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <Field
        label="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="ログイン" onPress={onSubmit} loading={loading} />

      <Button
        title="新しく代理店を登録する"
        variant="secondary"
        onPress={() => navigation.navigate("RegisterOrganization")}
        style={styles.registerButton}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: spacing(3), backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: spacing(0.5) },
  subtitle: { fontSize: 15, color: colors.textMuted, marginBottom: spacing(3) },
  error: { color: colors.danger, marginBottom: spacing(1.5) },
  registerButton: { marginTop: spacing(1.5) },
});
