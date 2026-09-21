import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ContractsListScreen } from "../screens/ContractsListScreen";
import type { ContractsStackParamList } from "./types";

const Stack = createNativeStackNavigator<ContractsStackParamList>();

export function ContractsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ContractsList" component={ContractsListScreen} options={{ title: "契約一覧" }} />
    </Stack.Navigator>
  );
}
