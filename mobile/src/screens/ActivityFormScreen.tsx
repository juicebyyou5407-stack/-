import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api, ApiError } from "../api/client";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import type { CustomersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<CustomersStackParamList, "ActivityForm">;

const typeOptions = ["電話", "訪問", "メール", "来店", "その他"];

export function ActivityFormScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const [type, setType] = useState(typeOptions[0]);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!content.trim()) {
      setError("内容を入力してください");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post("/activities", { customerId, type, content });
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.label}>種別</Text>
        <View style={styles.typeRow}>
          {typeOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.typeChip, type === opt && styles.typeChipActive]}
              onPress={() => setType(opt)}
            >
              <Text style={[styles.typeChipText, type === opt && styles.typeChipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field
          label="内容"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          style={styles.textArea}
          placeholder="対応内容を記録してください"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title="記録する" onPress={onSubmit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing(2) },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6, fontWeight: "600" },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing(2) },
  typeChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  typeChipTextActive: { color: "#fff" },
  textArea: { height: 120, textAlignVertical: "top" },
  error: { color: colors.danger, marginBottom: spacing(1.5) },
});
