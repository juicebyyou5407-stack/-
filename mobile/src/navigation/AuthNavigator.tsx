import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterOrganizationScreen } from "../screens/RegisterOrganizationScreen";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="RegisterOrganization"
        component={RegisterOrganizationScreen}
        options={{ headerShown: true, title: "代理店登録" }}
      />
    </Stack.Navigator>
  );
}
