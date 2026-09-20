import React, { useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Member } from "../api/types";
import type { MembersStackParamList } from "../navigation/types";
import { colors, spacing } from "../theme";

type Props = NativeStackScreenProps<MembersStackParamList, "MembersList">;

export function MembersListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Member[]>("/members");
      setMembers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onDelete = (member: Member) => {
    Alert.alert("削除確認", `${member.name}さんを削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/members/${member.id}`);
            load();
          } catch (e) {
            Alert.alert("エラー", e instanceof ApiError ? e.message : "削除に失敗しました");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("MemberForm")}>
          <Text style={styles.addButtonText}>＋ スタッフを追加</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <Text style={[styles.role, item.role === "ADMIN" && styles.roleAdmin]}>
                {item.role === "ADMIN" ? "管理者" : "スタッフ"}
              </Text>
            </View>
            {isAdmin && item.id !== user?.id && (
              <TouchableOpacity onPress={() => onDelete(item)}>
                <Text style={styles.deleteLink}>削除</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing(1.4),
    borderRadius: 10,
    alignItems: "center",
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
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  email: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  role: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  roleAdmin: { color: colors.primary },
  deleteLink: { color: colors.danger, marginTop: spacing(1), fontWeight: "600" },
});
