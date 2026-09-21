import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Contract } from "../api/types";
import type { DashboardStackParamList } from "../navigation/types";
import { navigateToCustomer } from "../navigation/helpers";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<DashboardStackParamList, "Dashboard">;

export function DashboardScreen({ navigation }: Props) {
  const { user, organization, logout } = useAuth();
  const [renewals, setRenewals] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Contract[]>("/contracts/renewals/upcoming?days=30");
      setRenewals(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orgName}>{organization?.name}</Text>
          <Text style={styles.userName}>{user?.name} さん</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>ログアウト</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>まもなく更新の契約(30日以内)</Text>

      <FlatList
        data={renewals}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={renewals.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>直近の更新対象契約はありません</Text> : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToCustomer(navigation, item.customerId)}
          >
            <Text style={styles.customerName}>{item.customer?.name}</Text>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.renewalDate}>
              更新日: {item.renewalDate ? new Date(item.renewalDate).toLocaleDateString("ja-JP") : "-"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing(2),
  },
  orgName: { fontSize: 20, fontWeight: "800", color: colors.text },
  userName: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  logout: { color: colors.primary, fontWeight: "600" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.text, marginBottom: spacing(1) },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing(2),
    marginBottom: spacing(1),
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerName: { fontSize: 16, fontWeight: "700", color: colors.text },
  productName: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  renewalDate: { fontSize: 13, color: colors.warning, marginTop: 4, fontWeight: "600" },
  emptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.textMuted },
});
