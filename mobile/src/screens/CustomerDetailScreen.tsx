import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api, ApiError } from "../api/client";
import { Button } from "../components/Button";
import type { CustomerDetail } from "../api/types";
import type { CustomersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<CustomersStackParamList, "CustomerDetail">;

const statusLabel: Record<string, string> = {
  ACTIVE: "契約中",
  PENDING: "手続き中",
  CANCELLED: "解約済",
  EXPIRED: "満了",
};

export function CustomerDetailScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<CustomerDetail>(`/customers/${customerId}`);
      setCustomer(data);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onDelete = () => {
    Alert.alert("削除確認", "この顧客を削除しますか？関連する契約・履歴も削除されます。", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/customers/${customerId}`);
            navigation.goBack();
          } catch (e) {
            Alert.alert("エラー", e instanceof ApiError ? e.message : "削除に失敗しました");
          }
        },
      },
    ]);
  };

  if (loading || !customer) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{customer.name}</Text>
        {customer.nameKana ? <Text style={styles.kana}>{customer.nameKana}</Text> : null}
        {customer.phone ? <Text style={styles.detailLine}>電話: {customer.phone}</Text> : null}
        {customer.email ? <Text style={styles.detailLine}>メール: {customer.email}</Text> : null}
        {customer.address ? <Text style={styles.detailLine}>住所: {customer.address}</Text> : null}
        {customer.memo ? <Text style={styles.memo}>{customer.memo}</Text> : null}

        <View style={styles.actionRow}>
          <Button
            title="編集"
            variant="secondary"
            onPress={() => navigation.navigate("CustomerForm", { customerId })}
            style={styles.actionButton}
          />
          <Button title="削除" variant="danger" onPress={onDelete} style={styles.actionButton} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>契約一覧</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ContractForm", { customerId })}>
          <Text style={styles.link}>＋ 契約を追加</Text>
        </TouchableOpacity>
      </View>
      {customer.contracts.length === 0 && <Text style={styles.emptyText}>契約はまだありません</Text>}
      {customer.contracts.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.productName}>{c.productName}</Text>
          <Text style={styles.detailLine}>状態: {statusLabel[c.status] ?? c.status}</Text>
          {c.premiumAmount != null && <Text style={styles.detailLine}>掛金: {c.premiumAmount.toLocaleString()}円{c.paymentCycle ? `(${c.paymentCycle})` : ""}</Text>}
          <Text style={styles.detailLine}>開始日: {new Date(c.startDate).toLocaleDateString("ja-JP")}</Text>
          {c.renewalDate && (
            <Text style={styles.renewalDate}>更新日: {new Date(c.renewalDate).toLocaleDateString("ja-JP")}</Text>
          )}
        </View>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>対応履歴</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ActivityForm", { customerId })}>
          <Text style={styles.link}>＋ 履歴を追加</Text>
        </TouchableOpacity>
      </View>
      {customer.activities.length === 0 && <Text style={styles.emptyText}>履歴はまだありません</Text>}
      {customer.activities.map((a) => (
        <View key={a.id} style={styles.card}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityType}>{a.type}</Text>
            <Text style={styles.activityDate}>{new Date(a.createdAt).toLocaleString("ja-JP")}</Text>
          </View>
          <Text style={styles.detailLine}>{a.content}</Text>
          {a.user?.name && <Text style={styles.activityUser}>担当: {a.user.name}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2) },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing(2),
  },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  kana: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  detailLine: { fontSize: 14, color: colors.text, marginTop: 6 },
  memo: { fontSize: 13, color: colors.textMuted, marginTop: 8, fontStyle: "italic" },
  actionRow: { flexDirection: "row", gap: spacing(1), marginTop: spacing(2) },
  actionButton: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  link: { color: colors.primary, fontWeight: "600" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
  },
  productName: { fontSize: 15, fontWeight: "700", color: colors.text },
  renewalDate: { fontSize: 13, color: colors.warning, marginTop: 6, fontWeight: "600" },
  activityHeader: { flexDirection: "row", justifyContent: "space-between" },
  activityType: { fontSize: 14, fontWeight: "700", color: colors.primary },
  activityDate: { fontSize: 12, color: colors.textMuted },
  activityUser: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
  emptyText: { color: colors.textMuted, marginBottom: spacing(1) },
});
