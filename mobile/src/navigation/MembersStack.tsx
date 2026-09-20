import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MembersListScreen } from "../screens/MembersListScreen";
import { MemberFormScreen } from "../screens/MemberFormScreen";
import type { MembersStackParamList } from "./types";

const Stack = createNativeStackNavigator<MembersStackParamList>();

export function MembersStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MembersList" component={MembersListScreen} options={{ title: "メンバー" }} />
      <Stack.Screen name="MemberForm" component={MemberFormScreen} options={{ title: "スタッフを追加" }} />
    </Stack.Navigator>
  );
}
