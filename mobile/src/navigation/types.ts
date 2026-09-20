import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  RegisterOrganization: undefined;
};

// CustomerDetail/CustomerForm/ContractForm/ActivityForm live only in the
// Customers tab's stack. Other tabs jump into this stack via the parent tab
// navigator (see navigateToCustomer in navigation/helpers.ts) instead of
// duplicating these screens, so there is exactly one place that owns them.
export type CustomersStackParamList = {
  CustomersList: undefined;
  CustomerDetail: { customerId: string };
  CustomerForm: { customerId?: string } | undefined;
  ContractForm: { customerId: string; contractId?: string };
  ActivityForm: { customerId: string };
};

export type ContractsStackParamList = {
  ContractsList: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type MembersStackParamList = {
  MembersList: undefined;
  MemberForm: undefined;
};

export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  CustomersTab: NavigatorScreenParams<CustomersStackParamList>;
  ContractsTab: NavigatorScreenParams<ContractsStackParamList>;
  MembersTab: NavigatorScreenParams<MembersStackParamList>;
};
