import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardStackNavigator } from "./DashboardStack";
import { CustomersStackNavigator } from "./CustomersStack";
import { ContractsStackNavigator } from "./ContractsStack";
import { MembersStackNavigator } from "./MembersStack";
import { colors } from "../theme";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, string> = {
  DashboardTab: "🏠",
  CustomersTab: "👤",
  ContractsTab: "📄",
  MembersTab: "👥",
};

const labels: Record<keyof MainTabParamList, string> = {
  DashboardTab: "ホーム",
  CustomersTab: "顧客",
  ContractsTab: "契約",
  MembersTab: "メンバー",
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabel: labels[route.name as keyof MainTabParamList],
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{icons[route.name as keyof MainTabParamList]}</Text>,
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStackNavigator} />
      <Tab.Screen name="CustomersTab" component={CustomersStackNavigator} />
      <Tab.Screen name="ContractsTab" component={ContractsStackNavigator} />
      <Tab.Screen name="MembersTab" component={MembersStackNavigator} />
    </Tab.Navigator>
  );
}
