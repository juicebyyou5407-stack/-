import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api, ApiError } from "../api/client";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import type { Customer } from "../api/types";
import type { CustomersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<CustomersStackParamList, "CustomerForm">;

export function CustomerFormScreen({ route, navigation }: Props) {
  const customerId = route.params?.customerId;
  const isEdit = Boolean(customerId);

  const [name, setName] = useState("");
  const [nameKana, setNameKana] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? "顧客を編集" : "顧客を追加" });
    if (customerId) {
      api.get<Customer>(`/customers/${customerId}`).then((c) => {
        setName(c.name);
        setNameKana(c.nameKana ?? "");
        setPhone(c.phone ?? "");
        setEmail(c.email ?? "");
        setAddress(c.address ?? "");
        setMemo(c.memo ?? "");
      });
    }
  }, [customerId]);

  const onSubmit = async () => {
    if (!name.trim()) {
      setError("氏名を入力してください");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = { name, nameKana, phone, email, address, memo };
      if (isEdit) {
        await api.put(`/customers/${customerId}`, payload);
      } else {
        await api.post("/customers", payload);
      }
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Field label="氏名 *" value={name} onChangeText={setName} placeholder="山田 太郎" />
        <Field label="フリガナ" value={nameKana} onChangeText={setNameKana} placeholder="ヤマダ タロウ" />
        <Field label="電話番号" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="090-1234-5678" />
        <Field label="メールアドレス" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Field label="住所" value={address} onChangeText={setAddress} />
        <Field label="メモ" value={memo} onChangeText={setMemo} multiline numberOfLines={4} style={styles.textArea} />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button title={isEdit ? "更新する" : "登録する"} onPress={onSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing(2) },
  textArea: { height: 100, textAlignVertical: "top" },
  error: { color: colors.danger, marginBottom: spacing(1.5) },
});
