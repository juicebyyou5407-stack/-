import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api, ApiError } from "../api/client";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import type { Contract, ContractStatus } from "../api/types";
import type { CustomersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<CustomersStackParamList, "ContractForm">;

const statusOptions: { value: ContractStatus; label: string }[] = [
  { value: "ACTIVE", label: "契約中" },
  { value: "PENDING", label: "手続き中" },
  { value: "CANCELLED", label: "解約済" },
  { value: "EXPIRED", label: "満了" },
];

function toDateInput(d?: string | null) {
  return d ? d.slice(0, 10) : "";
}

export function ContractFormScreen({ route, navigation }: Props) {
  const { customerId, contractId } = route.params;
  const isEdit = Boolean(contractId);

  const [productName, setProductName] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [status, setStatus] = useState<ContractStatus>("ACTIVE");
  const [premiumAmount, setPremiumAmount] = useState("");
  const [paymentCycle, setPaymentCycle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? "契約を編集" : "契約を追加" });
    if (contractId) {
      api.get<Contract>(`/contracts/${contractId}`).then((c) => {
        setProductName(c.productName);
        setContractNumber(c.contractNumber ?? "");
        setStatus(c.status);
        setPremiumAmount(c.premiumAmount != null ? String(c.premiumAmount) : "");
        setPaymentCycle(c.paymentCycle ?? "");
        setStartDate(toDateInput(c.startDate));
        setRenewalDate(toDateInput(c.renewalDate));
        setMemo(c.memo ?? "");
      });
    }
  }, [contractId]);

  const onSubmit = async () => {
    if (!productName.trim() || !startDate.trim()) {
      setError("商品名と契約開始日は必須です(開始日はYYYY-MM-DD形式)");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = {
        customerId,
        productName,
        contractNumber,
        status,
        premiumAmount: premiumAmount ? Number(premiumAmount) : undefined,
        paymentCycle,
        startDate,
        renewalDate: renewalDate || undefined,
        memo,
      };
      if (isEdit) {
        await api.put(`/contracts/${contractId}`, payload);
      } else {
        await api.post("/contracts", payload);
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
        <Field label="商品名 *" value={productName} onChangeText={setProductName} placeholder="生命共済" />
        <Field label="証券番号" value={contractNumber} onChangeText={setContractNumber} />

        <Text style={styles.label}>状態</Text>
        <View style={styles.statusRow}>
          {statusOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.statusChip, status === opt.value && styles.statusChipActive]}
              onPress={() => setStatus(opt.value)}
            >
              <Text style={[styles.statusChipText, status === opt.value && styles.statusChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field label="掛金(円)" value={premiumAmount} onChangeText={setPremiumAmount} keyboardType="number-pad" />
        <Field label="払込方法" value={paymentCycle} onChangeText={setPaymentCycle} placeholder="月払 / 年払" />
        <Field label="契約開始日 * (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} placeholder="2024-04-01" />
        <Field label="更新日 (YYYY-MM-DD)" value={renewalDate} onChangeText={setRenewalDate} placeholder="2025-04-01" />
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
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6, fontWeight: "600" },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing(2) },
  statusChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  statusChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  statusChipTextActive: { color: "#fff" },
});
