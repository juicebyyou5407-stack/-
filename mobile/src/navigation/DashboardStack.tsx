import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../screens/DashboardScreen";
import type { DashboardStackParamList } from "./types";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "ホーム" }} />
    </Stack.Navigator>
  );
}
