import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomersListScreen } from "../screens/CustomersListScreen";
import { CustomerDetailScreen } from "../screens/CustomerDetailScreen";
import { CustomerFormScreen } from "../screens/CustomerFormScreen";
import { ContractFormScreen } from "../screens/ContractFormScreen";
import { ActivityFormScreen } from "../screens/ActivityFormScreen";
import type { CustomersStackParamList } from "./types";

const Stack = createNativeStackNavigator<CustomersStackParamList>();

export function CustomersStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomersList" component={CustomersListScreen} options={{ title: "顧客一覧" }} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: "顧客詳細" }} />
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
      <Stack.Screen name="ContractForm" component={ContractFormScreen} />
      <Stack.Screen name="ActivityForm" component={ActivityFormScreen} options={{ title: "対応履歴を追加" }} />
    </Stack.Navigator>
  );
}
