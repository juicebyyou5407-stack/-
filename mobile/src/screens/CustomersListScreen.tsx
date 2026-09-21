import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../api/client";
import { Field } from "../components/Field";
import type { Customer } from "../api/types";
import type { CustomersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<CustomersStackParamList, "CustomersList">;

export function CustomersListScreen({ navigation }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await api.get<Customer[]>(`/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(query);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <Field
            label=""
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              load(text);
            }}
            placeholder="氏名・フリガナ・電話番号で検索"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CustomerForm")}>
          <Text style={styles.addButtonText}>＋ 追加</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(query)} />}
        contentContainerStyle={customers.length === 0 && styles.emptyContainer}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>顧客が登録されていません</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            {item.nameKana && <Text style={styles.kana}>{item.nameKana}</Text>}
            {item.phone && <Text style={styles.phone}>{item.phone}</Text>}
            <Text style={styles.contractCount}>契約数: {item._count?.contracts ?? 0}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  searchRow: { flexDirection: "row", alignItems: "center", gap: spacing(1) },
  searchField: { flex: 1 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.4),
    borderRadius: 10,
    marginBottom: spacing(2),
  },
  addButtonText: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  kana: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  phone: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  contractCount: { fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: "600" },
  emptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.textMuted },
});
