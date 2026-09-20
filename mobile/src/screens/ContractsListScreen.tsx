import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../api/client";
import type { Contract, ContractStatus } from "../api/types";
import type { ContractsStackParamList } from "../navigation/types";
import { navigateToCustomer } from "../navigation/helpers";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<ContractsStackParamList, "ContractsList">;

const statusLabel: Record<ContractStatus, string> = {
  ACTIVE: "契約中",
  PENDING: "手続き中",
  CANCELLED: "解約済",
  EXPIRED: "満了",
};

const filters: { value: ContractStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "すべて" },
  { value: "ACTIVE", label: "契約中" },
  { value: "PENDING", label: "手続き中" },
  { value: "CANCELLED", label: "解約済" },
  { value: "EXPIRED", label: "満了" },
];

export function ContractsListScreen({ navigation }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState<ContractStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status: ContractStatus | "ALL") => {
    setLoading(true);
    try {
      const data = await api.get<Contract[]>(`/contracts${status !== "ALL" ? `?status=${status}` : ""}`);
      setContracts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(filter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.chip, filter === f.value && styles.chipActive]}
            onPress={() => {
              setFilter(f.value);
              load(f.value);
            }}
          >
            <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={contracts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(filter)} />}
        contentContainerStyle={contracts.length === 0 && styles.emptyContainer}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>契約がありません</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToCustomer(navigation, item.customerId)}
          >
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.customerName}>{item.customer?.name}</Text>
            <Text style={styles.status}>{statusLabel[item.status]}</Text>
            {item.renewalDate && (
              <Text style={styles.renewalDate}>
                更新日: {new Date(item.renewalDate).toLocaleDateString("ja-JP")}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing(2) },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
  },
  productName: { fontSize: 15, fontWeight: "700", color: colors.text },
  customerName: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  status: { fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: "600" },
  renewalDate: { fontSize: 12, color: colors.warning, marginTop: 4, fontWeight: "600" },
  emptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.textMuted },
});
